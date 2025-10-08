#!/bin/bash

# Remove sensitive data from git history
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch UPDATE_ENV_FILE.md' \
--prune-empty --tag-name-filter cat -- --all

# Clean up
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive
