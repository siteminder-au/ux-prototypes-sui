#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $(basename $0) <version>"
  exit 1
fi

set -xeo pipefail

# we add `-vue3` suffix so we don't conflict with sui vue2 published packages
# for example, if master (vue2) branch latest published package is 9.0.0
# then when we publish GA build from vue3 branch, we will publish as 9.0.0-vue3
# downstream projects can install vue3 GA build by specifying version 9.0.0-vue3
# in their package.json.
# so we can have both vue2 and vue3 GA packages in npm registry
# - we continue publishing vue2 packages from master branch and freely use major, minor or patch versions.
# - for GA packages we publish from vue3 branch, we can also freely use major, minor or patch versions.
# once all components are migrated to vue3, we merge vue3 branch back to master and drop the `-vue3` suffix
# we will then publish vue3 GA package from master branch using the next available major version (e.g. 10.0.0)
# we then announce pre-10.0.0 is vue2 and 10.0.0+ is vue3
npm_version="$1-vue3"
echo "$npm_version"

echo "updating frontends/docs version..."
pushd frontends/docs
npm version $npm_version || true
popd

echo "updating frontends/goldeneye version..."
pushd frontends/goldeneye
npm version $npm_version || true
popd

echo "updating libs/sui-core version..."
pushd libs/sui-core
npm version $npm_version || true
popd

echo "updating libs/sui-icons version..."
pushd libs/sui-icons
npm version $npm_version || true
popd

echo "updating libs/sui-themes version..."
pushd libs/sui-themes
npm version $npm_version || true
popd
