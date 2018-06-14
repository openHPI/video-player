import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/progress-container--style-module.js';
import { PolymerElement, html } from '@polymer/polymer';

class SlideThumbnail extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="progress-container--style-module">
        #container__slide_thumbnail_element {
          position: absolute;
          right: 0;
          z-index: 6;
          border-left: 1px solid black;
          border-right: 1px solid black;
          @apply --set-secondary-background-color;
          height: 10px;
        }
        #container__slide_thumbnail_element:hover {
          background-color: white;
        }

        #image__slide_preview {
          display: none;
          position: absolute;
          /* Cancel out the top border */
          bottom: calc(100% + 1px);
          height: 120px;
          border: 1px solid black;;
          background-color: white;
        }
        #container__slide_thumbnail_element.-left #image__slide_preview {
          left: 0;
        }
        #container__slide_thumbnail_element.-right #image__slide_preview {
          right: 0;
        }

        #container__slide_thumbnail_element:hover #image__slide_preview {
          display: block;
        }
      </style>

      <div id="container__slide_thumbnail_element" on-click="_handleClick" style$="left: [[_stylePercentage(slide.startPosition, state.duration, state.trimStart, state.trimEnd)]]%;" class$="[[_getSlidePosition(slide.startPosition, state.duration, state.trimStart, state.trimEnd)]]">
          <img id="image__slide_preview" src="[[slide.thumbnail]]">
      </div>
    `;
  }

  static get is() { return 'slide-thumbnail'; }

  static get properties() {
    return {
      state: Object,
      slide: Object,
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
    };
  }

  _stylePercentage(position, duration, trimStart, trimEnd) {
    // Apply video trimming
    if(typeof trimStart !== 'undefined')
      position = position - trimStart;
    if(typeof trimEnd !== 'undefined')
      duration = trimEnd - trimStart;

    return Math.max(0, Math.min(position / duration * 100, 100));
  }

  _getSlidePosition(position, duration, trimStart, trimEnd) {
    let percentage = this._stylePercentage(position, duration, trimStart, trimEnd);
    // This is an approximation
    // to avoid that the slide image overflows the video container
    if(percentage > 85) {
      return '-right';
    } else {
      return '-left';
    }
  }

  _handleClick(){
    this._analyticsManager.changeState('setPosition', [this.slide.startPosition], {verb: ANALYTICS_TOPICS.VIDEO_SLIDE_SEEK});
  }
}

window.customElements.define(SlideThumbnail.is, SlideThumbnail);
