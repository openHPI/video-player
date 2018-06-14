const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file');

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
    from: /(\d+\.){2}(\d+)(?=(.*)\/\/ auto-generated-version)/g,
    to: npmPackage.version,
  }, (error) => {
    if(error) {
      console.error(error);
    }
  });
});
