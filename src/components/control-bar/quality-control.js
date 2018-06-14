import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/control-bar--style-module.js';
import '../base-components/select-control.js';
import { PolymerElement, html } from '@polymer/polymer';

class QualityControl extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
        #container__quality_switch {
          width: 100%;
        }
      </style>

      <div id="container__quality_switch">
        <select-control state="[[state]]" items="[[_items]]" selected-value="[[state.quality]]"
                        on-change="_selectionChanged" icon-prefix="fas" icon-name="desktop"
                        is-in-mobile-menu="[[isInMobileMenu]]">
        </select-control>
      </div>
    `;
  }

  static get is() { return 'quality-control'; }

  static get properties() {
    return {
      state: Object,
      qualities: Array,
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
        computed: '_getItems(qualities, localize)',
      },
    };
  }

  _getItems(qualities) {
    if(this.localize) {
      return qualities.map(quality => ({
        text: this.localize(`quality-control--quality-${quality}`),
        value: quality,
      }));
    }
  }

  _selectionChanged(e) {
    this._analyticsManager.changeState('setQuality', [e.target.selectedValue], {verb: ANALYTICS_TOPICS.VIDEO_CHANGE_QUALITY});
  }
}

window.customElements.define(QualityControl.is, QualityControl);
