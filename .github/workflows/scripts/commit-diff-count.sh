#!/bin/bash

base_ref=$(git branch -r | grep $1 | xargs)
head_ref=$(git branch -r | grep $2 | xargs)

echo $(git log --oneline "$head_ref" \^"$base_ref" | wc -l)
