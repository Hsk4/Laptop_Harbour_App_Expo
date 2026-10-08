import { DBClient } from '../database/client';
import { CartLine, Order } from '../types/domain';

interface OrderRow {
  id: string;
  user_id: number;
  total: number;
  address: string;
  payment_method: Order['paymentMethod'];
  created_at: string;
}

interface OrderItemRow {
  order_id: string;
  product_id: string;
  quantity: number;
  price_each: number;
  name: string;
  description: string;
  category: CartLine['product']['category'];
  brand: string;
  image_url: string;
}

export class OrderRepository {
  constructor(private readonly db: DBClient) {}

  async createOrder(input: {
    id: string;
    userId: number;
    total: number;
    address: string;
    paymentMethod: Order['paymentMethod'];
    items: CartLine[];
  }): Promise<void> {
    const now = new Date().toISOString();
    await this.db.run(
      'INSERT INTO orders (id, user_id, total, address, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?);',
      [input.id, input.userId, input.total, input.address, input.paymentMethod, now],
    );

    for (const line of input.items) {
      await this.db.run(
        'INSERT INTO order_items (order_id, product_id, quantity, price_each) VALUES (?, ?, ?, ?);',
        [input.id, line.productId, line.quantity, line.product.price],
      );
    }
  }

  async listByUser(userId: number): Promise<Order[]> {
    const orders = await this.db.all<OrderRow>('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC;', [userId]);
    if (!orders.length) return [];

    const result: Order[] = [];
    for (const order of orders) {
      const items = await this.db.all<OrderItemRow>(
        `SELECT oi.order_id, oi.product_id, oi.quantity, oi.price_each, p.name, p.description, p.category, p.brand, p.image_url
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?;`,
        [order.id],
      );

      result.push({
        id: order.id,
        userId: order.user_id,
        total: order.total,
        address: order.address,
        paymentMethod: order.payment_method,
        createdAt: order.created_at,
        items: items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          product: {
            id: item.product_id,
            name: item.name,
            description: item.description,
            category: item.category,
            brand: item.brand,
            imageUrl: item.image_url,
            price: item.price_each,
          },
        })),
      });
    }

    return result;
  }
}
