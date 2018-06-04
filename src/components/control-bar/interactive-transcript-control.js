import { ANALYTICS_TOPICS } from '../../constants.js';
import { IocRequesterMixin } from '../../mixins/ioc-requester.js';
import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import { LocalizationMixin } from '../../mixins/localization.js';
import '../../styling/control-bar--style-module.js';
import '../base-components/select-control.js';
import { PolymerElement, html } from '@polymer/polymer';

class InteractiveTranscriptControl extends BindingHelpersMixin(IocRequesterMixin(LocalizationMixin(PolymerElement))) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
      </style>

      <select-control state="[[state]]" items="[[_items]]" selected-value="[[_selectedValue]]"
                      on-change="_selectionChanged" icon-prefix="fas" icon-name="file-alt"
                      active="[[_isActive]]" is-in-mobile-menu="[[isInMobileMenu]]">
      </select-control>
    `;
  }

  static get is() { return 'interactive-transcript-control'; }

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
        computed: '_getSelectedValue(state.showInteractiveTranscript, state.captionLanguage, languages)',
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

  _getSelectedValue(showInteractiveTranscript, captionLanguage, languages) {
    if(showInteractiveTranscript && languages.includes(captionLanguage)) {
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
      this._stateManager.setInteractiveTranscriptVisibility(true);
    } else {
      this._stateManager.setInteractiveTranscriptVisibility(false);
    }

    this._analyticsManager.newEvent({verb: ANALYTICS_TOPICS.VIDEO_TRANSCRIPT}, {
      currentTranscriptStatus: this.state.showInteractiveTranscript,
      currentTranscriptLanguage: this.state.captionLanguage,
    });
  }
}

window.customElements.define(InteractiveTranscriptControl.is, InteractiveTranscriptControl);
