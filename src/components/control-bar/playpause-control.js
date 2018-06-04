import { PLAY_STATES, ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/control-bar--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

const PLAY_STATE_ICONS = {
  [PLAY_STATES.PLAYING]: 'pause',
  [PLAY_STATES.PAUSED]: 'play',
  [PLAY_STATES.FINISHED]: 'sync-alt',
};

class PlayPauseControl extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
      </style>

      <div id="container__play_pause_control" class="user_controls">
        <a id="button__play_pause" class="button" on-click="_handleClick" href="javascript:void(0)">
          <fontawesome-icon prefix="fas" name="[[iconName]]" fixed-width></fontawesome-icon>
        </a>
      </div>
    `;
  }

  static get is() { return 'playpause-control'; }

  static get properties() {
    return {
      state: Object,
      iconName: String,
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

  static get observers() {
    return [
      '_playStateChanged(state.playState)',
    ];
  }

  _playStateChanged(playState) {
    let iconName = PLAY_STATE_ICONS[playState];
    if(iconName) {
      this.iconName = iconName;
    }

    if (playState === PLAY_STATES.FINISHED)
      this._analyticsManager.newEvent({verb: ANALYTICS_TOPICS.VIDEO_END});
  }

  _handleClick() {
    if (this._analyticsManager)
      this._analyticsManager.changeState('togglePlayPause', [], {verb: ANALYTICS_TOPICS.PLAY_PAUSE});
  }
}

window.customElements.define(PlayPauseControl.is, PlayPauseControl);
