import {PLAY_STATES, QUALITY_MODES, SEEK_DIFF_THRESHOLD, ANALYTICS_TOPICS} from '../constants.js';
import 'hls.js/dist/hls.light.js';
import { BindingHelpersMixin } from '../mixins/binding-helpers.js';
import { IocRequesterMixin } from '../mixins/ioc-requester.js';
import { HlsHelper } from '../helpers/hls-helper.js';
import '../styling/global--style-module.js';
import { PolymerElement, html } from '@polymer/polymer';

class VideoStream extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="global--style-module">
        :host {
          user-drag: none;
          user-select: none;
          -moz-user-select: none;
          -webkit-user-drag: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          background-color: black;
        }

        #container__video_stream {
          position: relative;
          width: 100%;
          height: auto; /* TODO: changed from 100% to fix resizer quickly */
          /* Without line-height: 0, there will be a black bar underneath videos for unknown reasons. */
          line-height: 0;
        }
        video {
          width: inherit;
          height: inherit;
        }

        #container__poster_overlay {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 4;
        }

        #image__poster {
          width: 100%;
          height: 100%;
        }
      </style>

      <div id="container__video_stream">
        <!-- "playsinline" is for iOS to not use its native video player -->
        <video id="video" preload$="[[ifThenElse(preload, 'auto', 'metadata')]]" on-click="_handleClick" on-loadedmetadata="_handleLoadedMetadata" playsinline="true">
          <template is="dom-repeat" items="[[captions]]">
            <track id="[[index]]" src="[[item.url]]" kind="subtitles" srclang="[[item.language]]" data-type$="[[item.type]]" on-load="_handleTrackLoaded" default$="[[_isActive(item.language, item.type, state.captionLanguage, state.captionType)]]">
          </template>
        </video>
        <template is="dom-if" if="[[and(props.poster, _isPosterVisible)]]">
          <div id="container__poster_overlay">
            <img id="image__poster" src="[[props.poster]]" alt="Poster" on-click="_handleClick">
          </div>
        </template>
      </div>
    `;
  }

  static get is() { return 'video-stream'; }

  static get properties() {
    return {
      state: Object,
      props: Object,
      captions: Array,
      preload: {
        type: Boolean,
        value: true,
      },
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      _synchronizationManager: {
        type: Object,
        inject: 'SynchronizationManager',
      },
      _currentUrl: String,
      _isRegistered: {
        type: Boolean,
        value: false,
      },
      _isInitializingVideo: {
        type: Boolean,
        value: true,
      },
      _hlsClient: Object,
      _isPosterVisible: {
        type: Boolean,
        computed: '_getIsPosterVisible(state.playState, state.live, state.position, state.trimStart, state.trimEnd)',
      },
    };
  }

  static get observers() {
    return [
      '_playStateChanged(state.playState)',
      '_positionChanged(state.position)',
      '_playbackRateChanged(state.playbackRate)',
      '_volumeChanged(state.volume)',
      '_mutedChanged(state.muted, props.muted)',
      '_captionLanguageTypeChanged(state.captionLanguage, state.captionType, _stateManager)',
      '_qualityChanged(props, preload, state.quality, _isRegistered)',
    ];
  }

  servicesInjectedCallback() {
    super.servicesInjectedCallback();
    this._synchronizationManager.registerVideo(this.$.video);
    this._isRegistered = true;

    // Preserve liveSync while waiting for new live fragments
    this._synchronizationManager.onVideosReady(() => {
      if(this.state.live && this.state.liveSync) {
        this._stateManager.setPosition(this.state.livePosition);
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._synchronizationManager.unregisterVideo(this.$.video);
    this._isRegistered = false;

    // Stop playback and unload source
    this.$.video.pause();
    this.$.video.src = '';
    this.$.video.load();
  }

  _getIsPosterVisible(playState, live, position, trimStart, trimEnd) {
    if(!this.state.alreadyPlayed || playState === PLAY_STATES.FINISHED) {
      return true;
    }

    return !live && playState === PLAY_STATES.PAUSED && (position === trimStart || position === trimEnd);
  }

  _isActive(language, type, selectedLanguage, selectedType) {
    return language === selectedLanguage && type === selectedType;
  }

  _playStateChanged(playState) {
    if(this._isInitializingVideo) {
      return;
    }

    let promise;
    if (playState === PLAY_STATES.PLAYING) {
      promise = this.$.video.play();
    } else if(!this.$.video.paused && this.$.video.readyState > 2) {
      promise = this.$.video.pause();
    }

    // If error occured while applying play state on video, update the
    // play state with regard to the video status.
    // This can happen for example in Safari when autoplay is active,
    // because Safari does not allow to play a video without the user
    // clicking a button
    if(promise) {
      promise.catch(() => {
        if(this.$.video.paused)
          this._stateManager.pause();
        else
          this._stateManager.play();
      });
    }
  }

  _positionChanged(position) {
    if(this._isInitializingVideo) {
      return;
    }

    if(Math.abs(this.$.video.currentTime - position) > SEEK_DIFF_THRESHOLD) {
      this.$.video.currentTime = position;
      return true;
    }

    return false;
  }

  _playbackRateChanged(playbackRate) {
    if(!this._isInitializingVideo) {
      this.$.video.playbackRate = playbackRate;
    }
  }

  _volumeChanged(volume) {
    if(!this._isInitializingVideo) {
      this.$.video.volume = volume;
    }
  }

  _mutedChanged(muted) {
    if(this.props.muted) {
      this.$.video.muted = true;
    } else if(!this._isInitializingVideo) {
      this.$.video.muted = muted;
    }
  }

  _qualityChanged(props, preload, quality, isRegistered) {
    if(!isRegistered) {
      return;
    }

    // Initialize video source change
    let initialSetup = !this.$.video.src;
    this._isInitializingVideo = true;
    this._synchronizationManager.setWaiting(this.$.video);

    // Reapply current state to video element after the new source has been loaded
    this._synchronizationManager.onVideosReady(() => {
      this._isInitializingVideo = false;
      this._applyState(initialSetup);
    }, true);

    // Destroy old hls client
    if(this._hlsClient) {
      this._hlsClient.destroy();
    }

    // Change source depending on quality
    let url = props[quality];
    if(HlsHelper.hasNativeHlsSupport || quality !== QUALITY_MODES.HLS) {
      // The src attribute can not be updated using data bindings
      // since the binding may be overwritten by hls.js
      this.$.video.setAttribute('src', url);
      this.$.video.load();
    } else {

      let usedBuffferSize;
      if(preload) {
        usedBuffferSize = 60*1000*1000;
      } else {
        usedBuffferSize = 1;
      }

      // Create and configure new hls client for existing video element
      this._hlsClient = new Hls({
        nudgeMaxRetry: 20,
        fragLoadingMaxRetry: 20,
        levelLoadingMaxRetry: 20,
        manifestLoadingMaxRetry: 20,
        maxBufferSize: usedBuffferSize,
      });
      this._hlsClient.on(Hls.Events.LEVEL_LOADED, this._handleHlsLevelLoaded.bind(this));
      this._hlsClient.on(Hls.Events.ERROR, (e, data) => {
        // Reload manifest, if error occurred during loading
        if(data.details === 'manifestLoadError') {
          setTimeout(() => {
            if(this._hlsClient.url === url) {
              this._hlsClient.loadSource(url);
            }
          }, 2000);
          return;
        }

        // Try to recover from other errors
        if (data.fatal) {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              this._hlsClient.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              this._hlsClient.recoverMediaError();
              break;
          }
        }
      });
      this._hlsClient.loadSource(url);
      this._hlsClient.attachMedia(this.$.video);
    }
  }

  _captionLanguageTypeChanged(language, type) {
    if(this.captions && this._stateManager) {
      // Set cues to null, so that they cannot get toggled by interactive-transcript-control
      if(language === 'off') {
        this._stateManager.setActiveCaptions(null);
      }

      // Disable all caption tracks
      let textTracks = Array.from(this.$.video.textTracks);
      textTracks.forEach(textTrack => textTrack.mode = 'disabled');

      // Extract cues of selected caption track and update state accordingly
      let trackElement = this.$.video.querySelector(`track[srclang='${language}'][data-type='${type}']`);
      if(!trackElement) {
        return;
      }
      let textTrack = textTracks[trackElement.id];
      if(textTrack) {
        textTrack.mode = 'showing';
        // If captions are not yet loaded, they will be set in
        // _handleTrackLoaded when load event is dispatched.
        this._stateManager.setActiveCaptions(Array.from(textTrack.cues));
        // Change back to 'hidden' since we have our own HTML elements for
        // displaying captions. Before this, we tried hiding captions
        // via the CSS ::cue pseudo-class but Firefox and Microsoft Edge
        // didn't play along. This here works well across browsers.
        textTrack.mode = 'hidden';
      }
    }
  }

  _handleTrackLoaded(e) {
    // Update state with loaded cues, if corresponding captions are still selected
    let textTrack = e.target.track;
    if(this.state.captionLanguage === e.model.item.language && this.state.captionType === e.model.item.type) {
      this._stateManager.setActiveCaptions(Array.from(textTrack.cues));
    }

    // Change back to 'hidden' since we have our own HTML elements for
    // displaying captions. (see above)
    textTrack.mode = 'hidden';
  }

  _handleClick() {
    this._analyticsManager.changeState('togglePlayPause', [], {verb: ANALYTICS_TOPICS.PLAY_PAUSE});
  }

  _handleLoadedMetadata() {
    // Dispatch event letting other components know that the video has
    // been loaded (i.e. ResizerControl)
    this.dispatchEvent(new CustomEvent('loaded-video', {
      bubbles: true,
      detail: {
        resolution: {
          height: this.$.video.videoHeight,
          width: this.$.video.videoWidth,
        },
      },
    }));
  }

  _handleHlsLevelLoaded(e, data) {
    if(this._synchronizationManager && !this._synchronizationManager.isMaster(this.$.video)) {
      return;
    }

    // Set live indicator
    let live = data.details.live;
    let oldLive = this._stateManager.state.live;
    this._stateManager.setLive(live);
    if(!live) {
      // Transition from live to not live indicates that the stream has ended
      if(oldLive) {
        this._stateManager.setPlayState(PLAY_STATES.FINISHED);
      }
      return;
    }

    // Update live states
    let livePosition = this._hlsClient.liveSyncPosition;
    let startPosition = data.details.fragments[0].start;
    let totalDuration = data.details.totalduration;
    let fragmentDuration = data.details.targetduration;
    if(!livePosition) {
      // Calculate fallback live position if liveSyncPosition is not set, yet.
      let hiddenAreaDuration = this._hlsClient.config.liveSyncDurationCount * fragmentDuration;
      livePosition = Math.max(0, totalDuration - hiddenAreaDuration);
    }
    this._stateManager.setLivePosition(livePosition);
    this._stateManager.setLiveFragmentDuration(fragmentDuration);
    this._stateManager.setLiveStartPosition(startPosition);
  }

  _applyState(initial) {
    // Make sure that playState is first applies after seek process
    this.$.video.addEventListener('seeked', () => this._playStateChanged(this.state.playState), {once: true});
    let seeked = this._positionChanged(this.state.position);
    this._playbackRateChanged(this.state.playbackRate);
    this._volumeChanged(this.state.volume);
    this._mutedChanged(this.state.muted);
    if(!seeked) {
      this._playStateChanged(this.state.playState);
    }

    // If live-stream was initially loaded, enable liveSync
    if(initial && this.state.live) {
      this._stateManager.setLiveSync(true);
    }
  }
}

window.customElements.define(VideoStream.is, VideoStream);
