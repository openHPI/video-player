import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/global--style-module.js';
import { PolymerElement, html } from '@polymer/polymer';
import '../progress-container/indicator-block.js';

const HOVER_BOX_STATES = {
  ABSOLUE: 'abs',
  RELATIVE: 'rel',
  HIDDEN: 'hiden',
};

class CustomProgress extends BindingHelpersMixin(PolymerElement) {
  static get template() {
    return html`
      <style type="text/css" include="global--style-module">
        :host {
          flex-basis: 100%;
        }

        #container__progress_bar {
          position: relative;
          width: 100%;
          height: 15px;
          border: 1px solid grey;
          @apply --set-background-color;
        }
        #container__progress_bar.-no-border {
          border: none;
        }

        #container__progress {
          width: 100%;
          height: 100%;
        }

        .progress-overlay {
          position: absolute;
          height: 100%;
        }

        #div__primary_progress {
          @apply --set-accent-color-background;
          z-index: 2;
        }

        #div__secondary_progress {
          @apply --set-secondary-background-color;
          z-index: 1;
        }

        #div__hover_box {
          display: none;
          position: absolute;
          background-color: rgba(0, 0, 0, 0.75);
          color: #FFFFFF;
          padding: 2px;
          min-width: 40px;
          text-align: center;
          z-index: 10;
        }

        #container__progress_bar:hover #div__hover_box {
          display: block;
        }
      </style>

      <div id="container__progress_bar" class$="[[ifThenElse(border, '', '-no-border')]]">
        <div id="container__progress"
          on-pointerdown="_handlePointerDown"
          on-pointermove="_handlePointerMove"
          on-pointerup="_handlePointerUp"
          on-mouseover="_showHoverBox"
          on-mousemove="_updateHoverBoxPosition"
          on-mouseout="_hideHoverBox">
          <div id="div__primary_progress" class="progress-overlay" style$="width: [[_calcWidth(value, min, max)]]%;"></div>
          <div id="div__secondary_progress" class="progress-overlay" style$="width: [[_calcWidth(secondaryValue, min, max)]]%;"></div>

          <template is="dom-repeat" items="[[indicators]]">
            <indicator-block indicator="[[item]]" min="[[min]]" max="[[max]]"></indicator-block>
          </template>
        </div>
        <div id="container__hover_box" style$="visibility: [[ifThenElse(_hoverBoxVisible, 'visible', 'hidden')]];">
          <div id="div__hover_box">[[_hoverBoxContent]]</div>
        </div>
      </div>
    `;
  }

  static get is() { return 'custom-progress'; }

  static get properties() {
    return {
      indicators: Array,
      min: {
        type: Number,
        value: 0,
      },
      max: {
        type: Number,
        value: 1,
      },
      value: {
        type: Number,
        value: 0,
      },
      secondaryValue: {
        type: Number,
        value: 0,
      },
      border: {
        type: Boolean,
        value: false,
      },
      hoverBox: {
        type: String,
        value: HOVER_BOX_STATES.HIDDEN,
      },
      _hoverBoxVisible: {
        type: Boolean,
        value: false,
      },
      _hoverBoxContent: {
        type: String,
        value: 0,
      },
      _mousePressed: {
        type: Boolean,
        value: false,
      },
    };
  }

  _calcWidth(value, min, max) {
    return Math.min(Math.max(0, (value - min) / max * 100), 100);
  }

  _handlePointerDown(e) {
    let container = this.shadowRoot.querySelector('#container__progress');
    this._mousePressed = true;
    container.setPointerCapture(e.pointerId);
    this.dispatchEvent(new CustomEvent('drag'));

    let clickedValue = this._getCursorPosition(e);
    this._updateValueAndEmit(clickedValue);
  }

  _handlePointerUp(e) {
    let container = this.shadowRoot.querySelector('#container__progress');
    this._mousePressed = false;
    container.releasePointerCapture(e.pointerId);
    this.dispatchEvent(new CustomEvent('drop', {detail: {position: this.value} }));
  }

  _handlePointerMove(e) {
    if (this._mousePressed) {
      let clickedValue = this._getCursorPosition(e);
      this._updateValueAndEmit(clickedValue);
    }
  }

  _updateValueAndEmit(clickedValue) {
    // Check if still within borders
    if( clickedValue <= this.max) {
      this.value = clickedValue;
      this.dispatchEvent(new CustomEvent('change'));
    }
  }

  _showHoverBox(e) {
    if(e.target.tagName !== 'INDICATOR-BLOCK' && this.hoverBox !== HOVER_BOX_STATES.HIDDEN) {
      this._hoverBoxVisible = true;
    }
  }

  _updateHoverBoxPosition(e) {
    let timeBox = this.$.div__hover_box;
    let progressContainer = this.$.container__progress_bar;

    timeBox.style.top = progressContainer.style.top - timeBox.offsetHeight + 'px';
    let time = this._getCursorPosition(e);
    if(this.hoverBox === HOVER_BOX_STATES.RELATIVE) {
      time = time - this.max;
    }
    this._hoverBoxContent = this.secondsToHms(time);

    // Get right end of time box and right end of progress bar in pixels
    let timeBoxRightEnd = e.pageX - progressContainer.getBoundingClientRect().left + timeBox.offsetWidth;
    let CustomProgressRightEnd = progressContainer.offsetLeft + progressContainer.offsetWidth;

    if(timeBoxRightEnd >= CustomProgressRightEnd) {
      // Remove class left if contained
      // add class right if not already contained
      timeBox.style.left = 'auto';
      timeBox.style.right = '0px';
    } else {
      // Remove class right if contained
      // add class left if not already contained
      timeBox.style.left = e.offsetX + 'px';
      timeBox.style.right = 'auto';
    }
  }

  _hideHoverBox() {
    this._hoverBoxVisible = false;
  }

  _getCursorPosition(e) {
    // Get x value by substracting offsetleft of control
    let borderLeftWidth = parseInt(getComputedStyle(this.$.container__progress_bar, null).getPropertyValue('border-left-width'), 10);
    let x = e.pageX - this.getBoundingClientRect().left - borderLeftWidth;

    // Heuristic to take care the end can be reached
    if(this.getBoundingClientRect().width - x <= 1) {
      x = this.getBoundingClientRect().width;
    }

    // Calculate value that will be between 0 and the max value
    let clickedValue = Math.max(0, Math.min(this.max, x * this.max / this.getBoundingClientRect().width));

    return clickedValue;
  }
}

window.customElements.define(CustomProgress.is, CustomProgress);
