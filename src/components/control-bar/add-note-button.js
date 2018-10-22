import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/control-bar--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class AddNoteButton extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
      </style>

      <div id="container__add_note_button" class="user_controls">
        <a id="button__add_note" class="button" on-click="_handleClick">
          <fontawesome-icon prefix="fas" name="comment-dots" fixed-width title$="[[localize('add-note-button--title')]]"></fontawesome-icon>
        </a>
      </div>
    `;
  }

  static get is() { return 'add-note-button'; }

  static get properties() {
    return {
      state: Object,
      _indicatorManager: {
        type: Object,
        inject: 'IndicatorManager',
      },
    };
  }

  _handleClick(e) {
    var preventFocus = e.ctrlKey || e.shiftKey || e.altKey;

    this._indicatorManager.addIndicator(this.state.position, "", !preventFocus);
    e.preventDefault();
    e.stopPropagation();
  }
}

window.customElements.define(AddNoteButton.is, AddNoteButton);
