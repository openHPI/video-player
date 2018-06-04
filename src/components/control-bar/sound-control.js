import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/control-bar--style-module.js';
import '../base-components/custom-progress.js';
import { PolymerElement, html } from '@polymer/polymer';

class SoundControl extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
        :host {
          min-width: 70px;
        }
      </style>

      <div id="container__sound_control" class="user_controls -no-padding-left">
        <custom-progress id="progress__sound_control" value$="[[toStringOrEmpty(_effectiveVolume)]]" on-change="_handleChange" border="">
        </custom-progress>
      </div>
    `;
  }

  static get is() { return 'sound-control'; }

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
      _effectiveVolume: {
        type: Number,
        computed: '_getEffectiveVolume(state.volume, state.muted)',
      },
    };
  }

  _getEffectiveVolume(volume, muted) {
    if(typeof volume === 'undefined') {
      return '';
    }

    return muted ? 0 : volume;
  }

  _handleChange(e) {
    this._analyticsManager.changeState('setVolume', [e.target.value], {verb: ANALYTICS_TOPICS.VIDEO_VOLUME_CHANGE});
  }
}

window.customElements.define(SoundControl.is, SoundControl);
