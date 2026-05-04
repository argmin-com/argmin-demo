#!/usr/bin/env bash
set -Eeuo pipefail

REPO_OWNER="argmin-com"
REPO_NAME="argmin-demo"
WIKI_REMOTE="https://github.com/${REPO_OWNER}/${REPO_NAME}.wiki.git"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
WIKI_SRC_DIR="${REPO_ROOT}/wiki-src"

fail() {
  echo "Wiki publish failed: $*" >&2
  exit 1
}

on_error() {
  local status=$?
  echo "Wiki publish failed near line ${BASH_LINENO[0]}: ${BASH_COMMAND}" >&2
  exit "${status}"
}
trap on_error ERR

if ! command -v gh >/dev/null 2>&1; then
  fail "gh CLI is required; install GitHub CLI and authenticate with 'gh auth login'."
fi

if ! gh auth status >/dev/null 2>&1; then
  fail "gh auth login is required before publishing wiki."
fi

tmpdir="$(mktemp -d "${TMPDIR:-/tmp}/aci_wiki_publish_XXXXXX")"
cleanup() { rm -rf "$tmpdir"; }
trap cleanup EXIT

if [[ ! -d "$WIKI_SRC_DIR" ]]; then
  fail "wiki-src directory not found at ${WIKI_SRC_DIR}."
fi

if ! git clone "$WIKI_REMOTE" "$tmpdir/wiki" >/dev/null 2>&1; then
  echo "Wiki git repository is not initialized yet." >&2
  echo "Open https://github.com/${REPO_OWNER}/${REPO_NAME}/wiki once, create any page, then rerun this script." >&2
  exit 2
fi

cp -f "$WIKI_SRC_DIR"/*.md "$tmpdir/wiki/"

cd "$tmpdir/wiki"
if git diff --quiet && git diff --cached --quiet; then
  echo "No wiki changes to publish."
  exit 0
fi

git add .
git commit -m "Update wiki content"
git push origin master

echo "Wiki published successfully."
