import { seedProducts } from '../data/seedProducts';
import { DBClient } from './client';

export const seedDatabase = async (db: DBClient): Promise<void> => {
  const existing = await db.first<{ count: number }>('SELECT COUNT(*) as count FROM products;');
  if ((existing?.count ?? 0) > 0) {
    return;
  }

  for (const p of seedProducts) {
    await db.run(
      `INSERT INTO products (id, name, description, category, brand, image_url, price)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [p.id, p.name, p.description, p.category, p.brand, p.imageUrl, p.price],
    );
  }
};
