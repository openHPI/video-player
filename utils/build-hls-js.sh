# Hls.js is shipped as UMD modules that may cause compatibility issues if the surrounding website uses a modules loader, such as require.js
# Therefore, hls.js is rebuilt with output library target window to ensure it is globally available.
# See https://github.com/video-dev/hls.js/issues/2910 on status of an ES6 module build of hls.js
echo 'Rebuilding hls.js...'
cd node_modules/hls.js
npm install --legacy-peer-deps --silent

# For some reason, they decided to not include their build config in their npm packages anymore
# see https://github.com/video-dev/hls.js/commit/083322b49e3c09ae35a33e553fe79343cf9e68dd
wget -nc https://raw.githubusercontent.com/video-dev/hls.js/v0.14.17/webpack.config.js

npx webpack --config-name debug --output-library-target window --display errors-only
npx webpack --config-name light --output-library-target window --display errors-only

tail -n +2 dist/hls.js > temp
cat temp > dist/hls.js
tail -n +2 dist/hls.light.js > temp
cat temp > dist/hls.light.js

rm temp
