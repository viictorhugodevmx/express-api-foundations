import { products } from './product.data';
import type { CreateProductInput, Product } from './product.types';

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

export function createProduct(input: CreateProductInput): Product {
  const normalizedName = input.name.trim();
  const normalizedCategory = input.category.trim().toLowerCase();

  if (!normalizedName) {
    throw new Error('Product name is required');
  }

  if (!normalizedCategory) {
    throw new Error('Product category is required');
  }

  if (!Number.isFinite(input.price) || input.price <= 0) {
    throw new Error('Product price must be greater than 0');
  }

  if (!Number.isInteger(input.stock) || input.stock < 0) {
    throw new Error('Product stock must be 0 or greater');
  }

  const product: Product = {
    id: crypto.randomUUID(),
    name: normalizedName,
    category: normalizedCategory,
    price: input.price,
    stock: input.stock,
    active: true,
    createdAt: new Date().toISOString()
  };

  products.push(product);

  return product;
}
