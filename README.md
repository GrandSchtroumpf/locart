# Locart

## Install
```
npm ci
```

Build cloud functions for the first time (required for firebase emulators)
```
npx nx build functions
```

## Serve
On two terminals:
- `npx nx serve`
- `npx firebase emulators:start`

Open http://localhost:4200