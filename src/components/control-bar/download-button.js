import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/control-bar--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class DownloadButton extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
      </style>

      <div id="container__download_button" class="user_controls">
        <a href$="[[downloadUri]]" id="button__download" class="button" >
          <fontawesome-icon prefix="fas" name="download" fixed-width title$="[[localize('download-button--title')]]"></fontawesome-icon>
        </a>
      </div>
    `;
  }

  static get is() { return 'download-button'; }

  static get properties() {
    return {
      downloadUri: String,
    };
  }
}

window.customElements.define(DownloadButton.is, DownloadButton);
