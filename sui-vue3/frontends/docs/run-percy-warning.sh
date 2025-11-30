#!/bin/bash

# Get the name of the current branch
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# Check if we're on the master branch
if [[ "$BRANCH" == "master" ]]; then
  # Prompt the user for confirmation
  printf "You are currently running percy on master branch.\nThis will refresh the percy base snapshots.\nOnly do this if you are absolutely sure.\n\nPress y to proceed or any other key to abort. (y): "
  read -n 1 -r
  echo  # Move to a new line
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    exit 0
  else
    exit 1
  fi
else
  exit 0
fi
