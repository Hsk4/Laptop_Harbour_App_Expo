import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartTotal } from '../src/utils/cart';
import { seedProducts } from '../src/data/seedProducts';

test('calculateCartTotal computes expected total', () => {
  const lines = [
    { productId: 'l1', quantity: 2, product: seedProducts[0] },
    { productId: 'l2', quantity: 1, product: seedProducts[1] },
  ];

  const total = calculateCartTotal(lines);
  assert.equal(total, seedProducts[0].price * 2 + seedProducts[1].price);
});
