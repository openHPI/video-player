import { IocRequesterMixin } from '../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../mixins/binding-helpers.js';
import { PolymerElement, html } from '@polymer/polymer';

class NewComponent extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css">
        /* Styling of component goes here */
      </style>

      <!-- HTML structure of component goes here -->
    `;
  }

  static get is() { return 'new-component'; }

  static get properties() {
    return {
      // Public attributes of the component
      state: Object,

      // Private properties of the component
      _foo: {
        type: String,
        value: 'bar',
      },

      // Services can be injected in the following way
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
    };
  }

  ready() {
    super.ready();

    // One-time initialization of component
  }
}

window.customElements.define(NewComponent.is, NewComponent);
