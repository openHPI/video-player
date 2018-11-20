import { VERSION, DEFAULT_STATE, DEFAULT_CONFIGURATION, PLAY_STATES, CAPTION_TYPES,
         QUALITY_MODES, PLAYING_EVENT_NAME, THEMES, ANALYTICS_TOPICS } from './constants.js';
import { configurationSchema } from './configuration-schema.js';
import { IocProviderMixin } from './mixins/ioc-provider.js';
import { IocRequesterMixin } from './mixins/ioc-requester.js';
import { BindingHelpersMixin } from './mixins/binding-helpers.js';
import { HlsHelper } from './helpers/hls-helper.js';
import { UrlFragmentHelper } from './helpers/url-fragment-helper.js';
import { StateManager } from './services/state-manager.js';
import { IndicatorManager } from './services/indicator-manager.js';
import { ConfigurationValidator } from './services/configuration-validator.js';
import { FullscreenManager } from './services/fullscreen-manager.js';
import { SynchronizationManager } from './services/synchronization-manager.js';
import { UserPreferencesManager } from './services/user-preferences-manager.js';
import { AnalyticsManager } from './services/analytics-manager.js';
import { Localizer } from './services/localizer.js';
import './styling/mixins.js';
import './styling/global--style-module.js';
import './components/video-stream.js';
import './components/playlist-chapter-list.js';
import './components/interactive-transcript.js';
import './components/overlays/waiting-overlay.js';
import './components/overlays/next-video-overlay.js';
import './components/overlays/finished-overlay.js';
import './components/overlays/captions-display.js';
import './components/overlays/quiz-overlay.js';
import './components/control-bar/control-bar.js';
import './components/progress-container/video-progress.js';
import './components/progress-container/slide-preview-bar.js';
import './components/dual-stream.js';
import './components/video-object-renderer.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import { updateStyles } from '@polymer/polymer/lib/mixins/element-mixin.js';
import { PolymerElement, html } from '@polymer/polymer';

