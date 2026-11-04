#!/usr/bin/env bash
# Visual regression suite — native (no Docker). Baselines are per-environment
# and untracked: a machine only diffs against baselines it holds (seed them
# with scripts/baselines.sh).
#
# Usage:
#   scripts/test-visual.sh            # assert against this env's baselines
#   scripts/test-visual.sh --update   # (re)generate this env's baselines
#
# Parallel worktrees share one port. The Storybook build runs without the
# port; only the serve and the test run hold it, under a lock on a fixed
# path, so a second run waits instead of taking another port.
#
# A loaded machine flakes a few shots (measured: the untouched source failed
# 29 of 754 at load average 30, after passing all of them at rest). So a
# failing assert run is repeated once, and only the shots that fail both
# runs count; they are listed in visual-stable.json.
set -euo pipefail
cd "$(dirname "$0")/.."

# 6016, not 6006 — must not collide with a `storybook dev` session.
PORT="${VISUAL_PORT:-6016}"
UPDATE=0
if [[ "${1:-}" == "--update" ]]; then UPDATE=1; fi

# `bun x`, not `bunx`: some hosts have the bun binary but not the alias.
bun x playwright install chromium
bun run build:storybook

# shellcheck source=visual-lock.sh
source "scripts/visual-lock.sh"

# One serve + test pass; writes the report named by $1. CI and
# GITHUB_ACTIONS are cleared for the jest child: under CI detection jest
# refuses to WRITE missing snapshots, which would fail every new story.
run_pass() {
  local report="$1" extra="${2:-}"
  bun x concurrently -k -s first \
    "bun scripts/serve-static.ts storybook-static ${PORT}" \
    "bun x wait-on tcp:127.0.0.1:${PORT} && CI= GITHUB_ACTIONS= bun x test-storybook --url http://127.0.0.1:${PORT} -- --json --outputFile=${report} ${extra}"
}

take_lock

if (( UPDATE )); then
  run_pass visual-report.json -u
  exit $?
fi

if run_pass visual-report.json; then
  bun scripts/visual-stable.ts visual-report.json
  exit 0
fi
echo "visual: first pass failed, repeating once to separate flakes from moved shots"
cp visual-report.json visual-report.first.json
run_pass visual-report.json || true
bun scripts/visual-stable.ts visual-report.first.json visual-report.json
