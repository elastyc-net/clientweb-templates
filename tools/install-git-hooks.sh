#!/usr/bin/env bash
# Instalira repo git hookove u .git/hooks (bez menjanja git config).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/.git/hooks"
for hook in post-commit; do
  src="$ROOT/.githooks/$hook"
  dst="$ROOT/.git/hooks/$hook"
  if [[ ! -f "$src" ]]; then
    echo "missing $src" >&2
    exit 1
  fi
  cp "$src" "$dst"
  chmod +x "$dst"
  echo "installed $dst"
done
