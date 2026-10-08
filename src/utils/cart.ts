import { CartLine } from '../types/domain';

export const calculateCartTotal = (items: CartLine[]): number =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
