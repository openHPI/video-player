
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/control-bar--style-module.js';
import './caption-control.js';
import './interactive-transcript-control.js';
import './speed-control.js';
import './quality-control.js';
import './stream-switch-control.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class MobileSettingsMenu extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
        .mobile-settings-menu-content {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.7);

          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .user_controls.open {
          @apply --set-accent-color-background;
        }

        #mobile-settings-menu__select > [is-in-mobile-menu="true"] {
          margin: 4px 0;
          background-color: rgba(255, 255, 255, 0.4);
        }
      </style>

      <div id="mobile-settings-menu" class="user_controls">
        <div class="mobile-settings-menu-container">
          <a id="button__select" class="button" on-click="_toggleMobileSettingsMenu">
            <fontawesome-icon prefix="fas" name="cog" fixed-width></fontawesome-icon>
          </a>
          <div id="mobile-settings-menu__select" class$="mobile-settings-menu-content [[ifNotThen(_isMobileSettingsMenuOpen, '-hidden')]]" style$="bottom: [[_calcBottomValue(state.showInteractiveTranscript)]];">
            <template is="dom-if" if="[[captionLanguages]]">
            <caption-control is-in-mobile-menu="true" state="[[state]]" languages="[[captionLanguages]]">
              </caption-control>
            </template>
            <template is="dom-if" if="[[captionLanguages]]">
              <interactive-transcript-control is-in-mobile-menu="true" state="[[state]]" languages="[[captionLanguages]]">
              </interactive-transcript-control>
            </template>
            <speed-control is-in-mobile-menu="true" playback-rates="[[playbackRates]]" state="[[state]]"></speed-control>
            <template is="dom-if" if="[[_hasMultipleQualities]]">
              <quality-control is-in-mobile-menu="true" state="[[state]]" qualities="[[availableQualities]]">
              </quality-control>
            </template>
            <template is="dom-if" if="[[hasFallbackStream]]">
              <stream-switch-control is-in-mobile-menu="true" state="[[state]]" number-of-streams="[[numberOfStreams]]" class="hidden-for-mobile"></stream-switch-control>
            </template>
          </div>
        </div>
      </div>
    `;
  }

  static get is() { return 'mobile-settings-menu'; }

  static get properties() {
    return {
      state: Object,
      captionLanguages: Array,
      availableQualities: Boolean,
      hasFallbackStream: Boolean,
      numberOfStreams: Number,
      playbackRates: Array,
      _isMobileSettingsMenuOpen: {
        type: Boolean,
        value: false,
      },
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _hasMultipleQualities: {
        type: Boolean,
        computed: '_getHasMultipleQualities(availableQualities)',
      },
    };
  }

  static get observers() {
    return [
      '_mobileSettingsMenuChanged(state.mobileSettingsMenuOpen)',
    ];
  }

  ready() {
    super.ready();
  }

  _toggleMobileSettingsMenu() {
    this._stateManager.setMobileSettingsMenuOpen(!this._isMobileSettingsMenuOpen);
  }

  _mobileSettingsMenuChanged(menuOpen) {
    this._isMobileSettingsMenuOpen = menuOpen;
    if(this._isMobileSettingsMenuOpen) {
      this.$['mobile-settings-menu'].classList.add('open');
    } else {
      this.$['mobile-settings-menu'].classList.remove('open');
    }
  }

  _getHasMultipleQualities() {
    return this.availableQualities.length > 1;
  }

  _calcBottomValue(showInteractiveTranscript) {
    if(showInteractiveTranscript) {
      return '240px';
    } else {
      return '40px';
    }
  }
}

window.customElements.define(MobileSettingsMenu.is, MobileSettingsMenu);
