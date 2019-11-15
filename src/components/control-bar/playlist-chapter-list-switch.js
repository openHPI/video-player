import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/control-bar--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class PlaylistChapterListSwitch extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
      </style>

      <div id="container__playlist_chapter_list_switch" class="user_controls">
        <button
          id="button__chapter_list"
          class$="button [[ifNotThen(state.isChapterListShown, 'inactive')]]"
          on-click="_handleClick"
          on-mousedown="_handleMouseDown">
          <fontawesome-icon prefix="fas" name="list" fixed-width></fontawesome-icon>
        </a>
      </div>
    `;
  }

  static get is() { return 'playlist-chapter-list-switch'; }

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

  _handleClick() {
    this._analyticsManager.changeState('toggleIsChapterListShown', [], {verb: ANALYTICS_TOPICS.VIDEO_CHAPTER});
  }

  _handleMouseDown(e) {
    e.preventDefault();
  }

}

window.customElements.define(PlaylistChapterListSwitch.is, PlaylistChapterListSwitch);
