import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProducts } from '../src/utils/catalog';
import { seedProducts } from '../src/data/seedProducts';

test('filterProducts applies query, category, and brand filters', () => {
  const result = filterProducts(seedProducts, {
    query: 'macbook',
    category: 'MacBooks',
    brand: 'Apple',
  });

  assert.ok(result.length > 0);
  assert.ok(result.every((item) => item.category === 'MacBooks'));
  assert.ok(result.every((item) => item.brand === 'Apple'));
  assert.ok(result.every((item) => item.name.toLowerCase().includes('macbook')));
});
