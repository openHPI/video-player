import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/control-bar--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class QuizOverlaySwitch extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
      </style>

      <div id="container__quiz_overlay_switch" class="user_controls">
        <a id="button__quiz_overlay" class$="button [[ifNotThen(state.isQuizOverlayEnabled, 'inactive')]]" on-click="_handleClick" href="#">
          <fontawesome-icon prefix="fas" name="check-square" fixed-width title$="[[localize('quiz-overlay-switch--title')]]"></fontawesome-icon>
        </a>
      </div>
    `;
  }

  static get is() { return 'quiz-overlay-switch'; }

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

  _handleClick(e) {
    this._analyticsManager.changeState('toggleIsQuizOverlayEnabled', [], {verb: ANALYTICS_TOPICS.QUIZ_OVERLAY});
    e.preventDefault();
  }
}

window.customElements.define(QuizOverlaySwitch.is, QuizOverlaySwitch);
