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

The bundle is automatically created for each version tag and attatched to the corresponding [GitHub release](https://github.com/openHPI/videoplayer/releases).

## Configuration
See [configuration.md](docs/configuration.md)

## Features
See [features.md](docs/features.md)

## Extending the Framework
See [extending.md](docs/extending.md)

## Tests 
See [tests.md](docs/tests.md)

## Linter
The framework comes with several linter configurations. All linters can by executed using `npm run lint`.

## Releases
A new GitHub release can be created by merging in the master branch and executing `npm run deploy [major|minor|patch]`. This creates a new version tag and pushes the branch. 

The sources are bundled and the release is created afterwards by Travis, if the tests are passing.

## Miscellaneous
### User Preferences
Properties changed by the user are always automatically saved in the browser's LocalStorage. Possible for:
* `playbackRate`
* `quality`
* `volume`

When using `userPreferences` in the configuration, it will override the preferences saved in LocalStorage.

### iOS Support
Currently dual video playing is not fully supported on iOS, based on hardware rendering capabilities. Till there is an API to determince if some video will play, iOS will only be able to handle single stream. This will be handled by the player automaticly.
