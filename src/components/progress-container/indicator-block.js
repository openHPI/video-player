import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/progress-container--style-module.js';
import { PolymerElement, html } from '@polymer/polymer';

class IndicatorBlock extends BindingHelpersMixin(IocRequesterMixin(PolymerElement)) {
  static get template() {
    return html`
      <style type="text/css" include="progress-container--style-module">
        .indicator {
          position: absolute;
          background-color: #000;
          width: 5px;
          top: 0px;
          height: 100%;
          z-index: 3;
        }
      </style>

      <div class="indicator" style$="left: [[_calcWidth(indicator.position, min, max)]]%;"></div>
    `;
  }

  static get is() { return 'indicator-block'; }

  static get properties() {
    return {
      min: Number,
      max: Number,
      indicator: Object,

      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
    };
  }

  _calcWidth(value, min, max) {
    return Math.min(Math.max(0, (value - min) / max * 100), 100);
  }

  _handleClick(){
    this._analyticsManager.changeState('setPosition', [this.slide.startPosition], {verb: ANALYTICS_TOPICS.VIDEO_SLIDE_SEEK});
  }
}

window.customElements.define(IndicatorBlock.is, IndicatorBlock);
