import { DBClient } from '../database/client';

export class FavoriteRepository {
  constructor(private readonly db: DBClient) {}

  async listIds(userId: number): Promise<string[]> {
    const rows = await this.db.all<{ product_id: string }>('SELECT product_id FROM favorites WHERE user_id = ?;', [userId]);
    return rows.map((r) => r.product_id);
  }

  async toggle(userId: number, productId: string): Promise<void> {
    const existing = await this.db.first<{ product_id: string }>(
      'SELECT product_id FROM favorites WHERE user_id = ? AND product_id = ?;',
      [userId, productId],
    );

    if (existing) {
      await this.db.run('DELETE FROM favorites WHERE user_id = ? AND product_id = ?;', [userId, productId]);
      return;
    }

    await this.db.run('INSERT INTO favorites (user_id, product_id) VALUES (?, ?);', [userId, productId]);
  }
}
