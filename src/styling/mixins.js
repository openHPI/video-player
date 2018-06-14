import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/polymer/lib/elements/custom-style.js';
const documentContainer = document.createElement('template');
documentContainer.setAttribute('style', 'display: none;');

documentContainer.innerHTML = `<custom-style>
  <style is="custom-style">
    video-player {
      --set-foreground-color: {
        color: #FFFFFF;
        color: var(--foreground-color);
      }

      --set-accent-color-foreground: {
        color: #DD6112;
        color: var(--accent-color);
      }
      --set-accent-color-background: {
        background-color: #DD6112;
        background-color: var(--accent-color);
      }
      --set-font-color-on-accent-color: {
        color: #FFFFFF;
        color: var(--font-color-on-accent-color);
      }

      --set-background-color: {
        background-color: #424242;
        background-color: var(--background-color);
      }

      --set-secondary-background-color: {
        background-color: #6D6D6D;
        background-color: var(--secondary-background-color);
      }

      --transition-duration-200: {
        -webkit-transition: all 200ms ease;
        -moz-transition: all 200ms ease;
        -ms-transition: all 200ms ease;
        -o-transition: all 200ms ease;
        transition: all 200ms ease;
      }

      --transition-duration-600: {
        -webkit-transition: all 600ms ease;
        -moz-transition: all 600ms ease;
        -ms-transition: all 600ms ease;
        -o-transition: all 600ms ease;
        transition: all 600ms ease;
      }

      --box-sizing-border-box: {
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
      }
    }
  </style>
</custom-style>`;

document.head.appendChild(documentContainer.content);
