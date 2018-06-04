import { ANALYTICS_TOPICS, PLAY_STATES } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/overlay--style-module.js';
import '../../styling/global--style-module.js';
import { PolymerElement, html } from '@polymer/polymer';

class CaptionsDisplay extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="overlay--style-module">
        #container__captions {
          visibility: visible;
          position: absolute;
          bottom: 5px;
          width: calc(100% - 40px);
          margin: 0 20px;
          text-align: center;
          color: white;
          z-index: 3;
        }
        .caption-cue-text {
          /* display:table; is necessary so the inner element (.caption-cue-text)
             does not take up the full available width. */
          display: table;
          margin: 0 auto;
          padding: 3px 10px;
          background-color: rgba(0,0,0,0.7);
          border-radius: 5px;
          font-size: 18px;
        }

        @media (max-width: 769px) {
          .caption-cue-text {
            font-size: 12px;
          }
        }
      </style>

      <div id="container__captions" class$="[[ifNotThen(_showCaptions, '-hidden')]]">
        <template is="dom-if" if="[[_activeCue]]">
          <div class="caption-cue-text">[[_activeCue.text]]</div>
        </template>
      </div>
    `;
  }

  static get is() { return 'captions-display'; }

  static get properties() {
    return {
      state: Object,
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _activeCue: Object,
      _showCaptions: {
        type: Boolean,
        computed: '_getShowCaptions(state.showCaptions, state.playState, state.position, state.trimStart, state.trimEnd)',
      },
    };
  }
  static get observers() {
    return [
      '_setActiveCue(state.position, state.activeCaptions)',
      '_cueChanged(_activeCue)',
    ];
  }

  _getShowCaptions(showCaptions, playState, position, trimStart, trimEnd) {
    if(!showCaptions || playState === PLAY_STATES.FINISHED)
      return false;

    if(playState === PLAY_STATES.PLAYING)
      return true;

    return playState === PLAY_STATES.PAUSED && position > trimStart && position < trimEnd;
  }

  _setActiveCue(position, activeCaptions) {
    if(activeCaptions) {
      let newCue = activeCaptions.find(cue => cue.startTime <= position &&
                                              cue.endTime > position);
      if (!Object.is(this._activeCue, newCue)) {
        this._activeCue = newCue;
      }
    }
  }

  _cueChanged(activeCue) {
    let identifier = this._analyticsManager._getCueIdentifier(activeCue);
    this._analyticsManager.newEvent({verb: ANALYTICS_TOPICS.VIDEO_SUBTITLE_CHANGE}, {
      currentSubtitleIdentifier: identifier,
      currentSubtitleLanguage: this.state.captionLanguage,
    });
  }
}

window.customElements.define(CaptionsDisplay.is, CaptionsDisplay);
