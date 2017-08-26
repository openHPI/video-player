## Tests

Tests are realized via the web-component-tester module. General information about testing with Polymer can be found [here](https://www.polymer-project.org/2.0/docs/tools/tests). Polymer uses [Mocha](http://mochajs.org) as its test framework, [Chai](http://chaijs.com) for assertions, [Sinon](http://sinonjs.org/) for spies, stubs, and mocks, [Selenium](http://www.seleniumhq.org/) for running tests against multiple browsers, and [Accessibility Developer Tools](https://github.com/GoogleChrome/accessibility-developer-tools) for accessibility audits. To support you in your testing, you can additionally use [iron-test-helpers](https://github.com/PolymerElements/iron-test-helpers), a small library of Polymer testing utitlity tools.

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
