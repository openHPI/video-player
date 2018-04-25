# polymer-font-awesome
Loading fonts inside the dom-module of a web component is not supported. However, the FontAwesome CSS needs to be loaded inside the dom-module so that the styles are applied within the shadow DOM of the component.
Therefore, the font needs to be loaded explicitly outside of the context of the dom-module.

This projects splits the FontAwesome stylesheet and embeds the CSS rules inside a custom style/style module, so they can easily be included in Polymer web components.

## Usage
The project consists of two files:
* `font-face.html`: Polymer custom style, which loads the actual fonts.
* `font-awesome.html`: Polymer style module, which contains the FontAwesome CSS rules.

Both files must be loaded inside your component outside the `dom-module` definition:
```html
<link rel="import" href="node_modules/polymer-font-awesome/dist/font-face.html">
<link rel="import" href="node_modules/polymer-font-awesome/dist/font-awesome.html">

<dom-module id="...">
...
</dom-module>
```
Additionally, the style module needs to be included in the template of your component as described in the [Polymer docs](https://www.polymer-project.org/2.0/docs/devguide/style-shadow-dom#style-modules):
```html
<style type="text/css" include="font-awesome"></style>
```

## Packaging
When using [polymer-build](https://github.com/Polymer/polymer-build) to build your component, you must add the fonts as extra dependencies in `polymer.json`:
```json
{
  "extraDependencies": [
      "node_modules/polymer-font-awesome/dist/fonts/*"
  ]
}
```

## License
- The Font Awesome font is licensed under the SIL OFL 1.1:
  - http://scripts.sil.org/OFL
- Font Awesome CSS, LESS, and Sass files are licensed under the MIT License:
  - https://opensource.org/licenses/mit-license.html
