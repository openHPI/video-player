import { PLAY_STATES } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/overlay--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class WaitingOverlay extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="overlay--style-module">
        #container__waiting_overlay {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #icon_spinner {
          opacity: 0.9;
          font-size: 6vw;
          @apply --set-accent-color-foreground;
        }
      </style>

      <div id="container__waiting_overlay" class="overlay" style$="visibility: [[ifThenElse(_isVisible, 'visible', 'hidden')]];">
        <fontawesome-icon id="icon_spinner" prefix="fas" name="spinner" spin></fontawesome-icon>
      </div>
    `;
  }

  static get is() { return 'waiting-overlay'; }

  static get properties() {
    return {
      state: Object,
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _isVisible: {
        type: Boolean,
        value: false,
      },
      _timer: Object,
    };
  }

  static get observers() {
    return [
      '_playStateChanged(state.playState)',
    ];
  }

  _playStateChanged(playState) {
    // Show overlay only if state is WAITING for at least 250ms
    if(playState === PLAY_STATES.WAITING) {
      this._timer = setTimeout(() => {
        this._isVisible = playState === PLAY_STATES.WAITING;
      }, 250);
    } else {
      this._isVisible = false;
      clearTimeout(this._timer);
    }
  }
}

window.customElements.define(WaitingOverlay.is, WaitingOverlay);
