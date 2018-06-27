import { BindingHelpersMixin } from '../../mixins/binding-helpers.js';
import '../../styling/control-bar--style-module.js';
import 'fontawesome-icon';
import { PolymerElement, html } from '@polymer/polymer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

class SelectControl extends BindingHelpersMixin(PolymerElement) {
  static get template() {
    return html`
      <style type="text/css" include="control-bar--style-module">
        :host {
          width: 100%;
        }

        #inner_container__select_control {
          position: relative;
          height: 40px;
        }
        .dropdown .dropdown-content-container {
          position: absolute;
          /* Equals control bar height. This is set to assure that the dropdown opens to the top. */
          bottom: 40px;
          left: -5px;
          z-index: 10;

          display: flex;
          align-items: flex-end;
        }
        .dropdown .dropdown-content {
          display: flex;
          white-space: nowrap;
          flex-direction: column;
          justify-content: stretch;
          border: 1px solid black;
          margin-left: -1px;

          @apply --set-foreground-color;
          @apply --set-background-color;
        }
        .dropdown .dropdown-content:first-of-type {
          border-bottom: 1px solid transparent;
          margin-left: 0;
        }
        .dropdown .dropdown-content:not(:first-of-type):not(.active) {
          display: none;
        }

        .dropdown .dropdown-content a {
          display: flex;
          justify-content: space-between;
          width: auto;
          padding: 0 5px;
          text-align: left;
          line-height: 2;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown .dropdown-content a:hover,
        .dropdown .dropdown-content a.active,
        .dropdown .dropdown-content a.selected {
          background-color: grey;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
        }
        .dropdown .dropdown-content .children-indicator {
          display: inline-block;
          margin-left: 6px;
        }

        .dropdown #button__select.with-badge:after {
          content: attr(badge-value);
          position: absolute;
          top: 6px;
          right: -12px;
          width: 20px;
          @apply --set-accent-color-background;
          @apply --set-font-color-on-accent-color;
          border-radius: 2px;
          line-height: 1.5;
          font-size: 9px;
          font-weight: lighter;
        }

        #container__select_control {
          padding-right: 10px;
        }

        #container__select_control.in-menu-entry {
          background-color: transparent;
        }

        .in-menu-entry #inner_container__select_control {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .in-menu-entry #button__select {
          /* Necessary for horizontally aligning all icons */
           width: 30px;
        }
        .in-menu-entry #dropdown__select {
          display: flex;
        }
        .in-menu-entry #button__select, .in-menu-entry #dropdown__select a {
          padding: 0 5px;
          color: white;
        }

        .in-menu-entry #dropdown__select a.selected {
          @apply --set-accent-color-background;
          @apply --set-font-color-on-accent-color;
        }
      </style>

      <div id="container__select_control" on-mouseover="_handleMouseOver" on-mouseout="_handleMouseOut" class$="user_controls [[ifNotThen(isInMobileMenu, 'dropdown')]] [[ifThen(isInMobileMenu, 'in-menu-entry')]]">
        <div id="inner_container__select_control">
          <a id="button__select" class$="button [[ifThen(selectedItem.value, 'with-badge')]] [[ifNotThen(active, 'inactive')]]" badge-value$="[[_getBagdeValue(selectedItem)]]" href="javascript:void(0)" on-click="_handleClick">
            <fontawesome-icon prefix="[[iconPrefix]]" name="[[iconName]]" fixed-width></fontawesome-icon>
          </a>
          <div id="dropdown__select" class$="dropdown-content-container [[ifNotThen(_isDropDownOpen, '-hidden')]]" on-mouseout="_handleDropdownMouseOut">
            <template is="dom-repeat" items="[[_sublists]]" as="sublist" index-as="sublistIndex">
              <div class$="dropdown-content [[_isSublistActiveThen(sublist, _navigationPath.*, 'active')]]" data-level$="[[sublist.level]]">
                <template is="dom-repeat" items="[[sublist.items]]">
                  <a name="[[item.text]]"
                     class$="[[ifEqualsThen(item.value, selectedValue, 'selected')]] [[_isItemActiveThen(index, sublist.level, _navigationPath.*, _selectedPath.*, 'active')]]"
                     href="javascript:void(0)"
                     data-level$="[[sublist.level]]"
                     on-click="_handleItemClick"
                     on-mouseover="_handleItemMouseOver">
                    <span>[[item.text]]</span>
                    <template is="dom-if" if="[[hasItems(item.children)]]">
                      <fontawesome-icon class="children-indicator" prefix="fas" name="caret-right"></fontawesome-icon>
                    </template>
                  </a>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
    `;
  }

  static get is() { return 'select-control'; }

