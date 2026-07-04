import type { Product } from './product.types';

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Mechanical Keyboard',
    category: 'accessories',
    price: 1299,
    stock: 12,
    active: true,
    createdAt: '2026-01-01T10:00:00.000Z'
  },
  {
    id: 'prod_002',
    name: 'USB-C Hub',
    category: 'accessories',
    price: 799,
    stock: 25,
    active: true,
    createdAt: '2026-01-02T10:00:00.000Z'
  },
  {
    id: 'prod_003',
    name: 'Developer Hoodie',
    category: 'clothing',
    price: 599,
    stock: 8,
    active: true,
    createdAt: '2026-01-03T10:00:00.000Z'
  }
];
