# \<video-player\>



## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.



## Install Dependencies from bower.json

```
$ bower install bower.json
```

- Version of Webcomponents: 1.0.0-rc.5
- Version of Polymer: 2.0.0-rc.7

Install `mobx`:

```
$ cd bower_components/mobx
$ npm install
$ npm run small-build
```

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
