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

### Parameters
<!-- DO NOT REMOVE BEGIN-SECTION/END-SECTION COMMENTS. -->
<!-- THEY ARE USED FOR GENERATING PARAMETERS DOCS FROM SCHEMA. -->
<!-- BEGIN-SECTION CONFIGURATION -->
* **streams** (array): List of URLs to the videos streams of different qualities and (optional) poster images. If there is only one quality, use `hd`. (*Required*)
   * **hls** (string): URL of the HLS video stream.
   * **hd** (string): URL of the HD video stream.
   * **sd** (string): URL of the SD video stream.
   * **poster** (string): URL of the poster image.
   * **ratio** (string): The ratio of the video. This is mandatory when the videoAlignment is set to `height`. It should be in the format `x:y`.

   *Example*
```JSON
   [
     {
       "sd": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
       "hd": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
       "poster": "https://peach.blender.org/wp-content/uploads/bbb-splash.png"
     }
   ]
```
* **fallbackStream** (object): Contains a fallback stream that the user can switch to, i.e. a single stream source.
   * **hls** (string): URL of the HLS video stream.
   * **hd** (string): URL of the HD video stream.
   * **sd** (string): URL of the SD video stream.
   * **poster** (string): URL of the poster image.
   * **ratio** (string): The ratio of the video. This is mandatory when the videoAlignment is set to `height`. It should be in the format `x:y`.
* **language** (string): Language used for localizing messages. (default: `"en"`)
* **initialState** (object): The initial state the player has when loaded.
   * **playState** (string):`<["PLAYING","PAUSED"]>` (default: `"PAUSED"`)
   * **position** (number): Video position in seconds. (default: `0`)
   * **playbackRate** (number):`<[0.7,1,1.3,1.5,1.8,2]>` (default: `1`)
   * **quality** (string):`<["hls","hd","sd"]>` (default: `"best quality available"`)
   * **volume** (number):`<0...1>` (default: `1`)
   * **muted** (boolean): (default: `false`)
   * **captionLanguage** (string): (default: `"off"`)
* **userPreferences** (object): Override parts of the default/initial/saved state. Meant to be provided by the server based on the current user.
   * **playState** (string):`<["PLAYING","PAUSED"]>` (default: `"PAUSED"`)
   * **position** (number): Video position in seconds. (default: `0`)
   * **playbackRate** (number):`<[0.7,1,1.3,1.5,1.8,2]>` (default: `1`)
   * **quality** (string):`<["hls","hd","sd"]>` (default: `"best quality available"`)
   * **volume** (number):`<0...1>` (default: `1`)
   * **muted** (boolean): (default: `false`)
   * **captionLanguage** (string): (default: `"off"`)
* **foregroundColor** (string): HEX code of the color for text and all other main content.
* **accentColor** (string): HEX code of the highlighting color.
* **fontColorOnAccentColor** (string): HEX code of the font color on the `accentColor`. Take care that the contrast ratio is high enough.
* **backgroundColor** (string): HEX code of the background for the `foregroundColor`.
* **secondaryBackgroundColor** (string): HEX code of another background color used for example for displaying the buffer. Take care that the `foregroundColor` has a high contrast to both background colors.
* **theme** (string):`<["dark-orange","dark-yellow","dark-blue","light-green"]>` Predefined color theme (can be adjusted by settings the colors explicitly). (default: `"dark-orange"`)
* **loadFontAwesome** (boolean): [FontAwesome](http://fontawesome.io) is used for the icons of the player. If your site already loads FontAwesome, this can be set to false to save bandwidth. (default: `true`)
* **videoPreloads** (boolean): Turns on/off preloading of the videos when the page loads. (default: `true`)
* **chapters** (array): List of timestamps with chapter names.
   * **title** (string): Title of the chapter. (*Required*)
   * **startPosition** (number): Start position of the chapter in seconds. (*Required*)

   *Example*
```JSON
   [
     {
       "title": "Chapter 1",
       "startPosition": 0
     }
   ]
```
* **captions** (array): List of caption files for different languages.
   * **language** (string): Language of the captions. (*Required*)
   * **url** (string): URL of the captions WebVTT file. (*Required*)

   *Example*
```JSON
   [
     {
       "language": "en",
       "url": "/captions/en.vtt"
     }
   ]
```
* **slides** (array): List of presentation slides and corresponding start times in seconds to show below the progress.
   * **thumbnail** (string): URL of the slide thumbnail. (*Required*)
   * **startPosition** (number): Start position of the slide in seconds. (*Required*)

   *Example*
```JSON
   [
     {
       "thumbnail": "/image/of/slide.jpg",
       "startPosition": 0
     }
   ]
```
* **relatedVideos** (array): List of related videos that are shown after the video has ended.
   * **title** (string): Title of the video. (*Required*)
   * **url** (string): URL of the video page. (*Required*)
   * **thumbnail** (string): URL of the video thumbnail. (*Required*)
   * **duration** (number): Duration of the video in seconds.

   *Example*
```JSON
   [
     {
       "title": "Title of related video.",
       "url": "/url/of/video-page",
       "thumbnail": "/image/of/thumbnail.jpg",
       "duration": 2259
     }
   ]
```
* **playlist** (object): URLs of the previous and/or next video, if video is in a playlist.
   * **autoPlay** (boolean): If enabled, the user is redirected to the next video page after the video has ended. (default: `false`)
   * **previousVideo** (string): The URL of the previous video in the playlist.
   * **nextVideo** (string): The URL of the next video in the playlist.

   *Example*
```JSON
   {
     "autoPlay": true,
     "previousVideo": "/url/of/previous/video",
     "nextVideo": "/url/of/next/video"
   }
```
* **videoObject** (object): Video metadata defined in the [VideoObject](http://schema.org/VideoObject) schema as JSON-LD, which is rendered by the player.

   *Example*
```JSON
   {
     "@context": "http://schema.org/",
     "@type": "VideoObject",
     "name": "Name of the video",
     "duration": "Duration of the video"
   }
```
* **videoAlignment** (string):`<["width","height"]>` If there is more than one video this property decides whether they should have the same height or the same width.
<!-- END-SECTION CONFIGURATION -->

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

### iOS Support
Currently dual video playing is not fully supported on iOS, based on hardware rendering capabilities. Till there is an API to determince if some video will play, iOS will only be able to handle single stream. This will be handled by the player automaticly.
