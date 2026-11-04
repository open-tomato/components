#!/usr/bin/env bash
# Provenance markers of the parallel streams. Each stream wraps every hunk it
# writes in a file another stream may also edit, one marker per line:
#
#   // @@V mol-2 begin          (TS)       {/* @@S org-2 begin */}   (JSX)
#   // @@V mol-2 end                       {/* @@S org-2 end */}
#
# The stream letter (V, T, S or R) and the batch tell the merge which change
# came from where. Recombination removes them all with `strip`.
#
#   tools/streams/markers.sh list  [path...]   print each marker line; exit 1 if any
#   tools/streams/markers.sh strip [path...]   delete every marker line in place
#
# Paths default to packages/ui/src. Run from the repository root.
set -euo pipefail

PATTERN='^[[:space:]]*(//|\{/\*) @@[VTSR] [a-z]{3}-[0-9] (begin|end)( \*/\})?[[:space:]]*$'
ACTION="${1:-list}"
shift || true
if (( $# == 0 )); then set -- packages/ui/src; fi

case "$ACTION" in
  list)
    if grep -rnE --include='*.ts' --include='*.tsx' --include='*.css' "$PATTERN" "$@"; then
      exit 1
    fi
    echo "markers: none"
    ;;
  strip)
    files="$(grep -rlE --include='*.ts' --include='*.tsx' --include='*.css' "$PATTERN" "$@" || true)"
    if [[ -z "$files" ]]; then echo "markers: none to strip"; exit 0; fi
    while IFS= read -r file; do
      tmp="$(mktemp)"
      grep -vE "$PATTERN" "$file" > "$tmp" || true
      cat "$tmp" > "$file"
      rm -f "$tmp"
    done <<< "$files"
    echo "markers: stripped from $(wc -l <<< "$files" | tr -d ' ') file(s)"
    ;;
  *)
    echo "usage: tools/streams/markers.sh list|strip [path...]" >&2
    exit 2
    ;;
esac