class VideoPlayer extends BindingHelpersMixin(IocRequesterMixin(IocProviderMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="global--style-module">
        :host {
          display: block;
          min-width: 152px;
          border: 1px solid grey;
          background-color: black;
        }

        #video-player-container:-webkit-full-screen {
          width: 100%;
        }
        #video-player-container:-moz-full-screen {
          width: 100%;
        }
        #video-player-container:-ms-fullscreen {
          width: 100%;
        }

        #video-player-container {
          position: relative;
          height: 100%;
        }
        #video-player-container.fake-fullscreen {
          /* Actually, what we would want here is to set the height to 100vh...but
             in mobile browsers this results in the content being bigger than what
             the browser is able to display. For more information, see
             https://nicolas-hoizey.com/2015/02/viewport-height-is-taller-than-the-visible-part-of-the-document-in-some-mobile-browsers.html */
          width: 100vw;
          position: fixed;
          left: 0;
          top: 0;
          /* Should be displayed above every other content on the given website */
          z-index: 1050;
          background-color: white;
        }

        #video-container {
          position: relative;
        }

        #streams-container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          overflow: hidden;
        }
        #streams-container > .video-presenter:not(.first) {
          margin-top: 4px;
        }

        #control-bar {
          border-top: 1px solid black;
        }

        @media (max-width: 768px) {
          .hidden-for-mobile {
            display: none;
          }
        }
      </style>

      <div id="video-player-container">
        <!-- Render VideoObject as JSON-LD, if provided -->
        <template is="dom-if" if="[[configuration.videoObject]]">
          <video-object-renderer video-object="[[configuration.videoObject]]"></video-object-renderer>
        </template>

        <div id="video-container">
          <!-- Videos Overlays -->
          <waiting-overlay state="[[state]]"></waiting-overlay>
          <template is="dom-if" if="[[and(_nextVideo, configuration.playlist.autoPlay)]]">
            <next-video-overlay state="[[state]]" next-video="[[_nextVideo]]"></next-video-overlay>
          </template>
          <template is="dom-if" if="[[hasItems(configuration.relatedVideos)]]">
            <finished-overlay state="[[state]]" related-videos="[[configuration.relatedVideos]]"></finished-overlay>
          </template>
          <template is="dom-if" if="[[_hasQuestions]]">
            <quiz-overlay state="[[state]]" questions="[[configuration.quiz.questions]]" callback="[[configuration.quiz.validationCallback]]"></quiz-overlay>
          </template>

          <!-- Video Streams -->
          <div id="streams-container" style$="height: [[_calculateHeight(state.fullscreen, state.showInteractiveTranscript, configuration.slides)]];">
            <template is="dom-if" if="[[!state.fallbackStreamActive]]" restamp="true">
              <template is="dom-repeat" items="[[_partitionStreams(configuration.streams)]]">
                <template is="dom-if" if="[[hasItems(item, 2)]]">
                  <dual-stream class$="video-presenter [[ifEqualsThen(index, 0, 'first')]]" state="[[state]]" index="[[index]]"  style$="height: calc(100% / [[_rowCount(configuration.streams)]]);">
                    <video-stream slot="video1" state="[[state]]" props="[[arrayItem(item, 0)]]" preload="[[configuration.videoPreload]]" captions="[[ifEqualsThen(index, 0, configuration.captions)]]"></video-stream>
                    <video-stream slot="video2" state="[[state]]" props="[[arrayItem(item, 1)]]" preload="[[configuration.videoPreload]]"></video-stream>
                  </dual-stream>
                </template>
                <template is="dom-if" if="[[!hasItems(item, 2)]]">
                  <video-stream slot="video1" class$="video-presenter [[ifEqualsThen(index, 0, 'first')]]" state="[[state]]" props="[[arrayItem(item, 0)]]" preload="[[configuration.videoPreload]]" captions="[[ifEqualsThen(index, 0, configuration.captions)]]" style="height: 100%;"></video-stream>
                </template>
              </template>
            </template>
            <template is="dom-if" if="[[state.fallbackStreamActive]]" restamp="true">
              <video-stream state="[[state]]" props="[[configuration.fallbackStream]]" preload="[[configuration.videoPreload]]" captions="[[configuration.captions]]" style$="height: calc(100% / [[_rowCount(configuration.streams)]]);" is-fallback="true">
              </video-stream>
            </template>
          </div>
          <captions-display state="[[state]]"></captions-display>
        </div>

        <!-- Progress Bars -->
        <template is="dom-if" if="[[_showProgressBar]]">
          <div id="progress-container">
            <template is="dom-if" if="[[hasItems(configuration.slides)]]">
              <slide-preview-bar state="[[state]]" slides="[[configuration.slides]]" class="hidden-for-mobile"></slide-preview-bar>
            </template>
            <video-progress state="[[state]]" indicators="[[indicators]]"></video-progress>
          </div>
        </template>

        <!-- Control Bar -->
        <control-bar id="control-bar" state="[[state]]" live="[[configuration.live]]" has-chapters="[[hasItems(configuration.chapters)]]" has-questions="[[_hasQuestions]]" has-fallback-stream="[[_hasFallbackStream]]" captions="[[configuration.captions]]" available-qualities="[[state.availableQualities]]" previous-video="[[_previousVideo]]" next-video="[[_nextVideo]]" number-of-streams="[[configuration.streams.length]]" live-dvr="[[configuration.liveDvr]]" mobile-menu="[[configuration.mobileMenu]]" download-uri="[[configuration.downloadUri]]" note-api="[[configuration.noteApi]]"> </control-bar>

        <!-- Chapter List -->
        <playlist-chapter-list state="[[state]]" chapters="[[configuration.chapters]]" playlist="[[configuration.playlist]]" show-if="[[state.isChapterListShown]]">
        </playlist-chapter-list>

        <!-- Interactive Transcript -->
        <interactive-transcript state="[[state]]" show-if="[[and(state.activeCaptions, state.showInteractiveTranscript)]]"></interactive-transcript>
      </div>
  `;
  }

  static get is() { return 'video-player'; }

  // A function is used to determine default values of properties to
  // ensure that each element gets its own copy of the value, rather than
  // having an object or array shared across all instances of the element.
  static get properties() {
    return {
      configuration: {
        type: Object,
        value: () => ({}),
      },
      state: {
        type: Object,
        value: () => ({}),
      },
      indicators: {
        type: Array,
        value: () => ([]),
      },
      isReady: {
        type: Boolean,
        value: () => false,
      },
      version: {
        type: String,
        value: () => VERSION,
        readOnly: true,
      },
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _indicatorManager: {
        type: Object,
        inject: 'IndicatorManager',
      },
      _fullscreenManager: {
        type: Object,
        inject: 'FullscreenManager',
      },
      _userPreferencesManager: {
        type: Object,
        inject: 'UserPreferencesManager',
      },
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      _configurationValidator: {
        type: Object,
        inject: 'ConfigurationValidator',
      },
      _localizer: {
        type: Object,
        inject: 'Localizer',
      },
      _previousVideo: {
        type: Object,
        computed: '_getPreviousVideo(configuration.playlist.currentPosition, configuration.playlist.entries)',
      },
      _nextVideo: {
        type: Object,
        computed: '_getNextVideo(configuration.playlist.currentPosition, configuration.playlist.entries)',
      },
      _hasFallbackStream: {
        type: Boolean,
        computed: '_getHasFallbackStream(configuration.streams, configuration.fallbackStream, _isIOS)',
      },
      _hasQuestions: {
        type: Boolean,
        computed: '_getHasQuestions(configuration.quiz.questions, configuration.quiz.validationCallback)',
      },
      _isIOS: {
        type: Boolean,
        computed: '_getIsIOS()',
      },
      _showProgressBar: Boolean,
      _isConfigurationInitialized: Boolean,
      _isConfigurationObserverLocked: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get observers() {
    return [
      '_configurationChanged(configuration, _configurationValidator)',
      '_isReadyChanged(isReady)',
      '_setAvailableQualities(configuration.streams, state.fallbackStreamActive, configuration.fallbackStream, _stateManager)',
      '_ensureValidQuality(state.availableQualities, state.quality)',
      '_foregroundColorChanged(configuration.foregroundColor)',
      '_accentColorChanged(configuration.accentColor)',
      '_fontColorOnAccentColorChanged(configuration.fontColorOnAccentColor)',
      '_backgroundColorChanged(configuration.backgroundColor)',
      '_secondaryBackgroundColorChanged(configuration.secondaryBackgroundColor)',
      '_themeChanged(configuration.theme)',
      '_languageChanged(configuration.language, _localizer)',
      '_trimStartChanged(configuration.trimVideo.start)',
      '_trimEndChanged(configuration.trimVideo.end)',
      '_playStateChanged(state.playState)',
      '_fullscreenChanged(state.fullscreen)',
      '_userPreferencesStateChanged(state.*)',
      '_positionChanged(state.position)',
      '_checkIfReady(state.playState, state.duration)',
      '_setShowProgressBar(state.live, state.liveDvr)',
      '_setShowProgressBar(state.live, configuration.liveDvr)',
    ];
  }

  /** Public Interface */

  play() { this._stateManager.play(); }
  pause() { this._stateManager.pause(); }
  seek(seconds) { this._stateManager.setPosition(seconds); }
  setPlaybackRate(playbackRate) { this._stateManager.setPlaybackRate(playbackRate); }
  setQuality(quality) { this._stateManager.setQuality(quality); }
  setVolume(volume) { this._stateManager.setVolume(volume); }
  mute() { this._stateManager.mute(); }
  unmute() { this._stateManager.unmute(); }
  showCaptions(language, type = null) {
    this._stateManager.setSelectedCaptions(language, type);
    this._stateManager.setCaptionsVisibility(true);
  }
  hideCaptions() { this._stateManager.setCaptionsVisibility(false); }
  showInteractiveTranscript(language, type = null) {
    this._stateManager.setSelectedCaptions(language, type);
    this._stateManager.setInteractiveTranscriptVisibility(true);
  }
  hideInteractiveTranscript() { this._stateManager.setInteractiveTranscriptVisibility(false); }
  setResizerRatio(ratio, index = 0) { this._stateManager.setResizerRatio(index, ratio); }
  setResizerRatios(ratios) { this._stateManager.setResizerRatios(ratios); }
  enterFullscreen() { this._stateManager.setFullscreen(true); }
  exitFullscreen() { this._stateManager.setFullscreen(false); }
  reloadConfiguration() {
    // Clone configuration to reevaluate all observers
    this.configuration = Object.assign({}, this.configuration);
  }
  noteApiChanged() { this._indicatorManager.noteApiChanged(); }


  /** Internal Methods */

  bindServices(iocKernel) {
    super.bindServices(iocKernel);

    iocKernel.bind('StateManager').toFunction(() => new StateManager(this, 'state', 'configuration')).inSingletonScope();
    iocKernel.bind('IndicatorManager').toFunction(() => new IndicatorManager(this, 'indicators', 'configuration')).inSingletonScope();
    iocKernel.bind('UserPreferencesManager').toFunction(() => new UserPreferencesManager()).inSingletonScope();
    iocKernel.bind('ConfigurationValidator').toFunction(() => new ConfigurationValidator(configurationSchema)).inSingletonScope();
    iocKernel.bind('SynchronizationManager').toFunction(() => new SynchronizationManager(iocKernel.get('StateManager'))).inSingletonScope();
    iocKernel.bind('FullscreenManager').toFunction(() => new FullscreenManager(this.$['video-player-container'])).inSingletonScope();
    iocKernel.bind('AnalyticsManager').toFunction(() => new AnalyticsManager(this, iocKernel.get('StateManager'))).inSingletonScope();
    iocKernel.bind('Localizer').toFunction(() => new Localizer()).inSingletonScope();
  }

  servicesInjectedCallback() {
    super.servicesInjectedCallback();

    // Reads initial position from URL fragment, if config option is enabled
    if(this.configuration.positionInUrlFragment) {
      let startPosition = parseInt(UrlFragmentHelper.getParameter('t'));
      if(startPosition) {
        this.configuration.initialState.position = startPosition;
      }
    }

    // Build state from provided intial state configuration and default values
    this.state = Object.assign({}, DEFAULT_STATE, this.state, this.configuration.initialState, this._userPreferencesManager.getPreferences(), this.configuration.userPreferences);

    // Initialize FullscreenManager
    this._fullscreenManager.onFullscreenChanged((fullscreen) => {
      if(this.state.fullscreen !== fullscreen) {
        this._analyticsManager.changeState('setFullscreen', [fullscreen], {verb: ANALYTICS_TOPICS.VIDEO_FULLSCREEN});
      }
    });

    // Set volume to 1 for mobile devices
    // Since I had no mobile device I had no chance to test this. However it should work according to
    // https://coderwall.com/p/i817wa/one-line-function-to-detect-mobile-devices-with-javascript
    if(window.orientation) {
      this._stateManager.setVolume(1.0);
    }
  }

  ready() {
    super.ready();

    // Listen for events from other instances to pause playback when
    // another instance starts playing
    window.addEventListener(PLAYING_EVENT_NAME, (e) => {
      if(e.detail && e.detail.sender !== this) {
        this._analyticsManager.changeState('pause', [], {verb: ANALYTICS_TOPICS.VIDEO_PAUSE});
      }
    });
  }

  _configurationInitialized() {
    // In iOS playing multiple videos concurrently is currently not supported.
    // Therefore, the fallback is used allways in iOS
    if(this._isIOS && this.hasItems(this.configuration.streams, 2)) {
      this._stateManager.setFallbackStreamActive(true);
    }
  }

  _setAvailableQualities(streams, fallbackStreamActive, fallbackStream) {
    if (this._stateManager && streams) {
      let supportedQualities = Object.values(QUALITY_MODES);
      if(!HlsHelper.hasHlsSupport) {
        supportedQualities = supportedQualities.filter(quality => quality !== QUALITY_MODES.HLS);
      }

      let qualities;
      if(fallbackStreamActive) {
        qualities = supportedQualities.filter(quality => Object.keys(fallbackStream).includes(quality));
      } else {
        qualities = supportedQualities.filter(quality => streams.every(stream => Object.keys(stream).includes(quality)));
      }
      this._stateManager.setAvailableQualities(qualities);
    }
  }

  _getPreviousVideo(currentPosition, entries) {
    if(entries && currentPosition > 0 && entries.length > 1) {
      return entries[currentPosition - 1];
    }
  }

  _getNextVideo(currentPosition, entries) {
    if(entries && currentPosition >= 0 && currentPosition < entries.length - 1) {
      return entries[currentPosition + 1];
    }
  }

  _getHasFallbackStream(streams, fallbackStream, isIOS) {
    // In iOS playing multiple videos concurrently is currently not supported.
    // Therefore, the fallback is used allways in iOS
    return !isIOS && this.hasItems(streams, 2) && fallbackStream;
  }

  _getHasQuestions(questions, validationCallback) {
    return questions && questions.length > 0 && validationCallback;
  }

  _getIsIOS() {
    const iDevices = [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ];

    if (navigator.platform) {
      while (iDevices.length) {
        if (navigator.platform === iDevices.pop()) {
          return true;
        }
      }
    }

    return false;
  }

  _configurationChanged(configuration) {
    if(this._configurationValidator && !this._isConfigurationObserverLocked) {
      // Remove null values form configuration
      for (let value in configuration) {
        // eslint-disable-next-line eqeqeq
        if(configuration[value] == null) {
          delete configuration[value];
        }
      }

      // Validate configuration
      this._configurationValidator.validate(this.configuration);

      // Lock observer before chaning the configuration
      this._isConfigurationObserverLocked = true;

      // Fill missing properties in provided configuration with default values
      if(Object.keys(DEFAULT_CONFIGURATION).filter(x => !Object.keys(configuration).includes(x)).length > 0) {
        this.configuration = Object.assign({}, DEFAULT_CONFIGURATION, configuration);
      }

      // Set default caption types
      this.configuration.captions.filter(item => typeof item.type === 'undefined')
                                 .forEach(item => item.type = CAPTION_TYPES.DEFAULT);

      // Native HLS implementation of Safari does not support DVR for live streams
      if(HlsHelper.hasNativeHlsSupport) {
        this.configuration.liveDvr = false;
      }

      // Enable configuration observer again
      this._isConfigurationObserverLocked = false;

      // Invoke callback, if configuration was initally loaded
      if(!this._isConfigurationInitialized) {
        this._configurationInitialized();
        this._isConfigurationInitialized = true;
      }
    }
  }

  _isReadyChanged(isReady) {
    if(isReady) {
      this.dispatchEvent(new CustomEvent('ready'));
    }
  }

  _ensureValidQuality(availableQualities, quality) {
    // If not all streams are available in the specified quality, use one that is available for all streams
    if(this._stateManager && !availableQualities.includes(quality)) {
      let quality = Object.values(QUALITY_MODES)
                          .find(x => availableQualities.includes(x));
      this._stateManager.setQuality(quality);
    }
  }

  _playStateChanged(playState) {
    if(playState === PLAY_STATES.PLAYING) {
      // Set alreadyPlayed flag indicating that the video was initially played.
      this._stateManager.setAlreadyPlayed();

      // Dispatch event if video is playing to stop playback on other instances
      let event = new CustomEvent(PLAYING_EVENT_NAME, {
        detail: {
          sender: this,
        },
      });
      window.dispatchEvent(event);
    }
  }

  _positionChanged() {
    if (this._analyticsManager) {
      this._analyticsManager.newEvent({verb: ANALYTICS_TOPICS.VIDEO_TIME_CHANGE}, {});
    }
  }

  _checkIfReady(playState, duration) {
    if(playState !== PLAY_STATES.WAITING && duration > 0) {
      this.isReady = true;
    }
  }

  _fullscreenChanged(fullscreen) {
    if(this._fullscreenManager) {
      if (fullscreen) {
        this._fullscreenManager.enterFullscreen();
      } else {
        this._fullscreenManager.exitFullscreen();
      }
    }
  }

  // Since Firefox does not support WebComponents and shadow DOMs, it is not possible to set this in the CSS part.
  // The properties are not correctly evaluated and thus the variable not set.
  _foregroundColorChanged(color) {
    if(color) {
      updateStyles({'--foreground-color': color});
    }
  }
  _accentColorChanged(color) {
    if(color) {
      updateStyles({'--accent-color': color});
    }
  }
  _fontColorOnAccentColorChanged(color) {
    if(color) {
      updateStyles({'--font-color-on-accent-color': color});
    }
  }
  _backgroundColorChanged(color) {
    if(color) {
      updateStyles({'--background-color': color});
    }
  }
  _secondaryBackgroundColorChanged(color) {
    if(color) {
      updateStyles({'--secondary-background-color': color});
    }
  }
  _themeChanged(name) {
    if(name in THEMES) {
      // Set colors of theme only if not explicitly determined in configuration
      if(typeof this.configuration.foregroundColor === 'undefined') {
        this._foregroundColorChanged(THEMES[name].foregroundColor);
      }
      if(typeof this.configuration.accentColor === 'undefined') {
        this._accentColorChanged(THEMES[name].accentColor);
      }
      if(typeof this.configuration.fontColorOnAccentColor === 'undefined') {
        this._fontColorOnAccentColorChanged(THEMES[name].fontColorOnAccentColor);
      }
      if(typeof this.configuration.backgroundColor === 'undefined') {
        this._backgroundColorChanged(THEMES[name].backgroundColor);
      }
      if(typeof this.configuration.secondaryBackgroundColor === 'undefined') {
        this._secondaryBackgroundColorChanged(THEMES[name].secondaryBackgroundColor);
      }
    }
  }

  _languageChanged(language) {
    if(this._localizer) {
      this._localizer.setLanguage(language);
    }
  }

  _trimStartChanged(trimStart) {
    if(this._stateManager) {
      this._stateManager.trimStart(trimStart);
    }
  }

  _trimEndChanged(trimEnd) {
    if(this._stateManager) {
      this._stateManager.trimEnd(trimEnd);
    }
  }

  _userPreferencesStateChanged() {
    if (this._userPreferencesManager) {
      this._userPreferencesManager.setPreferences(this.state);
    }
  }

  _setShowProgressBar(live, dvr) {
    // Strangely enough, defining _showProgressBar as computed property
    // breaks property binding within dom-if template.
    // Therefore, _showProgressBar is set explicitly.
    this._showProgressBar = !live || dvr;
  }

  _partitionStreams(streams) {
    return streams.reduce((acc, item) => {
      if(acc.length === 0 || acc[acc.length - 1].length === 2) {
        acc.push([item]);
      } else {
        acc[acc.length - 1].push(item);
      }
      return acc;
    }, []);
  }

  _rowCount(streams) {
    return Math.ceil(streams.length / 2);
  }

  _calculateHeight(fullscreen, showInteractiveTranscript, isLectureSlides) {
    if(fullscreen) {
      return 'calc(100vh - ' + [[this._bottomSpace(showInteractiveTranscript, isLectureSlides)]] + 'px)';
    } else {
      return 'calc(100% - ' + [[this._bottomSpace(showInteractiveTranscript, isLectureSlides)]] + 'px)';
    }
  }

  _bottomSpace(showInteractiveTranscript, isLectureSlides) {
    let value;
    // Controlbar height & progres bar height
    value = 40 + 16;
    if(showInteractiveTranscript) {
      value += 200;
    }
    if(isLectureSlides) {
      value += 11;
    }
    // On iPads in full screen mode, the navigation bar is permanently
    // displayed so we have to subtract even more for them.
    if(window.navigator.platform === 'iPad') {
      value += 63;
    } else if (window.navigator.platform === 'iPhone') {
      if(window.orientation === 90 || window.orientation === -90) {
        value += 33;
      } else {
        value += 55;
      }
    }
    return value;
  }
}

window.customElements.define(VideoPlayer.is, VideoPlayer);
