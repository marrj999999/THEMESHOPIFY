#!/usr/bin/env bash
set -euo pipefail

: "${BASE_URL:?Set BASE_URL to your Shopify preview URL (from shopify theme dev)}"

echo "Running Theme Check..."
shopify theme check || true

echo ""
echo "Running Playwright..."
npx playwright test
