import { DBClient } from '../database/client';
import { CartLine } from '../types/domain';

interface CartRow {
  product_id: string;
  quantity: number;
  name: string;
  description: string;
  category: CartLine['product']['category'];
  brand: string;
  image_url: string;
  price: number;
}

const listQuery = `
SELECT c.product_id, c.quantity, p.name, p.description, p.category, p.brand, p.image_url, p.price
FROM cart_items c
JOIN products p ON p.id = c.product_id
WHERE c.user_id = ?
ORDER BY p.name ASC;
`;

export class CartRepository {
  constructor(private readonly db: DBClient) {}

  async list(userId: number): Promise<CartLine[]> {
    const rows = await this.db.all<CartRow>(listQuery, [userId]);
    return rows.map((row) => ({
      productId: row.product_id,
      quantity: row.quantity,
      product: {
        id: row.product_id,
        name: row.name,
        description: row.description,
        category: row.category,
        brand: row.brand,
        imageUrl: row.image_url,
        price: row.price,
      },
    }));
  }

  async add(userId: number, productId: string, quantity: number): Promise<void> {
    await this.db.run(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, product_id)
       DO UPDATE SET quantity = quantity + excluded.quantity;`,
      [userId, productId, quantity],
    );
  }

  async updateQuantity(userId: number, productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.remove(userId, productId);
      return;
    }
    await this.db.run('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?;', [quantity, userId, productId]);
  }

  async remove(userId: number, productId: string): Promise<void> {
    await this.db.run('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?;', [userId, productId]);
  }

  async clear(userId: number): Promise<void> {
    await this.db.run('DELETE FROM cart_items WHERE user_id = ?;', [userId]);
  }
}
