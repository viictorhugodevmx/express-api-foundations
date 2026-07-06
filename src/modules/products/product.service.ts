import { products } from './product.data';
import type { CreateProductInput, Product, UpdateProductInput } from './product.types';

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

export function updateProductById(id: string, input: UpdateProductInput): Product | null {
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return null;
  }

  const currentProduct = products[productIndex];

  const nextName = input.name !== undefined
    ? input.name.trim()
    : currentProduct.name;

  const nextCategory = input.category !== undefined
    ? input.category.trim().toLowerCase()
    : currentProduct.category;

  const nextPrice = input.price !== undefined
    ? input.price
    : currentProduct.price;

  const nextStock = input.stock !== undefined
    ? input.stock
    : currentProduct.stock;

  const nextActive = input.active !== undefined
    ? input.active
    : currentProduct.active;

  if (!nextName) {
    throw new Error('Product name is required');
  }

  if (!nextCategory) {
    throw new Error('Product category is required');
  }

  if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
    throw new Error('Product price must be greater than 0');
  }

  if (!Number.isInteger(nextStock) || nextStock < 0) {
    throw new Error('Product stock must be 0 or greater');
  }

  const updatedProduct: Product = {
    ...currentProduct,
    name: nextName,
    category: nextCategory,
    price: nextPrice,
    stock: nextStock,
    active: nextActive,
    updatedAt: new Date().toISOString()
  };

  products[productIndex] = updatedProduct;

  return updatedProduct;
}

export function deleteProductById(id: string): Product | null {
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return null;
  }

  const [deletedProduct] = products.splice(productIndex, 1);

  return deletedProduct;
}
