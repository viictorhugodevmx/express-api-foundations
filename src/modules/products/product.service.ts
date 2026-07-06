import { products } from './product.data';
import type { Product } from './product.types';

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | null {
  const product = products.find((currentProduct) => currentProduct.id === id);

  return product ?? null;
}
