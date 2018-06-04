import './global--style-module.js';
const documentContainer = document.createElement('template');
documentContainer.setAttribute('style', 'display: none;');

documentContainer.innerHTML = `<dom-module id="lists--style-module">
  <template>
    <style type="text/css" include="global--style-module">
      /*
      ** Style module for all kinds of lists
      ** This is for example used for the interactive transcripts or chapters component.
      */
      .container__list .list {
        margin: 0;
        padding: 0;
        overflow-y: auto;
        list-style-type: none;
        height: inherit;
      }
      .container__list .list.sublist {
        overflow-y: visible;
      }

      .container__list .list_item {
        padding: 5px 5px 5px 20px;
        -webkit-font-smoothing: antialiased;
      }
      .container__list .list_item.sublist_item {
        font-size: 0.9em;
        padding: 2px 5px 2px 20px;
      }

      .container__list .list_item .list_item__link {
        cursor: pointer;
        text-decoration: none;
      }

      .container__list .list_item .list_item__link:before {
        font-family: FontAwesome;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(documentContainer.content);
