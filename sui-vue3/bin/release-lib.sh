#!/bin/bash

if [ $# -ne 2 ]; then
  echo "Usage: $(basename $0) <path-to-package> <message>"
  exit 1
fi

if [[ $(git rev-parse --abbrev-ref HEAD) != "master" ]]; then
  echo "Error: must be on master branch"
  exit 1
fi

git fetch

if [ $(git diff --name-status origin/master master | wc -l) -ne 0 ]; then
  echo "Error: local master branch does not match remote/origin/master"
  exit 1
fi

git status | grep "nothing to commit, working tree clean"
if [ $? -ne 0 ]; then
  echo "Error: there are uncommitted local changes"
  exit 1
fi

set -xeo pipefail

pkg_path=$1
tag_message=$2

pushd $pkg_path

pkg=$(basename $(pwd))

tag="v$(node --eval="process.stdout.write(require('./package.json').version)")"
git_tag="${pkg}.${tag}"

git tag -a "$git_tag" -m "$tag_message"
git push origin ${git_tag}

popd
