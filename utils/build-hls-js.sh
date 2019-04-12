# Hls.js is shipped as UMD modules that may cause compatibility issues if the surrounding website uses a modules loader, such as require.js
# Therefore, hls.js is rebuilt with output library target window to ensure it is globally available.
echo 'Rebuilding hls.js...'
cd node_modules/hls.js
npm install --silent
node_modules/.bin/webpack --config-name debug --output-library-target window --display errors-only
#node_modules/.bin/webpack --config-name dist --output-library-target window --display errors-only
node_modules/.bin/webpack --config-name light --output-library-target window --display errors-only
#node_modules/.bin/webpack --config-name light-dist --output-library-target window --display errors-only
tail -n +2 dist/hls.js > temp
cat temp > dist/hls.js
tail -n +2 dist/hls.light.js > temp
cat temp > dist/hls.light.js
rm temp