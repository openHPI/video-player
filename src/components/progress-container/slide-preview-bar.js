import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/progress-container--style-module.js';
import './slide-thumbnail.js';
import { PolymerElement, html } from '@polymer/polymer';

class SlidePreviewBar extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="progress-container--style-module">
      #container__slide_preview_bar {
        height: 10px;
      }
      </style>

      <div id="container__slide_preview_bar" class="progress_indicator">
          <template is="dom-repeat" items="[[_visibleSlides]]">
            <slide-thumbnail state="[[state]]" slide="[[item]]"></slide-thumbnail>
          </template>
      </div>
    `;
  }

  static get is() { return 'slide-preview-bar'; }

  static get properties() {
    return {
      state: Object,
      slides: Array,
      activeSlide: {
        type: Object,
        value: () => ({}),
      },
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _visibleSlides: {
        type: Array,
        computed: '_getVisibleSlides(slides, state.trimStart, state.trimEnd)',
      },
    };
  }

  static get observers() {
    return [
      '_checkSlideActivation(state.position)',
      '_handleSlideChange(activeSlide)',
    ];
  }

  _getVisibleSlides(slides, trimStart, trimEnd) {
    let visibleSlides = [];
    for(let i = 0; i < slides.length; i++) {
      let slide = slides[i];
      if((slide.startPosition >= trimStart || slides[i + 1] && slides[i + 1].startPosition > trimStart) && slide.startPosition <= trimEnd) {
        visibleSlides.push(slide);
      }
    }

    return visibleSlides;
  }

  _checkSlideActivation() {
    if (this._analyticsManager) {
      let currentActiveSlide = this._analyticsManager._getActiveSlide();
      if (this.activeSlide !== currentActiveSlide) {
        this.activeSlide = currentActiveSlide;
      }
    }
  }

  _handleSlideChange(slide) {
    if (this._analyticsManager) {
      this._analyticsManager.newEvent({verb: ANALYTICS_TOPICS.VIDEO_SLIDE_CHANGE}, {newCurrentSlide: slide});
    }
  }
}

window.customElements.define(SlidePreviewBar.is, SlidePreviewBar);
