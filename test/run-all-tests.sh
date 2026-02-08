#!/bin/bash

set -e

echo "=========================================="
echo "Testing scroll-snap-slider Package Exports"
echo "=========================================="
echo ""

cd "$(dirname "$0")"

echo "🧪 Testing CommonJS (CJS)..."
cd cjs
npm install --silent > /dev/null 2>&1
node test.js > output.txt 2>&1
cat output.txt
echo ""

echo "🧪 Testing ES Modules (ESM)..."
cd ../esm
npm install --silent > /dev/null 2>&1
node test.js > output.txt 2>&1
cat output.txt
echo ""

echo "🧪 Testing TypeScript..."
cd ../typescript
npm install --silent > /dev/null 2>&1
npx tsc > /dev/null 2>&1
node dist/test.js > output.txt 2>&1
cat output.txt
echo ""

echo "=========================================="
echo "✅ All tests passed successfully!"
echo "=========================================="
