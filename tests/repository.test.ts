import test from 'node:test';
import assert from 'node:assert/strict';
import type { DBClient } from '../src/database/client';
import { ProductRepository } from '../src/repositories/productRepository';

class FakeDb implements DBClient {
  constructor(private readonly products: Array<any>) {}

  async run(): Promise<void> {}

  async first<T>(sql: string, params: any[] = []): Promise<T | null> {
    if (sql.includes('WHERE id = ?')) {
      const row = this.products.find((p) => p.id === params[0]);
      return (row as T) ?? null;
    }
    return null;
  }

  async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (sql.includes('SELECT DISTINCT brand')) {
      const unique = [...new Set(this.products.map((p) => p.brand))].sort();
      return unique.map((brand) => ({ brand })) as T[];
    }

    if (sql.includes('LOWER(name) LIKE')) {
      const q = String(params[0]).replace(/%/g, '').toLowerCase();
      return this.products.filter((p) => p.name.toLowerCase().includes(q)) as T[];
    }

    return this.products as T[];
  }
}

test('ProductRepository returns product and brands from db client', async () => {
  const fakeRows = [
    { id: 'p1', name: 'Alpha', description: 'desc', category: 'Gaming', brand: 'Acer', image_url: 'x', price: 1000 },
    { id: 'p2', name: 'Beta', description: 'desc', category: 'Office', brand: 'Dell', image_url: 'x', price: 900 },
  ];

  const repo = new ProductRepository(new FakeDb(fakeRows));
  const one = await repo.getById('p1');
  assert.equal(one?.id, 'p1');

  const brands = await repo.listBrands();
  assert.deepEqual(brands, ['Acer', 'Dell']);

  const filtered = await repo.list({ query: 'alp' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'p1');
});
