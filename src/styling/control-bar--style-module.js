import './global--style-module.js';
const documentContainer = document.createElement('template');
documentContainer.setAttribute('style', 'display: none;');

documentContainer.innerHTML = `<dom-module id="control-bar--style-module">
  <template>
    <style type="text/css" include="global--style-module">
      /* ------
      * The styles defined here are heritated by many classes.
      * Thus be careful when changing rules here.
       ------ */

      :host {
        /* Necessary to ensure that the height is correct in Safari */
        display: flex;
        justify-content: center;
      }

      /* ------ Styling of the control bar elements ------ */
      .user_controls {
        /* ------ Alignment of the elements ------ */
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: inherit;

        /* ------ General styling of the control section ------ */
        padding: 0 10px;
        height: 40px;
        user-select: none;
        cursor: default;
      }

      .user_controls.-no-padding-left {
        padding-left: 0;
      }

      .user_controls a {
        line-height: 40px;
        vertical-align: middle;
        width: 100%;
        text-align: center;
        text-decoration: none;
        @apply --set-foreground-color;
      }

      .user_controls a:hover {
        text-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
      }
      .user_controls a:hover fontawesome-icon {
        filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
      }
      .user_controls .button fontawesome-icon {
        display: block;
        font-size: 1.25em;
      }

      .button {
        cursor: pointer;
        text-decoration: none;
      }
      .button.inactive {
        /* Override default color when the button is inactive */
        color: grey !important;
      }
      .button.inactive:after {
        display: none;
      }

    </style>
  </template>
</dom-module>`;

document.head.appendChild(documentContainer.content);
