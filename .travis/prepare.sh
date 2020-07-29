#!/bin/sh

# Configure the user
git config user.email "${GITHUB_EMAIL}"
git config user.name "${GITHUB_USERLONGNAME}"

# Remote to origin
git remote rm origin
git remote add origin https://${GITHUB_USERNAME}:${GITHUB_API_TOKEN}@github.com/fair4health/f4h-portal-ui.git > /dev/null 2>&1

# Do the trick to avoid package-lock.json changes
git checkout -- .

echo -e "Done\n"