import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/global--style-module.js';
import './playpause-control.js';
import './sound-control.js';
import './live-indicator.js';
import './videotime-display.js';
import './speed-control.js';
import './playlist-chapter-list-switch.js';
import './interactive-transcript-control.js';
import './quiz-overlay-switch.js';
import './download-button.js';
import './add-note-button.js';
import './add-marker-button.js';
import './quality-control.js';
import './mute-control.js';
import './stream-switch-control.js';
import './full-screen-control.js';
import './caption-control.js';
import './playlist-navigation-control.js';
import './mobile-settings-menu.js';
import { PolymerElement, html } from '@polymer/polymer';

const SKIP_SECONDS = 15;
const TEXT_ELEMENT_TAG_NAMES = ['INPUT', 'TEXTAREA'];

class ControlBar extends IocRequesterMixin(BindingHelpersMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="global--style-module">
        :host {
          display: block;
        }

        #container__control_bar {
          display: flex;
          align-items: stretch;
          padding: 0 7px;
          @apply --set-foreground-color;
          @apply --set-background-color;
        }

        /* This class shall be used to define from which element on
        the content is shown on the right side of the controlbar */
        .filler {
          flex-grow: 1;
          justify-content: flex-end;
        }

        @media (max-width: 290px) {
          videotime-display {
            display: none;
          }
        }
        @media (max-width: 390px) {
          playlist-navigation-control {
            display: none;
          }
        }
        @media (max-width: 768px) {
          .hidden-for-mobile {
            display: none;
          }
        }
        @media (min-width: 769px) {
          .hidden-for-desktop {
            display: none;
          }
        }

        playlist-navigation-control, playpause-control {
          margin-right: 10px;
        }
        playlist-chapter-list-switch {
            margin-left: 12px;
        }
        sound-control {
          flex-basis: 5%;
          margin-left: -3px;
        }

      </style>

      <div id="container__control_bar">
        <!-- Left button section -->
        <template is="dom-if" if="[[previousVideo]]">
          <playlist-navigation-control direction="backward" video-url="[[previousVideo.url]]"></playlist-navigation-control>
        </template>
        <playpause-control state="[[state]]"></playpause-control>
        <template is="dom-if" if="[[nextVideo]]">
          <playlist-navigation-control direction="forward" video-url="[[nextVideo.url]]"></playlist-navigation-control>
        </template>

        <!-- All elements after this one are aligned on the right side -->
        <div class="filler"></div>

        <!-- Live Indicator -->
        <template is="dom-if" if="[[state.live]]">
          <live-indicator state="[[state]]"></live-indicator>
        </template>

        <!-- Video Time -->
        <template is="dom-if" if="[[_showVideoTime]]">
          <videotime-display state="[[state]]"></videotime-display>
        </template>

        <!-- Right button section -->
        <template is="dom-if" if="[[hasItems(captions)]]">
          <caption-control state="[[state]]" captions="[[captions]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></caption-control>
        </template>
        <template is="dom-if" if="[[hasItems(captions)]]">
          <interactive-transcript-control state="[[state]]" captions="[[captions]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></interactive-transcript-control>
        </template>
        <template is="dom-if" if="[[!state.live]]">
          <speed-control state="[[state]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></speed-control>
        </template>
        <template is="dom-if" if="[[hasItems(availableQualities, 2)]]">
          <quality-control state="[[state]]" qualities="[[availableQualities]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></quality-control>
        </template>
        <template is="dom-if" if="[[hasChapters]]">
          <playlist-chapter-list-switch state="[[state]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></playlist-chapter-list-switch>
        </template>
        <template is="dom-if" if="[[hasQuestions]]">
          <quiz-overlay-switch state="[[state]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></quiz-overlay-switch>
        </template>

        <template is="dom-if" if="[[downloadUri]]">
          <download-button downloadUri="[[downloadUri]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></download-button>
        </template>

        <template is="dom-if" if="[[noteApi]]">
          <add-marker-button state="[[state]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></add-marker-button>
          <add-note-button state="[[state]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></add-note-button>
        </template>


        <template is="dom-if" if="[[hasFallbackStream]]">
          <stream-switch-control state="[[state]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></stream-switch-control>
        </template>

        <!-- Sound controls -->
        <mute-control state="[[state]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></mute-control>
        <sound-control state="[[state]]" class$="[[ifThen(mobileMenu, 'hidden-for-mobile')]]"></sound-control>

        <!-- Settings menu for mobile devices -->
        <template is="dom-if" if="[[mobileMenu]]">
          <mobile-settings-menu state="[[state]]" class="hidden-for-desktop" caption-languages="[[captionLanguages]]" available-qualities="[[availableQualities]]" has-fallback-stream="[[hasFallbackStream]]" number-of-streams="[[numberOfStreams]]">
          </mobile-settings-menu>
        </template>

        <!-- Fullscreen -->
        <full-screen-control state="[[state]]"></full-screen-control>
      </div>
    `;
  }

  static get is() { return 'control-bar'; }

  static get properties() {
    return {
      state: Object,
      live: Object,
      hasChapters: Boolean,
      hasQuestions: Boolean,
      downloadUri: String,
      noteApi: String,
      hasFallbackStream: Boolean,
      previousVideo: Object,
      nextVideo: Object,
      captions: Array,
      availableQualities: Boolean,
      numberOfStreams: Number,
      mobileMenu: Boolean,
      liveDvr: Boolean,
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      _showVideoTime: Boolean,
    };
  }

  static get observers() {
    return [
      '_setShowVideoTime(state.live, liveDvr)',
    ];
  }

  ready() {
    super.ready();

    // Add event listener for keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || TEXT_ELEMENT_TAG_NAMES.includes(document.activeElement.tagName)) {
        // Do nothing, if the event was already processed, a system shortcut
        // including a modifier key was pressed or an text input is focussed
        return;
      }

      if (this.state.isQuizOverlayVisible) {
        // Do nothing if the quiz overlay is currently shown
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Right') {
        this._analyticsManager.changeState('skipSeconds', [SKIP_SECONDS], {verb: ANALYTICS_TOPICS.VIDEO_SEEK});
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        this._analyticsManager.changeState('skipSeconds', [-SKIP_SECONDS], {verb: ANALYTICS_TOPICS.VIDEO_SEEK});
      } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'p') {
        this._analyticsManager.changeState('togglePlayPause', [], {verb: ANALYTICS_TOPICS.PLAY_PAUSE});
      } else if (e.key === 'f') {
        // In IE, fullscreen cannot be enabled by keyboard events.
        // Therefore, fullscreen is only enabled in other browsers.
        // However, disabling fullscreen works in IE.
        if(!('ActiveXObject' in window) || this.state.fullscreen) {
          this._analyticsManager.changeState('toggleFullscreen', [], {verb: ANALYTICS_TOPICS.VIDEO_FULLSCREEN});
        }
      } else {
        return;
      }

      // Make sure the user doesn't trigger anything else with their
      // keyboard interaction, like scrolling the page
      e.preventDefault();
    });
  }

  _setShowVideoTime(live, dvr) {
    // Strangely enough, defining _showVideoTime as computed property
    // breaks property binding within dom-if template.
    // Therefore, _showVideoTime is set explicitly.
    this._showVideoTime = !live || dvr;
  }
}

window.customElements.define(ControlBar.is, ControlBar);
