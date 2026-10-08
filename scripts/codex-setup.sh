#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
node --input-type=module <<'JS'
const [major, minor] = process.versions.node.split('.').map(Number);
if (!((major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major > 22)) {
  console.error('Use Node.js 20.19+ or 22.12+ for this Vite project.');
  process.exit(1);
}
JS
npm ci --no-audit --no-fund
npm run build
