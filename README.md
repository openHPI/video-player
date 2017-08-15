# videoplayer
Master: [![Build Status](https://travis-ci.org/openHPI/videoplayer.svg?branch=master)](https://travis-ci.org/openHPI/videoplayer)
Dev: [![Build Status](https://travis-ci.org/openHPI/videoplayer.svg?branch=dev)](https://travis-ci.org/openHPI/videoplayer)


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
This creates two bundled versions of the video-player component, which can be found in the `build` directory. `es6` contains the regular component written in ECMAScript 6, while the bundle located in `es5` is transpiled to ECMAScript 5 to support older browser.
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
      "streams": [{"hd": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}]
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
* **streams** (Array): List of URLs to the videos streams of different qualities and (optional) poster images. If there is only one quality, use `hd`.
    ```JSON
    "streams": [
      {
        "sd": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "hd": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "poster": "https://peach.blender.org/wp-content/uploads/bbb-splash.png"
      }
    ]
    ```

### Optional Parameters
* **initialState** (Object): The initial state the player has when loaded. The following options are available:
    * **playState** (String): `<'PLAYING'|'PAUSED'>` (default: `PAUSED`)
    * **position** (Number): Seconds (default: `0`)
    * **playbackRate** (Number): `<[0.7, 1.0, 1.3, 1.5, 1.8, 2.0]>` (default: `1.0`)
    * **volume** (Number): `<0..1>` (default: `1.0`)
    * **muted** (Boolean): (default: `false`)
    * **captionLanguage** (String): (default: `off`)
* **userPreferences** (Object): Override parts of the default/initial/saved state. Meant to be provided by the server based on the current user. See [User Preferences](#user-preferences)
* **foregroundColor** (String): HEX code of the color for text and all other main content (default: `#FFFFFF`)
* **accentColor** (String): HEX code of the highlighting color (default: `#DD6112`)
* **fontColorOnAccentColor** (String): HEX code of the font color on the `accentColor` (default: `#000000`). Take care that the contrast ratio is high enough
* **backgroundColor** (String): HEX code of the background for the `foregroundColor` (default: `#424242`)
* **secondaryBackgroundColor** (String): HEX code of another background color used for example for displaying the buffer (default: `#424242`). Take care that the `foregroundColor` has a high contrast to both background colors
* **theme** (String): Predefined color theme (can be adjusted by settings the colors explicitly) `<'dark-orange', 'dark-yellow', 'dark-blue', 'light-green'>`
* **videoPreload** (Boolean): Turns on/off preloading of the videos when the page loads (default: `true`)
* **loadFontAwesome** (Boolean): [FontAwesome](http://fontawesome.io/) is used for the icons of the player. If your site already loads FontAwesome, this can be set to `false` to save bandwidth. (default: `true`)
* **chapters** (Array): List of timestamps with chapter names
    ```JSON
    "chapters": [
      {
        "text": "Chapter 1",
        "seconds": 0
      }
    ]
    ```
* **captions** (Array): List of caption files for different languages
    ```JSON
    "captions": [
      {
        "language": "en",
        "source": "/captions/en.vtt"
      }
    ]
    ```
* **slides** (Array): List of presentation slides and corresponding start times in seconds to show below the progress bar
    ```JSON
    "slides": [
      {
        "imageUrl": "/image/of/slide.jpg",
        "startPosition": 0
      }
    ]
    ```
* **relatedVideos** (Array): List of related videos that are shown after the video has ended
    ```JSON
    "relatedVideos": [
      {
        "title": "Title of related video",
        "imageUrl": "/image/of/thumbnail.jpg",
        "url": "/url/of/video-page"
      }
    ]
    ```
* **playlist** (Object): URLs of the previous and/or next video, if video is in a playlist. If `autoPlay` is enabled, the user is redirected to the next video page after the video has ended.
  ```JSON
  "playlist": {
    "autoPlay": true,
    "previousVideo": "/url/of/previous/video",
    "nextVideo": "/url/of/next/video"
  }
  ```
* **videoObject** (Object): Video metadata defined in the [VideoObject](http://schema.org/VideoObject) schema as JSON-LD, which is rendered by the player.
  ```JSON
  "videoObject": {
    "@context": "http://schema.org/",
    "@type": "VideoObject",
    "name": "Name of the video",
    "duration": "Duration of the video"
  }
  ```
## Tests

Tests are realized via the web-component-tester module. General information about testing with Polymer can be found [here](https://www.polymer-project.org/2.0/docs/tools/tests). Polymer uses [Mocha](http://mochajs.org) as its test framework, [Chai](http://chaijs.com) for assertions, [Sinon](http://sinonjs.org/) for spies, stubs, and mocks, [Selenium](http://www.seleniumhq.org/) for running tests against multiple browsers, and [Accessibility Developer Tools](https://github.com/GoogleChrome/accessibility-developer-tools) for accessibility audits.

### Prerequisites

For Safari, you need to install the extension [SafariDriver.safariextz](http://selenium-release.storage.googleapis.com/2.48/SafariDriver.safariextz). Also, you need to have the _Develop_ menu active (toggled on in Preferences) and have toggled on the option _Allow Remote Automation_ underneath the _Develop_ menu.

### Running tests

The component is set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). The test suite can be executed locally by running
```
$ npm test
```

Note: Safari will fail this test when accessing a fixture because of a bug.

### Debugging Tests

If tests fail, it can be very helpful to see more information about why they fail. To be able to debug tests, you should run the following command:

```
$ npm run testdebugging
```

This will leave the browser window open, enabling you to re-run the tests and set breakpoints in your preferred browser. Unfortunately, if you open the Developer Tools, the testing environment decides to close them repeatedly, pretty much defeating the purpose of the persistent environment. Fret not, dear friend, as there is a shitty workaround you can use, described [in the bug report for this problem](https://github.com/Polymer/web-component-tester/issues/242):

- polymer test -p
- copy URL
- close chrome
- open a new chrome manually
- paste url + enter
- Voilà, devtools now stays open, but becomes more slow over time (seems like a memory leak), you'll have to reboot it after some time

## Miscellaneous
### User Preferences
Properties changed by the user are always automatically saved in the browser's LocalStorage. Possible for:
* `playbackRate`
* `quality`
* `volume`

When using `userPreferences` in the configuration, it will override the preferences saved in LocalStorage.
