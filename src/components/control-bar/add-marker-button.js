import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/control-bar--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class AddMarkerButton extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
      </style>

      <div id="container__add_marker_button" class="user_controls">
        <a id="button__add_marker" class="button" on-click="_handleClick">
          <fontawesome-icon prefix="fas" name="bookmark" fixed-width title$="[[localize('add-marker-button--title')]]"></fontawesome-icon>
        </a>
      </div>
    `;
  }

  static get is() { return 'add-marker-button'; }

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
    this._indicatorManager.addIndicator(this.state.position, null);
    e.preventDefault();
  }
}

window.customElements.define(AddMarkerButton.is, AddMarkerButton);
