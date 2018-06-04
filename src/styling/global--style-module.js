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
    </style>
  </template>
</dom-module>`;

document.head.appendChild(documentContainer.content);
