#!/bin/bash

echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js

commitlint --verbose --from "$BASE_SHA" --to "$HEAD_SHA"

if [ $BASE_REF = 'dev' ]; then
  echo "::debug::PR is being merged into dev. Linting PR title also..."
  echo "$PR_TITLE" | commitlint --verbose
fi