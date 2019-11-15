const documentContainer = document.createElement('template');
documentContainer.setAttribute('style', 'display: none;');

documentContainer.innerHTML = `<dom-module id="global--style-module">
  <template>
    <style type="text/css">
      * {
        box-sizing: content-box;
      }

      .-hidden {
        display: none !important;
      }

      button {
        outline: none;
        border: none;
        background: none;
        color: inherit;

        font-size: inherit;
        font-family: inherit;
        line-height: inherit;
        margin: inherit;
        padding: 0;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(documentContainer.content);
