import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/control-bar--style-module.js';
import { PolymerElement, html } from '@polymer/polymer';

class VideoTimeDisplay extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
        #container__videotime_display {
          white-space: nowrap;
        }

        #span__videotime_separator {
          margin: 0px 3px;
        }
      </style>

      <div id="container__videotime_display" class="user_controls">
        <span id="span__videotime_position">[[secondsToHms(_position, _duration)]]</span>
        <template is="dom-if" if="[[!state.live]]">
          <span id="span__videotime_separator">/</span>
          <span id="span__videotime_duration">[[secondsToHms(_duration)]]</span>
        </template>
      </div>
    `;
  }

  static get is() { return 'videotime-display'; }

  static get properties() {
    return {
      state: Object,
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _position: {
        type: Number,
        computed: '_getPosition(state.position, state.trimStart)',
      },
      _duration: {
        type: Number,
        computed: '_getDuration(state.trimStart, state.trimEnd)',
      },
    };
  }

  _getPosition(position, trimStart) {
    return position - trimStart;
  }

  _getDuration(trimStart, trimEnd) {
    return trimEnd - trimStart;
  }
}

window.customElements.define(VideoTimeDisplay.is, VideoTimeDisplay);
