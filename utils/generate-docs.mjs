import fs from 'fs';
import path from 'path';
import { configurationSchema } from '../src/configuration-schema.mjs';

// Workaround to get path of current file as __filename and __dirname are not
// available when using node experimental modules, which are necessay to load ES6 modules.
// Copied from https://github.com/nodejs/node/issues/16844#issuecomment-351740551
const FILE_NAME = decodeURI((/^ +at (?:file:\/*(?=\/)|)(.*?):\d+:\d+$/m.exec(Error().stack) || '')[1]);
const DIR_NAME = path.dirname(FILE_NAME);

const README_FILE = path.join(DIR_NAME, '../docs/configuration.md');
const BEGIN_SECTION_PATTERN = '<!-- BEGIN-SECTION CONFIGURATION -->';
const END_SECTION_PATTERN = '<!-- END-SECTION CONFIGURATION -->';


function generateDocs(schema, level = 0) {
  let requiredKeys = Object.keys(schema).filter(key => schema[key].required);
  let optionalKeys = Object.keys(schema).filter(key => !schema[key].required);

  return requiredKeys.concat(optionalKeys)
                     .map(key => generateDocsForOption(key, schema[key], level))
                     .map(docs => indent(docs, level))
                     .join('\n');
}

function generateDocsForOption(option, attr, level) {
  let optionDocs = `* **${option}** (${attr.type}):`;

  if(attr.options) {
    optionDocs += `\`<[${attr.options.map(JSON.stringify).join(',')}]>\``;
  }
  if(typeof attr.min !== 'undefined' || typeof attr.max !== 'undefined') {
    let min = typeof attr.min !== 'undefined' ? attr.min : '';
    let max = typeof attr.max !== 'undefined' ? attr.max : '';
    optionDocs += `\`<${min}...${max}>\``;
  }
  if(attr.description) {
    optionDocs += ` ${attr.description}`;
  }
  if(typeof attr.default !== 'undefined') {
    optionDocs += ` (${attr.required ? '**Required**, ' : ''}default: \`${JSON.stringify(attr.default)}\`)`;
  } else if(attr.required) {
    optionDocs += ' (*Required*)';
  }
  if(attr.schema) {
    optionDocs += `\n${generateDocs(attr.schema, level + 1)}`;
  }
  if(attr.example) {
    optionDocs += '\n\n' + formatExample(attr.example, level + 1);
  }

  return optionDocs;
}

function formatExample(example, level) {
  let headline = indent('*Example*', level);
  let exampleString = JSON.stringify(example, null, 2)
                          .split('\n')
                          .map(line => indent(line, level))
                          .join('\n');

  return `${headline}\n\`\`\`JSON\n${exampleString}\n\`\`\``;
}

function indent(string, level = 0) {
  return Array(level * 4).join(' ') + string;
}


// Read docs from README file
fs.readFile(README_FILE, 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  // Update configuration section
  let start = data.indexOf(BEGIN_SECTION_PATTERN) + BEGIN_SECTION_PATTERN.length;
  let end = data.indexOf(END_SECTION_PATTERN);
  if(start >= BEGIN_SECTION_PATTERN.length && end > start) {
    let docs = generateDocs(configurationSchema);
    let newData = `${data.substring(0, start)}\n${docs}\n${data.substring(end)}`;

    // Write updated docs to README file
    fs.writeFile(README_FILE, newData, 'utf8', (err) => {
      if (err) {
        return console.log(err);
      }
    });
  } else {
    throw new Error('Configuration section delimiter not found in readme file.');
  }
});
