# Laptop Harbour App (Expo + SQLite)

React Native/Expo migration of the Flutter `Laptop_Harbour_App`, preserving the laptop e-commerce domain and key user flows (catalog, product details, favorites, cart, checkout, orders, profile/auth).

## Quick start

```bash
npm install
npm run start
```

## Commands

```bash
npm run start      # Expo dev server
npm run android    # Open Android target
npm run ios        # Open iOS target (macOS needed for simulator)
npm run web        # Run in web target
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run test       # Unit tests
```

## SQLite-only persistence

The app uses **Expo SQLite only** for local persistence:
- users/auth profile
- products catalog (seeded)
- favorites
- cart
- orders/order items

See:
- `docs/architecture.md`
- `docs/sqlite-schema.md`
- `docs/feature-matrix.md`
- `docs/development-workflow.md`
- `docs/coderabbit.md`

## Limitations

- Images are placeholder URLs in this migration baseline.
- Authentication is local to device SQLite (no remote sync).
- Feature branches are documented with commands in `docs/development-workflow.md`.
