# Test Projects

Test projects to verify the library can be imported in different environments.

## Running Tests

Run all tests:
```bash
./run-all-tests.sh
```

Or run individual tests:

### CommonJS
```bash
cd cjs
npm install
node test.js
```

### ES Modules
```bash
cd esm
npm install
node test.js
```

### TypeScript
```bash
cd typescript
npm install
npx tsc
node dist/test.js
```

### Webpack
```bash
cd webpack
npm install
npm run build
node dist/bundle.js
```

## Test Structure

- `cjs/` - CommonJS (require) import test
- `esm/` - ES Module (import) test
- `typescript/` - TypeScript with type checking
- `webpack/` - Webpack bundler test
