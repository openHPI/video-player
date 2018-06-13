import { ANALYTICS_TOPICS, MIN_VIDEO_WIDTH_PERCENTAGE, RESIZER_TAP_STEP } from '../constants.js';
import { IocRequesterMixin } from '../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../mixins/binding-helpers.js';
import '../styling/global--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';

class DualStream extends BindingHelpersMixin(IocRequesterMixin(GestureEventListeners(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="global--style-module">
        /*
        * The nested flex boxes are unfortunately neccessary to avoid Safaris 100% height bug
        */
        :host {
          display: flex;
          user-drag: none;
          user-select: none;
          -moz-user-select: none;
          -webkit-user-drag: none;
          -webkit-user-select: none;
          -ms-user-select: none;
        }

        #container__dual_stream {
          display: flex;
          overflow: hidden;
          width: 100%;
          background-color: black;
        }

        #container__dual_stream ::slotted(*) {
          /* Subtract border of the resizer element */
          flex: 1 1 calc(50% - 2px);
        }

        /* On vertical mobile screens the videos should be shown below each other without resizer */
        @media screen and (orientation:portrait) {
          #container__dual_stream {
            flex-wrap: wrap;
          }
          #container__dual_stream ::slotted(*) {
            flex-basis: 100% !important;
          }
          #container__dual_stream ::slotted(:first-child) {
            margin-bottom: 4px;
          }

          #resizer {
            display: none;
          }
        }

        #resizer {
          z-index: 5;
          position: relative;
          flex-basis: 0;
          border: 2px solid var(--secondary-background-color);
          cursor: ew-resize;
          height: inherit;
          visibility: hidden;
        }
        #container__dual_stream.resizing {
          cursor: ew-resize;
        }
        #container__dual_stream:hover #resizer {
          visibility: visible;
        }


        .resize-icon {
          position: absolute;
          top: calc(50% - 15px);
          font-size: 3em;
          color: var(--secondary-background-color);
        }
        #iconLeft {
          margin-left: -1em;
          padding-right: 0.5em;
        }
        #iconRight {
          padding-left: 0.5em;
        }
      </style>

      <div id="container__dual_stream" class$="[[ifThen(_isResizing, 'resizing')]]">
        <slot id="videoSlot1" name="video1" class="video-slot"></slot>
        <div id="resizer" on-down="_handleResizerDown" on-track="_handleResizerTrack" on-up="_handleResizerUp">
          <fontawesome-icon id="iconLeft" class="resize-icon" prefix="fas" name="angle-left" on-tap="_handleResizerLeftTap"></fontawesome-icon>
          <fontawesome-icon id="iconRight" class="resize-icon" prefix="fas" name="angle-right" on-tap="_handleResizerRightTap"></fontawesome-icon>
        </div>
        <slot id="videoSlot2" name="video2" class="video-slot"></slot>
      </div>
    `;
  }

  static get is() { return 'dual-stream'; }

  static get properties() {
    return {
      state: Object,
      index: Number,
      _ratio: {
        type: Number,
        computed: '_getRatio(state.resizerRatios.*, index)',
      },
      _mouseResizerDistance: Number,
      _isResizing: Boolean,
      _hasResized: Boolean,
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

  static get observers() {
    return [
      '_ratioChanged(_ratio)',
    ];
  }

  servicesInjectedCallback() {
    super.servicesInjectedCallback();

    // Initially align videos according to their resolution, if no ratio is specified
    if(!this._ratio) {
      let resolutions = {};
      for(let slot of this.shadowRoot.querySelectorAll('.video-slot')) {
        slot.assignedNodes()[0].addEventListener('loaded-video', (e) => {
          resolutions[e.target.slot] = e.detail.resolution;
          if(!this. ratio && Object.keys(resolutions).length === 2) {
            let ratio = (resolutions.video1.width * resolutions.video2.height) /
                        (resolutions.video2.width * resolutions.video1.height);
            this._stateManager.setResizerRatio(this.index, ratio);
          }
        });
      }
    }
  }

  _getRatio(resizerRatios, index) {
    if(this.state.resizerRatios) {
      return this.state.resizerRatios[index];
    }
  }

  _ratioChanged(ratio) {
    if(ratio) {
      let percentage = this._ensureWidthPercentage(ratio / (ratio + 1));
      this._setFlexBasis(this.$.videoSlot1, percentage);
      this._setFlexBasis(this.$.videoSlot2, 1 - percentage);
    }
  }

  _handleResizerDown(e) {
    this._isResizing = true;
    let resizerBounds = this.$.resizer.getBoundingClientRect();
    this._mouseResizerDistance = resizerBounds.left - e.detail.x;
  }

  _handleResizerTrack(e) {
    let parentBounds = this.parentElement.getBoundingClientRect();
    let percentage1 = this._ensureWidthPercentage((e.detail.x + this._mouseResizerDistance - parentBounds.left) / parentBounds.width);
    let percentage2 = this._ensureWidthPercentage(1 - percentage1);
    this._stateManager.setResizerRatio(this.index, percentage1 / percentage2);
  }

  _handleResizerUp() {
    if(this._isResizing) {
      this._fireAnalyticsEvent();
    }
    this._isResizing = false;
    this._hasResized = true;
  }

  _handleResizerLeftTap() {
    let ratio = this._ratio - RESIZER_TAP_STEP * this._ratio;
    this._stateManager.setResizerRatio(this.index, ratio);
  }

  _handleResizerRightTap() {
    let ratio = this._ratio + RESIZER_TAP_STEP * this._ratio;
    this._stateManager.setResizerRatio(this.index, ratio);
  }

  _ensureWidthPercentage(ratio) {
    return Math.max(MIN_VIDEO_WIDTH_PERCENTAGE, Math.min(1 - MIN_VIDEO_WIDTH_PERCENTAGE, ratio));
  }

  _setFlexBasis(slot, ratio) {
    let element = slot.assignedNodes()[0];
    if(element) {
      // Subtract border of the resizer element
      element.style.flexBasis = `calc(${ratio * 100}% - 2px)`;
    }
  }

  _fireAnalyticsEvent() {
    let dualStreams = Array.from(this.parentElement.querySelectorAll('dual-stream'));
    this._analyticsManager.newEvent({verb: ANALYTICS_TOPICS.VIDEO_CHANGE_SIZE}, {
      newCurrentRatio: this._ratio,
      resizerIndex: dualStreams.indexOf(this),
      resizerCount: dualStreams.length,
    });
  }
}

window.customElements.define(DualStream.is, DualStream);
