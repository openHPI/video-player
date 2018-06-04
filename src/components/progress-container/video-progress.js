import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/progress-container--style-module.js';
import '../base-components/custom-progress.js';
import { PolymerElement, html } from '@polymer/polymer';

class VideoProgress extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="progress-container--style-module">
      </style>

      <div class="progress_indicator">
        <custom-progress id="progress__video_progress" max="[[_duration]]" value="[[_position]]" secondary-value="[[_bufferPosition]]" on-change="_handleChange" hover-box="[[ifThenElse(state.live, 'rel', 'abs')]]">
        </custom-progress>
      </div>
    `;
  }

  static get is() { return 'video-progress'; }

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
      _position: {
        type: Number,
        computed: '_getPosition(state.position, state.trimStart, state.trimEnd, state.live, state.liveSync, state.liveStartPosition, state.livePosition)',
      },
      _bufferPosition: {
        type: Number,
        computed: '_getPosition(state.bufferPosition, state.trimStart, state.trimEnd, state.live, state.liveSync, state.liveStartPosition, state.livePosition)',
      },
      _duration: {
        type: Number,
        computed: '_getDuration(state.duration, state.trimStart, state.trimEnd, state.live, state.liveStartPosition, state.livePosition)',
      },
    };
  }

  _getPosition(position, trimStart, trimEnd, live, liveSync, liveStartPosition, livePosition) {
    if(live) {
      if(liveSync) {
        return livePosition - liveStartPosition;
      } else {
        return Math.min(position, livePosition) - liveStartPosition;
      }
    } else {
      return Math.min(position - trimStart, trimEnd);
    }
  }

  _getDuration(duration, trimStart, trimEnd, live, liveStartPosition, livePosition) {
    if(live)
      return livePosition - liveStartPosition;
    else
      return trimEnd - trimStart;
  }

  _handleChange(e) {
    let position;
    if(this.state.live)
      position = this.state.liveStartPosition + e.target.value;
    else
      position = this.state.trimStart + e.target.value;

    this._analyticsManager.changeState('setPosition', [position], {verb: ANALYTICS_TOPICS.VIDEO_SEEK});
  }
}

window.customElements.define(VideoProgress.is, VideoProgress);
