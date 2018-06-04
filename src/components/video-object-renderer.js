import { PolymerElement, html } from '@polymer/polymer';

class VideoObjectRenderer extends PolymerElement {
  static get template() {
    return html`
      <script type="application/ld+json">[[_stringifyVideoObject(videoObject)]]</script>
    `;
  }

  static get is() { return 'video-object-renderer'; }

  static get properties() {
    return {
      videoObject: Object,
    };
  }

  _stringifyVideoObject(videoObject) {
    return JSON.stringify(videoObject, null, 2);
  }
}

window.customElements.define(VideoObjectRenderer.is, VideoObjectRenderer);
