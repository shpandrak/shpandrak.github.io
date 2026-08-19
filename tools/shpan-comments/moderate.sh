#!/bin/bash
# Approve / reject a shpan-comments comment directly in Firestore.
#
# Usage:
#   ./moderate.sh list                      # show everything in moderation
#   ./moderate.sh approve <DOC_PATH>        # set status -> active
#   ./moderate.sh reject  <DOC_PATH>        # set status -> rejected
#
# DOC_PATH looks like: posts/-posts-austria2026-01-בוואריה/comments/XBj3LAH1lj0dDCGMktvS

set -euo pipefail

PROJECT="shpan-comments"
BASE="https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents"
TOKEN="$(gcloud auth print-access-token)"

case "${1:-}" in
  list)
    curl -s -X POST "${BASE}:runQuery" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      -d '{"structuredQuery":{"from":[{"collectionId":"comments","allDescendants":true}]}}' \
    | python3 -c '
import json,sys
for x in json.load(sys.stdin):
    doc = x.get("document")
    if not doc: continue
    f = doc["fields"]
    if f.get("status",{}).get("stringValue") != "moderation": continue
    print(doc["name"].split("/documents/")[1])
    print("   post:", f.get("postPath",{}).get("stringValue"))
    print("   from:", f.get("userDisplayName",{}).get("stringValue"))
    print("   text:", f.get("comment",{}).get("stringValue"))
    print("   time:", f.get("timestamp",{}).get("timestampValue"))
    print()
'
    ;;

  approve|reject)
    [ $# -eq 2 ] || { echo "usage: $0 $1 <DOC_PATH>" >&2; exit 1; }
    NEW_STATUS=$([ "$1" = "approve" ] && echo active || echo rejected)
    # percent-encode the doc path (it contains Hebrew), keeping "/" intact
    ENCODED=$(python3 -c 'import sys,urllib.parse; print(urllib.parse.quote(sys.argv[1], safe="/"))' "$2")
    curl -s -X PATCH \
      "${BASE}/${ENCODED}?updateMask.fieldPaths=status" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{\"fields\":{\"status\":{\"stringValue\":\"${NEW_STATUS}\"}}}" \
    | python3 -c '
import json,sys
d = json.load(sys.stdin)
if "error" in d:
    print("FAILED:", d["error"]["message"]); sys.exit(1)
print("OK ->", d["fields"]["status"]["stringValue"])
'
    ;;

  *)
    echo "usage: $0 {list|approve <DOC_PATH>|reject <DOC_PATH>}" >&2
    exit 1
    ;;
esac
