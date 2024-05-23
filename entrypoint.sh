#!/bin/sh


cd /app

LOCKFILE="/tmp/migration.lock"

if [ ! -f "$LOCKFILE" ]; then
  npm install
  echo "Running migration command for the first time"
  npm run migration:generate && npm run migration:push
  touch "$LOCKFILE"
else
  echo "Migration command has already been run"
fi

exec "$@"
