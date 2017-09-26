#!/bin/bash -e
npm version $1
git push
git push --tags
./utils/github-pages.sh openHPI video-player
rm -rf ./video-player
