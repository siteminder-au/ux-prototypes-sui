#!/bin/bash
# this will trigger a separate build for the sui-cypress buildkite pipeline that runs the cypress tests
set -ex
echo "uploading sui-cypress-test.yaml"
buildkite-agent pipeline upload ${PWD}/ci-scripts/sui-cypress-test.yaml
echo "uploading sui-cypress-test.yaml done"