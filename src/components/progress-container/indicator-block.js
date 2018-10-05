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
          background-color: var(--font-color-on-accent-color);
          cursor: pointer;
          position: absolute;
          border-left: 1px solid #000;
          border-right: 1px solid #000;
          width: 5px;
          top: 0px;
          height: 100%;
          z-index: 2;
        }

        .indicatorTooltip {
          @apply --set-background-color;
          visibility: hidden;
          opacity: 0;
          transition: opacity 1s linear, visibility 1s 0s;

          position: absolute;
          bottom: 16px;
          z-index: 7;
        }

        .indicatorTooltip:hover, .opacity-1 {
          visibility: visible;
          opacity: 1;
          transition: opacity 0s linear;
          cursor: pointer;
        }

        .bubble {
          @apply --set-background-color;
          @apply --set-foreground-color;
          position: absolute;
          bottom: 20px;
          word-wrap: break-word;
        }

        .right-0 {
          right: 0;
        }

        .bubbleTriangle {
          position: absolute;
          bottom: 0;

          height: 0;
          width: 0;
          border-style: solid;
          border-color: var(--background-color) transparent;
        }

        .bubbleTriangleLeft {
          border-width: 20px 20px 0 0;
        }

        .bubbleTriangleRight {
          border-width:20px 0 0 20px;
          margin-left: -20px;
        }

        .bubble p {
          padding:10px;
          margin:0;
        }

        .bubble p a {
          @apply --set-font-color-on-accent-color;
        }
      </style>

      <div class$="indicatorTooltip [[_tooltipClass]]" style$="[[_calcPosition(indicator.position, min, max)]]" on-click="_handleClick">
        <div class$="bubbleTriangle [[_triangleClass(indicator.position, min, max)]]"></div>
        <div class$="bubble [[_bubbleClass(indicator.position, min, max)]]">
          <p>
            <a class="button" on-click="_handleDelete">
              <fontawesome-icon prefix="fas" name="trash"></fontawesome-icon>
            </a>
          </p>
        </div>
      </div>

      <div class="indicator" style$="left: [[_calcWidth(indicator.position, min, max)]]%;" on-mouseover="_showTooltip" on-mouseout="_hideTooltip"></div>
    `;
  }

  static get is() { return 'indicator-block'; }

  static get properties() {
    return {
      min: Number,
      max: Number,
      indicator: Object,
      _tooltipClass: {
        type: String,
        default: "",
      },

      _indicatorManager: {
        type: Object,
        inject: 'IndicatorManager',
      },

      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
    };
  }

  _calcWidth(value, min, max) {
    return Math.min(Math.max(0, (value - min) / max * 100), 100);
  }

  _isRight(position, min, max) {
    return position > ((min + max) / 2);
  }

  _calcPosition(position, min, max) {
    if(this._isRight(position, min, max)) {
      return "right: " + (100 - this._calcWidth(position, min, max)) + "%;";
    }

    return "left: " + this._calcWidth(position, min, max) + "%;";
  }

  _triangleClass(position, min, max) {
    if(this._isRight(position, min, max)) {
      return "bubbleTriangleRight";
    }

    return "bubbleTriangleLeft";
  }

  _bubbleClass(position, min, max) {
    if(this._isRight(position, min, max)) {
      return "right-0";
    }

    return "";
  }

  _handleClick(e) {
    this._analyticsManager.changeState('setPosition', [this.indicator.position], {verb: ANALYTICS_TOPICS.VIDEO_INDICATOR_SEEK});
    e.stopPropagation();
  }

  _handleDelete(e) {
    this._indicatorManager.removeIndicator(this.indicator);
    e.stopPropagation();
  }

  _showTooltip() {
    this._tooltipClass = "opacity-1";
  }

  _hideTooltip() {
    this._tooltipClass = "";
  }
}

window.customElements.define(IndicatorBlock.is, IndicatorBlock);
