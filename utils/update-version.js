const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file');
const semverRegex = require('semver-regex');

const PACKAGE_FILE = path.join(__dirname, '../package.json');
const CONSTANTS_FILE = path.join(__dirname, '../src/constants.js');

fs.readFile(PACKAGE_FILE, (error, data) => {
  if(error) {
    console.error(error);
    return;
  }

  let npmPackage = JSON.parse(data);
  replace({
    files: CONSTANTS_FILE,
    from: new RegExp(semverRegex().source + '(?=(.*)\/\/ auto-generated-version)', 'gi'),
    to: npmPackage.version,
  }, (error) => {
    if(error) {
      console.error(error);
    }
  });
});
