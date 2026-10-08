export type Category = 'Gaming' | 'MacBooks' | 'Chromebooks' | 'Office' | 'Workstation';

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  brand: string;
  imageUrl: string;
  price: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartLine extends CartItem {
  product: Product;
}

export interface Order {
  id: string;
  userId: number;
  total: number;
  address: string;
  paymentMethod: 'Cash on Delivery' | 'Credit Card';
  createdAt: string;
  items: CartLine[];
}

export interface CatalogFilters {
  query: string;
  category?: Category | 'All';
  brand?: string | 'All';
}
