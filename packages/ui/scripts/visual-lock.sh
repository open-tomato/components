# Sourced by test-visual.sh: one lock per port, so parallel worktrees take
# turns on the shared port instead of each taking another one. The lock is a
# directory (mkdir is atomic on every filesystem) holding the owner's pid; a
# lock whose owner is gone is taken over.
#
# Needs PORT. Tunables: VISUAL_LOCK_DIR, VISUAL_LOCK_WAIT_SECONDS (3600),
# VISUAL_LOCK_POLL_SECONDS (5).

LOCK="${VISUAL_LOCK_DIR:-${TMPDIR:-/tmp}/components-visual-${PORT}.lock}"
LOCK_WAIT_SECONDS="${VISUAL_LOCK_WAIT_SECONDS:-3600}"
LOCK_POLL_SECONDS="${VISUAL_LOCK_POLL_SECONDS:-5}"

take_lock() {
  local waited=0
  until mkdir "$LOCK" 2>/dev/null; do
    local owner
    owner="$(cat "$LOCK/pid" 2>/dev/null || true)"
    if [[ -n "$owner" ]] && ! ps -p "$owner" >/dev/null 2>&1; then
      echo "visual: lock owner $owner is gone, taking the lock"
      rm -rf "$LOCK"
      continue
    fi
    if (( waited >= LOCK_WAIT_SECONDS )); then
      echo "visual: waited ${waited}s for $LOCK (owner ${owner:-unknown}), giving up" >&2
      exit 75
    fi
    if (( waited % 60 == 0 )); then echo "visual: waiting for $LOCK (owner ${owner:-unknown})"; fi
    sleep "$LOCK_POLL_SECONDS"
    waited=$(( waited + LOCK_POLL_SECONDS ))
  done
  echo $$ > "$LOCK/pid"
  trap 'rm -rf "$LOCK"' EXIT
}

