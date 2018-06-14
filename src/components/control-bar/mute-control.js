import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/control-bar--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class MuteControl extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
        #container__mute_control {
          border-right: none;
        }
      </style>

      <div id="container__mute_control" class="user_controls">
        <a id="button__mute" class="button" on-click="_handleClick" href="javascript:void(0)">
          <fontawesome-icon prefix="fas" name="[[ifThenElse(_isMuted, 'volume-off', 'volume-up')]]" fixed-width></fontawesome-icon>
        </a>
      </div>
    `;
  }

  static get is() { return 'mute-control'; }

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
      _isMuted: {
        type: Boolean,
        computed: '_getIsMuted(state.muted, state.volume)',
      },
    };
  }

  _getIsMuted(muted, volume) {
    return muted || volume === 0;
  }

  _handleClick() {
    this._analyticsManager.changeState('toggleMute', [], {verb: ANALYTICS_TOPICS.VIDEO_VOLUME_CHANGE});
  }
}

window.customElements.define(MuteControl.is, MuteControl);
