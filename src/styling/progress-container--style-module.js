import './global--style-module.js';
const documentContainer = document.createElement('template');
documentContainer.setAttribute('style', 'display: none;');

documentContainer.innerHTML = `<dom-module id="progress-container--style-module">
  <template>
    <style type="text/css" include="global--style-module">
      /* ------
      * The styles defined here are heritated by many classes.
      * Thus be careful when changing rules here.
       ------ */

      .progress_indicator {
        display: flex;
        border-top: 1px solid black;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(documentContainer.content);
