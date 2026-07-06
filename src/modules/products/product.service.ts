import { products } from './product.data';
import type { Product } from './product.types';

interface GetProductsFilters {
  category?: string;
  active?: boolean;
}

export function getProducts(filters: GetProductsFilters = {}): Product[] {
  let filteredProducts = [...products];

  if (filters.category) {
    const normalizedCategory = filters.category.trim().toLowerCase();

    filteredProducts = filteredProducts.filter((product) => {
      return product.category.toLowerCase() === normalizedCategory;
    });
  }

  if (typeof filters.active === 'boolean') {
    filteredProducts = filteredProducts.filter((product) => {
      return product.active === filters.active;
    });
  }

  return filteredProducts;
}

export function getProductById(id: string): Product | null {
  const product = products.find((currentProduct) => currentProduct.id === id);

  return product ?? null;
}
