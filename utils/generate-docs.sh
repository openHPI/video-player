# Configuration schema file needs to have .js extension to be loaded by Polymer
# elements, but .mjs extension to be imported in node script using experimental
# modules (necessary to import ES6 modules). This workaround can be removed
# when node completely supports ES6 modules.
cp src/configuration-schema.js src/configuration-schema.mjs
node --experimental-modules ./utils/generate-docs.mjs
rm src/configuration-schema.mjs
