import { ANALYTICS_TOPICS } from '../../constants.js';
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
      languages: Array,
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
        computed: '_getItems(languages.*, localize)',
      },
      _offValue: {
        readOnly: true,
        value: null,
      },
      _selectedValue: {
        type: Object,
        computed: '_getSelectedValue(state.showCaptions, state.captionLanguage, languages)',
      },
      _isActive: {
        type: Boolean,
        computed: '_getIsActive(_selectedValue, _offValue, isInMobileMenu)',
      },
    };
  }

  _getItems() {
    if(this.localize) {
      let languageItems = this.languages.map(language => ({
        text: language,
        value: language,
      }));
      let offItem = {
        text: this.localize('general--off'),
        value: this._offValue,
      };

      return [offItem].concat(languageItems);
    }
  }

  _getSelectedValue(showCaptions, captionLanguage, languages) {
    if(showCaptions && languages.includes(captionLanguage)) {
      return captionLanguage;
    } else {
      return this._offValue;
    }
  }

  _getIsActive(_selectedValue, _offValue, isInMobileMenu) {
    return isInMobileMenu || _selectedValue !== _offValue;
  }

  _selectionChanged(e) {
    if (e.target.selectedValue !== this._offValue) {
      this._stateManager.setCaptionLanguage(e.target.selectedValue);
      this._stateManager.setCaptionsVisibility(true);
    } else {
      this._stateManager.setCaptionsVisibility(false);
    }

    this._analyticsManager.newEvent({verb: ANALYTICS_TOPICS.VIDEO_SUBTITLE}, {
      currentSubtitleStatus: this.state.showCaptions,
      currentSubtitleLanguage: this.state.captionLanguage,
    });
  }
}

window.customElements.define(CaptionControl.is, CaptionControl);
