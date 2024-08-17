#!/bin/bash

commit_diff_count=$(/bin/bash .github/workflows/scripts/commit-diff-count.sh $BASE_REF $HEAD_REF)

if [ $commit_diff_count -gt 1 ]; then
  echo "::debug::PR contains more than one commit. Linting PR title..."
  echo "$PR_TITLE" | commitlint --verbose
else
  echo "::debug::Linting the single PR commit..."
  commitlint --verbose --from "$BASE_SHA" --to "$HEAD_SHA"
fi

