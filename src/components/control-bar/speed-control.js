import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/control-bar--style-module.js';
import '../base-components/select-control.js';
import { PolymerElement, html } from '@polymer/polymer';

class SpeedControl extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
        #container__speed_control {
          width: 100%;
        }
      </style>

      <div id="container__speed_control">
        <select-control state="[[state]]" items="[[_items]]" selected-value="[[state.playbackRate]]"
                        on-change="_selectionChanged" icon-prefix="fas" icon-name="tachometer-alt" 
                        is-in-mobile-menu="[[isInMobileMenu]]">
        </select-control>
      </div>
    `;
  }

  static get is() { return 'speed-control'; }

  static get properties() {
    return {
      state: Object,
      playbackRates: Array,
      isInMobileMenu: {
        type: Boolean,
        value: false,
      },
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      _items: {
        type: Array,
        computed: '_getItems()',
      },
    };
  }

  _getItems() {
    return this.playbackRates
      .sort()
      .reverse()
      .map(playbackRate => ({
        text: this.toFixedOrEmpty(playbackRate, 1) + 'x',
        value: playbackRate,
      }));
  }

  _selectionChanged(e) {
    this._analyticsManager.changeState('setPlaybackRate', [e.target.selectedValue], {verb: ANALYTICS_TOPICS.VIDEO_CHANGE_SPEED});
  }
}

window.customElements.define(SpeedControl.is, SpeedControl);
