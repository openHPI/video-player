# videoplayer


## Getting Started

Make sure you have [NPM](https://www.npmjs.com/get-npm), [Bower](https://www.npmjs.com/package/bower) and the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed.

1. Clone the repository with `git clone https://github.com/openHPI/videoplayer`.
2. Change the directory with `cd videoplayer`.
3. Install dependencies by running `npm install`.
4. Execute `npm run serve` and head to `http://localhost:8080/components/video-player` in your browser for a demo.

## Usage for Production
The video player consists of multiple subcomponents, which can be bundled for production by running
```
$ npm run bundle
```
This creates two bundled versions of the video-player component, which can be found in the `dist` directory. `es6` contains the regular component written in ECMAScript 6, while the bundle located in `es5` is transpiled to ECMAScript 5 to support older browser.
To maximize the performance, it is recommended to serve the ES6 bundle to modern browsers and use the ES5 version only as fallback for older ones.

The component can then be used in any HTML site in the following way:
```html
<html>
  <head>
    <!-- HTML Custom Elements Adapter is only needed when using the transpiled ES5 version of the component. -->
    <script src="bower_components/webcomponentsjs/custom-elements-es5-adapter.js"></script>

    <script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="video-player.html">
  </head>
  <body>
    <video-player configuration='{
      "streams": ["http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"]
    }'></video-player>
  </body>
</html>
```

## Configuration

The player configuration is provided as JSON object: 
```html
<video-player configuration='{}'></video-player>
```

### Required Parameters
* **streams** (Array): List of URLs to the videos streams
* **primaryColor** (String): HEX code of the color for text and all other main content
* **secondaryColor** (String): HEX code of the highlighting color
* **backgoundColorForPrimary** (String): HEX code of the background for the `primaryColor`

### Optional Parameters
* **initialState** (Object): The initial state the player has when loaded. The following options are available:
    * **playState** (String): `<'PLAYING'|'PAUSED'>`
    * **position** (Number): Seconds
    * **duration** (Number): Seconds
    * **playbackRate** (Number): `<[0.7, 1.0, 1.3, 1.5, 1.8, 2.0]>`
    * **volume** (Number): `<0..1>`
    * **muted** (Boolean)
    * **fullscreen** (Boolean)
    * **isChapterListShown** (Boolean)
* **chapters** (Object): List of timestamps with chapter names
    ```JSON
    "chapters": [
      {
        "text": "Chapter 1",
        "seconds": 0
      }
    ]
    ```

## Tests

### Prerequisites

For Safari, you need to install the extension [SafariDriver.safariextz](http://selenium-release.storage.googleapis.com/2.48/SafariDriver.safariextz). Also, you need to have the _Develop_ menu active (toggled on in Preferences) and have toggled on the option _Allow Remote Automation_ underneath the _Develop_ menu.

### Running tests

The component is set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). The test suite can be executed locally by running
```
$ npm test
```
