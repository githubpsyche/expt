#!/usr/bin/env bash
set -euo pipefail

JATOS_URL="${JATOS_URL:-http://localhost:9000}"
JATOS_DIR="${JATOS_DIR:-$HOME/jatos}"
STUDY_UUID="0dc73046-ff4d-488a-964e-a25ad492eb84"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT="${1:-$HOME/Downloads/experiment.jzip}"

# 1. Run tests
echo "Running tests..."
node "$SCRIPT_DIR/scripts/run_tests.js"

# 2. Sync experiment + materials to JATOS study assets
ASSETS="$JATOS_DIR/study_assets_root/$STUDY_UUID"
echo "Syncing to $ASSETS..."
rsync -a --delete "$SCRIPT_DIR/experiment/" "$ASSETS/experiment/"
rsync -a --delete "$SCRIPT_DIR/materials/" "$ASSETS/materials/"

# 3. Read token
if [ -n "${JATOS_API_TOKEN:-}" ]; then
  TOKEN="$JATOS_API_TOKEN"
elif [ -f "$SCRIPT_DIR/.token" ]; then
  TOKEN="$(cat "$SCRIPT_DIR/.token")"
else
  echo "Error: Set JATOS_API_TOKEN or create $SCRIPT_DIR/.token" >&2
  exit 1
fi

# 4. Export jzip
curl -sf -H "Authorization: Bearer $TOKEN" \
  "$JATOS_URL/jatos/api/v1/studies/$STUDY_UUID" \
  -o "$OUTPUT"

echo "Exported to $OUTPUT ($(du -h "$OUTPUT" | cut -f1))"
