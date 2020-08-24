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
        <custom-progress id="progress__video_progress" max="[[_duration]]" value="[[_customProgressPosition]]" secondary-value="[[_bufferPosition]]"
          on-change="_handleChange" on-drag="_handleDrag" on-drop="_handleDrop"
          hover-box="[[ifThenElse(state.live, 'rel', 'abs')]]" indicators="[[indicators]]">
        </custom-progress>
      </div>
    `;
  }

  static get is() { return 'video-progress'; }

  static get properties() {
    return {
      state: Object,
      indicators: Array,
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      _customProgressPosition: {
        type: Number,
        value: 0,
      },
      _position: {
        type: Number,
        computed: '_getPosition(state.position, state.trimStart, state.trimEnd, state.live, state.liveSync, state.liveStartPosition, state.livePosition)',
        observer: '_positionChanged',
      },
      _bufferPosition: {
        type: Number,
        computed: '_getPosition(state.bufferPosition, state.trimStart, state.trimEnd, state.live, state.liveSync, state.liveStartPosition, state.livePosition)',
      },
      _duration: {
        type: Number,
        computed: '_getDuration(state.duration, state.trimStart, state.trimEnd, state.live, state.liveStartPosition, state.livePosition)',
      },
      _insideDragOperation: {
        type: Boolean,
        value: false,
      },
    };
  }

  _positionChanged(newValue) {
    if (this._insideDragOperation) {
      // Do not update the position of the custom progress bar if the user is dragging it.
      return;
    }

    this.set('_customProgressPosition', newValue);
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

  _handleDrag() {
    this._insideDragOperation = true;
  }

  _handleDrop(e) {
    this._insideDragOperation = false;
    this._analyticsManager.changeState('setPosition', [e.detail.position], {verb: ANALYTICS_TOPICS.VIDEO_SEEK});
  }

  _handleChange(e) {
    if (this._insideDragOperation) {
      // If the user is dragging, we do not want to update the video position
      // on every frame. Otherwise, dragging the progress slides from start to
      // end will go through all positions in the video and the browser will
      // start caching all positions.
      return;
    }

    let position;
    if(this.state.live)
      position = this.state.liveStartPosition + e.target.value;
    else
      position = this.state.trimStart + e.target.value;

    this._analyticsManager.changeState('setPosition', [position], {verb: ANALYTICS_TOPICS.VIDEO_SEEK});
  }
}

window.customElements.define(VideoProgress.is, VideoProgress);
