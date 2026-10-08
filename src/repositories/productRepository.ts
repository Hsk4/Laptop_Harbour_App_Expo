import { DBClient } from '../database/client';
import { CatalogFilters, Product } from '../types/domain';

interface ProductRow {
  id: string;
  name: string;
  description: string;
  category: Product['category'];
  brand: string;
  image_url: string;
  price: number;
}

const mapProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  category: row.category,
  brand: row.brand,
  imageUrl: row.image_url,
  price: row.price,
});

export class ProductRepository {
  constructor(private readonly db: DBClient) {}

  async getById(id: string): Promise<Product | null> {
    const row = await this.db.first<ProductRow>('SELECT * FROM products WHERE id = ?;', [id]);
    return row ? mapProduct(row) : null;
  }

  async list(filters: CatalogFilters): Promise<Product[]> {
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filters.query.trim()) {
      conditions.push('(LOWER(name) LIKE ? OR LOWER(description) LIKE ?)');
      const q = `%${filters.query.toLowerCase()}%`;
      params.push(q, q);
    }

    if (filters.category && filters.category !== 'All') {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.brand && filters.brand !== 'All') {
      conditions.push('brand = ?');
      params.push(filters.brand);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await this.db.all<ProductRow>(`SELECT * FROM products ${where} ORDER BY name ASC;`, params);
    return rows.map(mapProduct);
  }

  async listBrands(): Promise<string[]> {
    const rows = await this.db.all<{ brand: string }>('SELECT DISTINCT brand FROM products ORDER BY brand ASC;');
    return rows.map((r) => r.brand);
  }
}
