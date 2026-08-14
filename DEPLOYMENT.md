# Deployment

Production deploys are sourced from GitHub's `main` branch. Local working-tree
files are never copied to the server.

1. Develop on a branch and run `npm run verify`.
2. Commit and push the branch.
3. Open a pull request and merge it into `main` after checks pass.
4. Update the local checkout so it contains the merged `origin/main` commit.
5. Run `./scripts/deploy-vps.sh`.

The local script resolves the exact `origin/main` commit SHA. The VPS entrypoint
fetches GitHub, verifies that SHA belongs to `origin/main`, checks it out in a
server-side repository, synchronizes that checkout while preserving production
secrets and persistent data, builds, restarts PM2, and runs health checks.

The deployed revision is recorded at
`/var/www/html/webgridplus-next/.deployed-commit`.
