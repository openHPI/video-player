import { ANALYTICS_TOPICS } from '../constants.js';
import { IocRequesterMixin } from '../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../mixins/binding-helpers.js';
import '../styling/lists--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';

class PlaylistChapterList extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="lists--style-module">
        #container__playlist_chapter_list {
          position: absolute;
          top: 0;
          right: 0;
          border: 3px solid black;
          z-index: 10;
          @apply --set-foreground-color;
        }
        #container__playlist_chapter_list .list {
          max-width: 250px;
          max-height: 250px;
        }
        #container__playlist_chapter_list .list_item {
          @apply --set-background-color;
        }
        #container__playlist_chapter_list .list_item .list_item__link {
          display: flex;
        }
        #container__playlist_chapter_list .list_item .list_item__caret {
          margin-right: 4px;
        }
        #container__playlist_chapter_list .list_item.active > .list_item__link {
          font-weight: bold;
        }
        #container__playlist_chapter_list .list_item > .list_item__link {
          @apply --set-foreground-color;
        }
        #container__playlist_chapter_list .list_item:nth-child(odd) {
          @apply --set-secondary-background-color;
        }
        #container__playlist_chapter_list .list_item.sublist_item {
          background-color: inherit;
        }
      </style>

      <div id="container__playlist_chapter_list" class="container__list">
        <ul class="list">
          <template is="dom-if" if="[[_showPlaylist]]">
            <template is="dom-repeat" items="[[playlist.entries]]">
              <li class$="list_item [[ifEqualsThen(index, playlist.currentPosition, 'active')]]">
                <a class="list_item__link" href="[[ifNotEqualsThen(index, playlist.currentPosition, item.url)]]">
                  <fontawesome-icon class="list_item__caret" prefix="fas" name="caret-right" style$="visibility: [[ifEqualsThenElse(index, playlist.currentPosition, 'visible', 'hidden')]]"></fontawesome-icon>
                  [[item.title]]
                </a>
                <template is="dom-if" if="[[equals(index, playlist.currentPosition)]]">
                  <ul class="list sublist">
                    <template is="dom-repeat" items="[[_visibleChapters]]">
                      <li class$="list_item sublist_item [[ifEqualsThen(item, _activeChapter, 'active')]]">
                        <a class="list_item__link" on-click="_handleChapterClick" href="javascript:void(0)">
                          <fontawesome-icon class="list_item__caret" prefix="fas" name="caret-right" style$="visibility: [[ifEqualsThenElse(item, _activeChapter, 'visible', 'hidden')]]"></fontawesome-icon>
                          [[item.title]]
                        </a>
                      </li>
                    </template>
                  </ul>
                </template>
              </li>
            </template>
          </template>

          <template is="dom-if" if="[[!_showPlaylist]]">
            <template is="dom-repeat" items="[[_visibleChapters]]">
              <li class$="list_item [[ifEqualsThen(item, _activeChapter, 'active')]]">
                <a class="list_item__link" on-click="_handleChapterClick" href="javascript:void(0)">
                <fontawesome-icon class="list_item__caret" prefix="fas" name="caret-right" style$="visibility: [[ifEqualsThenElse(item, _activeChapter, 'visible', 'hidden')]]"></fontawesome-icon>
                  [[item.title]]
                </a>
              </li>
            </template>
          </template>
        </ul>
      </div>
    `;
  }

  static get is() { return 'playlist-chapter-list'; }

  static get properties() {
    return {
      state: Object,
      chapters: Array,
      playlist: Object,
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      _showPlaylist: {
        type: Boolean,
        value: false,
        computed: '_getShowPlaylist(playlist)',
      },
      _visibleChapters: {
        type: Array,
        computed: '_getVisibleChapters(chapters, state.trimStart, state.trimEnd)',
      },
      _activeChapter: {
        type: Object,
        computed: '_getActiveChapter(_visibleChapters, state.position)',
      },
    };
  }

  static get observers() {
    return [
      '_scrollToActivePlaylistItem(playlist.currentPosition, showIf)',
    ];
  }

  _getShowPlaylist(playlist) {
    return playlist && this.hasItems(playlist.entries) && !playlist.hideInList;
  }

  _getVisibleChapters(chapters, trimStart, trimEnd) {
    if(chapters) {
      let visibleChapters = [];
      for(let i = 0; i < chapters.length; i++) {
        let chapter = chapters[i];
        if((chapter.startPosition >= trimStart || chapters[i + 1] && chapters[i + 1].startPosition > trimStart) && chapter.startPosition <= trimEnd) {
          visibleChapters.push(chapter);
        }
      }

      return visibleChapters;
    }
  }

  _getActiveChapter(chapters, position) {
    if(chapters){
      return chapters.slice()
                    .reverse()
                    .find(chapter => chapter.startPosition <= position);
    }
  }

  _handleChapterClick(e) {
    let position = e.model.item.startPosition;
    if(this.state.trimStart) {
      position = Math.max(this.state.trimStart, position);
    }

    this._analyticsManager.changeState('setPosition', [position], {verb: ANALYTICS_TOPICS.VIDEO_CHAPTER_SEEK});
  }

  _scrollToActivePlaylistItem() {
    let activeListItem = this.shadowRoot.querySelector('.list_item.active');
    if(activeListItem) {
      activeListItem.parentNode.scrollTop = activeListItem.offsetTop;
    }
  }
}

window.customElements.define(PlaylistChapterList.is, PlaylistChapterList);
