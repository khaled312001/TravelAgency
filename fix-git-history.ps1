# Fix git history by removing UPDATE_ENV_FILE.md completely

# Set git pager to cat to avoid interactive prompts
$env:GIT_PAGER = 'cat'

# Remove the file from all commits
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch UPDATE_ENV_FILE.md" --prune-empty --tag-name-filter cat -- --all

# Clean up
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "Git history cleaned successfully!"
