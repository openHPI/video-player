import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/control-bar--style-module.js';
import '../base-components/select-control.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class streamSwitchControl extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
      </style>

      <template is="dom-if" if="[[!isInMobileMenu]]">
        <div id="container__stream-switch_control" class="user_controls">
          <a id="button__stream-switch" class="button" on-click="_handleClick" href="javascript:void(0)">
            <fontawesome-icon prefix="[[iconPrefix]]" name="[[iconName]]" fixed-width></fontawesome-icon>
          </a>
        </div>
      </template>
      <template is="dom-if" if="[[isInMobileMenu]]">
          <select-control state="[[state]]" items="[[_getItems()]]" selected-value="[[_getSelectedValue()]]"
                          on-change="_selectionChanged" icon-prefix="fas" icon-name="columns"
                          is-in-mobile-menu="true">
        </select-control>
      </template>
    `;
  }

  static get is() { return 'stream-switch-control'; }

  static get properties() {
    return {
      state: Object,
      iconPrefix: String,
      iconName: String,
      numberOfStreams: Number,
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      isInMobileMenu: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get observers() {
    return [
      '_streamChanged(state.fallbackStreamActive)',
    ];
  }

  _getItems() {
    return [
      {
        text: '1',
        value: 1,
      },
      {
        value: this.numberOfStreams,
        text: '' + this.numberOfStreams,
      },
    ];
  }

  _getSelectedValue() {
    return this.state.fallbackStreamActive? 1 : this.numberOfStreams;
  }

  _streamChanged(fallbackStream) {
    if (fallbackStream) {
      this.iconPrefix = 'fas';
      this.iconName = 'columns';
    } else {
      this.iconPrefix = 'far';
      this.iconName = 'clone';
    }
  }

  _selectionChanged(e) {
    if (this._getSelectedValue() !== e.target.selectedValue) {
      this._stateManager.toggleFallbackStream();
    }
  }

  _handleClick() {
    this._analyticsManager.changeState('toggleFallbackStream', [], {verb: ANALYTICS_TOPICS.VIDEO_DUAL_STREAM_CHANGE});
  }
}

window.customElements.define(streamSwitchControl.is, streamSwitchControl);
