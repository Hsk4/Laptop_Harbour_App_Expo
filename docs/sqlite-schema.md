# SQLite Schema / Data Model

## Tables
- `users(id, email, password_hash, name, created_at)`
- `products(id, name, description, category, brand, image_url, price)`
- `favorites(user_id, product_id)`
- `cart_items(user_id, product_id, quantity)`
- `orders(id, user_id, total, address, payment_method, created_at)`
- `order_items(order_id, product_id, quantity, price_each)`

## Migrations
Defined in `src/database/migrations.ts` and applied at startup from `src/database/client.ts`.

## Seed
`src/database/seed.ts` inserts the migrated laptop catalog from `src/data/seedProducts.ts` only when `products` is empty.

## Notes
- No Firebase/Supabase/remote backend/AsyncStorage is used.
- SQLite is the sole app persistence layer.
