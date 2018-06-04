import { ANALYTICS_TOPICS, PLAY_STATES } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/control-bar--style-module.js';
import { PolymerElement, html } from '@polymer/polymer';

class LiveIndicator extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
        #span__live_indicator {
          width: initial;
          text-align: initial;
          font-weight: bold;
          @apply --set-accent-color-foreground;
        }
        #span__live_indicator.inactive {
          color: grey;
        }
        #span__live_indicator fontawesome-icon {
          float: left;
          margin-right: 4px;
        }
      </style>

      <div id="container__live_indicator" class="user_controls">
        <a id="span__live_indicator" href="javascript:void(0)" class$="[[ifNotThen(state.liveSync, 'inactive')]]" on-click="_handleClick">
          <fontawesome-icon prefix="fas" name="circle" fixed-width></fontawesome-icon>
          [[localize('live-indicator--label')]]
        </a>
      </div>
    `;
  }

  static get is() { return 'live-indicator'; }

  static get properties() {
    return {
      state: Object,
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
    };
  }

  _handleClick() {
    this._analyticsManager.changeState('setLiveSync', [true], {verb: ANALYTICS_TOPICS.VIDEO_SEEK});
    if(this.state.playState !== PLAY_STATES.PLAYING) {
      this._analyticsManager.changeState('play', [], {verb: ANALYTICS_TOPICS.PLAY});
    }
  }
}

window.customElements.define(LiveIndicator.is, LiveIndicator);
