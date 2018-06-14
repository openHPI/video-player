import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/control-bar--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class PlaylistNavigationControl extends BindingHelpersMixin(PolymerElement) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
      </style>

      <div id="container__playlist_navigation_control" class="user_controls">
        <a id="button__navigate_to_video" class="button" href="{{videoUrl}}">
          <fontawesome-icon prefix="fas" name="step-[[direction]]" fixed-width></fontawesome-icon>
        </a>
      </div>
    `;
  }

  static get is() { return 'playlist-navigation-control'; }

  static get properties() {
    return {
      videoUrl: String,
      direction: String,
    };
  }
}

window.customElements.define(PlaylistNavigationControl.is, PlaylistNavigationControl);
