#!/usr/bin/env bash
set -euo pipefail

readonly APP_DIR="/var/www/html/webgridplus-next"
readonly APP_NAME="webgridplus-next"
readonly HEALTH_URL="http://127.0.0.1:3002/"
readonly LOCK_FILE="/var/lock/deploy-webgridplus.lock"
readonly REPOSITORY_URL="https://github.com/Melbourneandrew/webgridplus.git"
readonly CHECKOUT_DIR="/var/lib/webgridplus/repository"
readonly DEPLOY_SHA="${1:-}"

if [[ ! "$DEPLOY_SHA" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Usage: deploy-webgridplus <40-character commit SHA>" >&2
  exit 2
fi

exec 9>"$LOCK_FILE"
flock -n 9 || { echo "Another Webgrid+ deployment is already running" >&2; exit 1; }

mkdir -p "$(dirname "$CHECKOUT_DIR")"
if [[ ! -d "$CHECKOUT_DIR/.git" ]]; then
  git clone --no-checkout "$REPOSITORY_URL" "$CHECKOUT_DIR"
fi

git -C "$CHECKOUT_DIR" remote set-url origin "$REPOSITORY_URL"
git -C "$CHECKOUT_DIR" fetch --quiet --prune origin main

if ! git -C "$CHECKOUT_DIR" merge-base --is-ancestor "$DEPLOY_SHA" origin/main; then
  echo "Refusing to deploy a commit that is not on origin/main: $DEPLOY_SHA" >&2
  exit 1
fi

git -C "$CHECKOUT_DIR" checkout --quiet --detach "$DEPLOY_SHA"

rsync -a --delete \
  --exclude '.git/' \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude '.env.production' \
  --exclude 'data/' \
  --exclude 'public/uploads/' \
  "$CHECKOUT_DIR/" "$APP_DIR/"

cd "$APP_DIR"
test -f .env.production
test -d data
test -d public/uploads

npm ci
npm run build

set -a
# shellcheck disable=SC1091
. ./.env.production
set +a
npm run db:seed

pm2 restart "$APP_NAME" --update-env
pm2 save --force >/dev/null
printf '%s\n' "$DEPLOY_SHA" > .deployed-commit

for attempt in {1..15}; do
  if curl --fail --silent --output /dev/null "$HEALTH_URL"; then
    echo "Webgrid+ is healthy after deployment"
    exit 0
  fi
  sleep 1
done

pm2 logs "$APP_NAME" --lines 50 --nostream >&2
exit 1
