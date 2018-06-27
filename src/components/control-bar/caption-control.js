import { ANALYTICS_TOPICS, CAPTION_TYPES } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/control-bar--style-module.js';
import '../base-components/select-control.js';
import { PolymerElement, html } from '@polymer/polymer';

class CaptionControl extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
      </style>

      <select-control state="[[state]]" items="[[_items]]" selected-value="[[_selectedValue]]"
                      on-change="_selectionChanged" icon-prefix="far" icon-name="closed-captioning"
                      active="[[_isActive]]" is-in-mobile-menu="[[isInMobileMenu]]">
      </select-control>
    `;
  }

  static get is() { return 'caption-control'; }

  static get properties() {
    return {
      state: Object,
      captions: Array,
      isInMobileMenu: {
        type: Boolean,
        value: false,
      },
      _stateManager: {
        type: Object,
        inject: 'StateManager',
      },
      _analyticsManager: {
        type: Object,
        inject: 'AnalyticsManager',
      },
      _items: {
        type: Array,
        computed: '_getItems(captions.*, localize)',
      },
      _offValue: {
        readOnly: true,
        value: null,
      },
      _selectedValue: {
        type: Object,
        computed: '_getSelectedValue(state.showCaptions, state.captionLanguage, state.captionType, captions)',
      },
      _isActive: {
        type: Boolean,
        computed: '_getIsActive(_selectedValue, _offValue, isInMobileMenu)',
      },
    };
  }

  _getItems() {
    if(this.localize) {
      const buildItem = (captionConfig) => ({
        text: captionConfig.name || captionConfig.language,
        badgeValue: captionConfig.language,
        value: captionConfig,
      });

      let defaultCaptions = this.captions.filter(config => typeof config.type === 'undefined' || config.type === CAPTION_TYPES.DEFAULT);
      let listItems = defaultCaptions.map(buildItem.bind(this));
      for(let type of Object.values(CAPTION_TYPES).filter(type => type !== CAPTION_TYPES.DEFAULT)) {
        let typeItems = this.captions.filter(config => config.type === type).map(buildItem.bind(this));
        if(typeItems.length > 0) {
          listItems.push({
            text: this.localize(`caption-types--${type}`),
            children: typeItems,
          });
        }
      }

      let offItem = {
        text: this.localize('general--off'),
        value: this._offValue,
      };

      return [offItem].concat(listItems);
    }
  }

  _getSelectedValue(showCaptions, captionLanguage, captionType, captions) {
    let selectedValue = captions.find(item => item.language === captionLanguage && item.type === captionType);
    if(showCaptions && selectedValue) {
      return selectedValue;
    } else {
      return this._offValue;
    }
  }

  _getIsActive(_selectedValue, _offValue, isInMobileMenu) {
    return isInMobileMenu || _selectedValue !== _offValue;
  }

  _selectionChanged(e) {
    if (e.target.selectedValue !== this._offValue) {
      this._stateManager.setSelectedCaptions(e.target.selectedValue.language, e.target.selectedValue.type);
      this._stateManager.setCaptionsVisibility(true);
    } else {
      this._stateManager.setCaptionsVisibility(false);
    }

    this._analyticsManager.newEvent({verb: ANALYTICS_TOPICS.VIDEO_SUBTITLE}, {
      currentSubtitleStatus: this.state.showCaptions,
      currentSubtitleLanguage: this.state.captionLanguage,
      currentSubtitleType: this.state.captionType,
    });
  }
}

window.customElements.define(CaptionControl.is, CaptionControl);
