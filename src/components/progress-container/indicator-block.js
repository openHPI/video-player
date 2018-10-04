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
          cursor: pointer;
          position: absolute;
          background-color: #000;
          border-left: 1px solid #000;
          border-right: 1px solid #000;
          width: 5px;
          top: 0px;
          height: 100%;
          z-index: 3;
        }

        .indicatorTooltip {
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s 1s, opacity 1s linear;
            -webkit-transition: visibility 0s 1s, opacity 1s linear;
            -moz-transition: visibility 0s 1s, opacity 1s linear;
            -ms-transition: visibility 0s 1s, opacity 1s linear;
            -o-transition: visibility 0s 1s, opacity 1s linear;
            z-index: 8;
        }

        .indicatorTooltip:hover, .opacity-1 {
            visibility: visible;
            opacity: 1;
            transition: opacity 0s linear;
            cursor:pointer;
            z-index: 8;
        }

        .bubble {
            position:absolute;
            bottom: 36px;
            background: #fff;
            z-index: 8;
            word-wrap: break-word;
        }

        .bubbleTriangle {
            position:absolute;
            bottom:16px;

            height: 0;
            width: 0;
            border-style:solid;
            border-color:#fff transparent;
            z-index: 7;
        }

        .bubbleTriangleLeft {
            border-width:20px 20px 0 0;
        }

        .bubbleTriangleRight {
            border-width:20px 0 0 20px;
            margin-left: -20px;
        }

        .bubble p {
            padding:10px;
            margin:0;
        }
      </style>

      <div class="indicatorTooltip">
        <div class$="bubbleTriangle [[_triangleClass(indicator.position, min, max)]]" style$="[[_calcPosition(indicator.position, min, max)]]"></div>
        <div class="bubble" style$="[[_calcPosition(indicator.position, min, max)]]">
            <p>
            <a class="button">
                <fontawesome-icon prefix="fas" name="trash"></fontawesome-icon>
            </a>
            </p>
        </div>
      </div>

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

  _handleClick(){
    this._analyticsManager.changeState('setPosition', [this.slide.startPosition], {verb: ANALYTICS_TOPICS.VIDEO_SLIDE_SEEK});
  }
}

window.customElements.define(IndicatorBlock.is, IndicatorBlock);
