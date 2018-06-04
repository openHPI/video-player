import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/control-bar--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class FullscreenControl extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
        #container__fullscreen_control {
          border-right: none;
        }
      </style>

      <div id="container__fullscreen_control" class="user_controls">
        <a id="button__fullscreen" class="button" on-click="handleClick" href="javascript:void(0)">
          <fontawesome-icon prefix="fas" name="[[ifThenElse(state.fullscreen, 'compress', 'expand')]]" fixed-width></fontawesome-icon>
        </a>
      </div>
    `;
  }

  static get is() { return 'full-screen-control'; }

  static get properties() {
    return {
      state: Object,
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
    };
  }

  handleClick() {
    this._analyticsManager.changeState('toggleFullscreen', [], {verb: ANALYTICS_TOPICS.VIDEO_FULLSCREEN});
  }
}

window.customElements.define(FullscreenControl.is, FullscreenControl);
