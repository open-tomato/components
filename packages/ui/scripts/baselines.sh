#!/usr/bin/env bash
# Baselines are untracked, so a new worktree or machine starts without them.
# This copies the PNGs between the package and one store folder.
#
#   scripts/baselines.sh save   # package -> store
#   scripts/baselines.sh seed   # store -> package (overwrites same names)
#
# The store is $COMPONENTS_BASELINES, by default a folder under the user's
# cache directory.
set -euo pipefail
cd "$(dirname "$0")/.."

STORE="${COMPONENTS_BASELINES:-${XDG_CACHE_HOME:-$HOME/.cache}/open-tomato-components/baselines}"
LOCAL="visual/__image_snapshots__"

case "${1:-}" in
  save)
    mkdir -p "$STORE"
    cp "$LOCAL"/*.png "$STORE"/
    echo "baselines: saved $(ls "$LOCAL"/*.png | wc -l | tr -d ' ') to $STORE"
    ;;
  seed)
    if ! ls "$STORE"/*.png >/dev/null 2>&1; then
      echo "baselines: $STORE holds no PNGs; run 'scripts/baselines.sh save' where they exist" >&2
      exit 1
    fi
    mkdir -p "$LOCAL"
    cp "$STORE"/*.png "$LOCAL"/
    echo "baselines: seeded $(ls "$LOCAL"/*.png | wc -l | tr -d ' ') from $STORE"
    ;;
  *)
    echo "usage: scripts/baselines.sh save|seed" >&2
    exit 2
    ;;
esac
