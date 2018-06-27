import { PLAY_STATES, SECONDS_TO_NEXT_VIDEO } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/overlay--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class NextVideoOverlay extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="overlay--style-module">
        #container__next-video_overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          z-index: 8;
          background-color: rgba(0, 0, 0, 0.85);
          color: white;
        }

        .container__spinner {
          position: relative;
        }
        .container__spinner #timer {
          position: absolute;
          top: calc(50% - 12px);
          left: calc(50% - 3px);
        }

        #icon_spinner {
          opacity: 0.9;
          font-size: 6vw;
          @apply --set-accent-color-foreground;
        }

        #container__next_video_text {
          display: flex;
          align-items: center;
          flex-direction: column;
          margin-bottom: 20px;
        }

        #text__next_video {
          font-size: 20px;
        }

        #text__next_video_title {
          margin-top: 5px;
        }

        #button__disable_next_video {
          margin-top: 10px;
          text-decoration: none;
          color: white;
        }

        @media (max-width: 768px) {
          #text__next_video {
            font-size: 15px;
          }
          #icon_spinner {
            font-size: 50px;
          }
        }
      </style>

      <div id="container__next-video_overlay" class="overlay" style$="visibility: [[ifThenElse(_isVisible, 'visible', 'hidden')]];">
        <div id="container__next_video_text">
          <span id="text__next_video">[[localize('next-video-overlay--next-video-label')]]</span>
          <template is="dom-if" if="[[nextVideo.title]]">
            <span id="text__next_video_title">[[nextVideo.title]]</span>
          </template>
        </div>
        <div class="container__spinner">
          <fontawesome-icon id="icon_spinner" prefix="fas" name="spinner" spin></fontawesome-icon>
          <span id="timer">[[_secondsToNextVideo]]</span>
        </div>
        <a id="button__disable_next_video" class="button" on-click="_handleClick" href="javascript:void(0)">[[localize('general--cancel')]]</a>
      </div>
    `;
  }

  static get is() { return 'next-video-overlay'; }

  static get properties() {
    return {
      state: Object,
      nextVideo: Object,
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _isVisible: {
        type: Boolean,
        computed: '_getIsVisible(state.playState, _isEnabled)',
      },
      _isEnabled: {
        type: Boolean,
        value: true,
      },
      _timer: Object,
      _secondsToNextVideo: Number,
    };
  }

  static get observers() {
    return [
      '_playStateChanged(state.playState)',
      '_positionChanged(state.position, state.duration)',
    ];
  }

  ready() {
    super.ready();

    // Add event listener for keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (!e.defaultPrevented && e.key === 'Escape') {
        this._clearTimer();
        e.preventDefault();
      }
    });
  }

  _getIsVisible(playState, isAutoPlayEnabled) {
    return playState === PLAY_STATES.FINISHED && isAutoPlayEnabled;
  }

  _handleClick(){
    this._clearTimer();
    this._isEnabled = false;
  }

  _playStateChanged(playState) {
    if (playState === PLAY_STATES.FINISHED && this._isEnabled) {
      this._startTimer();
    } else if(playState === PLAY_STATES.PLAYING) {
      this._clearTimer();
    }
  }

  _positionChanged(position, duration) {
    if(position !== duration) {
      this._clearTimer();
    }
  }

  _startTimer() {
    // Do nothing, if timer is already running
    if(this._timer)
      return;

    this._secondsToNextVideo = SECONDS_TO_NEXT_VIDEO;
    this._timer = setInterval(() => {
      this._secondsToNextVideo = this._secondsToNextVideo - 1;
      if(this._secondsToNextVideo === 0) {
        window.open(this.nextVideo.url, '_self');
        this._clearTimer();
      }
    }, 1000);
  }

  _clearTimer() {
    if(this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
}

window.customElements.define(NextVideoOverlay.is, NextVideoOverlay);
