# Architecture Overview

## Stack
- Expo + React Native + TypeScript
- SQLite local database via `expo-sqlite`
- Feature/data separation with repository layer

## Structure
- `src/app`: App context/state orchestration
- `src/database`: migrations, client, seed
- `src/repositories`: auth/product/favorites/cart/order data access
- `src/data`: migrated seed product domain data
- `src/utils`: business logic helpers
- `tests`: business logic + repository tests

## Flow
1. App boot initializes SQLite and runs schema migrations.
2. Product seed data is inserted if the catalog is empty.
3. Repositories provide all data operations.
4. `AppContext` coordinates auth/session and feature state.
5. UI screens consume context for functional e-commerce flows.
