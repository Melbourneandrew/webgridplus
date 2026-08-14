#!/usr/bin/env bash
set -euo pipefail

readonly HOST="root@5.161.82.203"
readonly REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly DEPLOY_BRANCH="main"

cd "$REPO_DIR"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Refusing to deploy with uncommitted local changes" >&2
  exit 1
fi

git fetch --quiet origin "$DEPLOY_BRANCH"
readonly DEPLOY_SHA="$(git rev-parse "origin/${DEPLOY_BRANCH}")"

if ! git merge-base --is-ancestor "$DEPLOY_SHA" HEAD; then
  echo "Local HEAD does not contain origin/${DEPLOY_BRANCH}; update the checkout first" >&2
  exit 1
fi

echo "Deploying origin/${DEPLOY_BRANCH} at ${DEPLOY_SHA}"
ssh "$HOST" /usr/local/sbin/deploy-webgridplus "$DEPLOY_SHA"

curl --fail --silent --show-error --retry 5 --retry-delay 2 \
  --output /dev/null https://webgridplus.com/

echo "Webgrid+ deployed successfully: https://webgridplus.com"
echo "Deployed commit: ${DEPLOY_SHA}"