  static get properties() {
    return {
      state: Object,
      items: {
        type: Array,
        value: () => [],
      },
      selectedValue: Object,
      selectedItem: {
        type: Object,
        computed: '_getSelectedItem(items, selectedValue)',
      },
      iconPrefix: String,
      iconName: String,
      isInMobileMenu: {
        type: Boolean,
        value: false,
      },
      active: {
        type: Boolean,
        value: true,
      },
      _sublists: {
        type: Array,
        computed: '_getSubLists(items)',
      },
      _navigationPath: {
        type: Array,
        value: [],
      },
      _selectedPath: {
        type: Array,
        computed: '_getSelectedPath(items, selectedItem)',
      },
      _isDropDownOpen: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get observers() {
    return [
      '_mobileSettingsMenuChanged(state.mobileSettingsMenuOpen)',
    ];
  }

  _handleMouseOver() {
    if(!this.state.mobileSettingsMenuOpen) {
      this._showDropDown();
    }
  }

  _handleMouseOut() {
    if(!this.state.mobileSettingsMenuOpen) {
      this._hideDropDown();
    }
  }

  _showDropDown() {
    this._isDropDownOpen = true;
    this.$.container__select_control.classList.add('open');
  }

  _hideDropDown() {
    this._isDropDownOpen = false;
    this.$.container__select_control.classList.remove('open');
  }

  _handleClick() {
    if(this._isDropDownOpen) {
      this._hideDropDown();
    } else {
      this._showDropDown();
    }
  }

  _handleItemMouseOver(e) {
    let index = e.model.index;
    let level = parseInt(e.currentTarget.dataset.level);
    this.splice('_navigationPath', level, this._navigationPath.length - level, {index});
  }

  _handleDropdownMouseOut(e) {
    let target = e.currentTarget;
    // Wait for sublists to be rendered
    afterNextRender(this, () => {
      // Only reset navigation path if mouse actually left all sublists
      let bounds = target.getBoundingClientRect();
      if(e.clientX < bounds.x || e.clientX > bounds.x + bounds.width &&
         e.clientY < bounds.y || e.clientY > bounds.y + bounds.height) {
        this.set('_navigationPath', []);
      }
    });
  }

  _handleItemClick(e) {
    let value = e.model.item.value;
    if(typeof value !== 'undefined') {
      this.selectedValue = value;
      this.dispatchEvent(new CustomEvent('change'));

      if(!this.state.mobileSettingsMenuOpen) {
        this._hideDropDown();
      }
    }
  }

  _getBagdeValue(item) {
    return item.badgeValue || item.text;
  }

  _getSelectedItem(items, selectedValue) {
    if(items) {
      // Check for item on current level
      let selectedItem = items.find(item => item.value === selectedValue);
      if(selectedItem) {
        return selectedItem;
      }

      // Check for item recursively on descendant levels
      return items.filter(item => typeof item.children !== 'undefined')
                  .map(item => this._getSelectedItem(item.children, selectedValue))[0];
    }
  }

  _getSelectedPath(items, selectedItem) {
    if(items) {
      // Check for item on current level
      let index = items.indexOf(selectedItem);
      if(index >= 0) {
        return [{index}];
      }

      // Check for item recursively on descendant levels
      for(let i = 0; i < items.length; i++) {
        let item = items[i];
        let subPath = this._getSelectedPath(item.children, selectedItem);
        if(subPath) {
          return [{index: i}].concat(subPath);
        }
      }
    }
  }

  _getSubLists(items, level = 0, parentIndex = null) {
    if(typeof items === 'undefined' || items.length === 0) {
      return [];
    }

    let currentList = {level, parentIndex, items };
    let sublists = items.map((item, index) => {
      if(!item.children) {
        return null;
      }
      return this._getSubLists(item.children, level + 1, index);
    }).filter(sublist => sublist).reduce((acc, val) => acc.concat(val), []);

    return [currentList].concat(sublists);
  }

  _isSublistActiveThen(sublist, navigationPathChange, thenValue) {
    if(this._navigationPath.some((navItem, level) => level === sublist.level - 1 && navItem.index === sublist.parentIndex)) {
      return thenValue;
    }
  }

  _isItemActiveThen(index, level, navigationPathChange, activePathChange, thenValue) {
    if((this._navigationPath[level] && this._navigationPath[level].index === index) ||
       (this._selectedPath[level] && this._selectedPath[level].index === index)) {
      return thenValue;
    }
  }

  _mobileSettingsMenuChanged(menuOpen) {
    if(menuOpen) {
      if (this.isInMobileMenu) {
        this._showDropDown();
      } else {
        this._hideDropDown();
      }
    }
  }
}

window.customElements.define(SelectControl.is, SelectControl);
