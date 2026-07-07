import { AppError } from '../../shared/errors/app-error';
import { products } from './product.data';
import type { CreateProductInput, Product, UpdateProductInput } from './product.types';

type ProductSortField = 'name' | 'category' | 'price' | 'stock' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface GetProductsFilters {
  category?: string;
  active?: boolean;
}

interface GetProductsOptions extends GetProductsFilters {
  page: number;
  limit: number;
  sortBy: ProductSortField;
  direction: SortDirection;
}

interface PaginatedProducts {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  sortBy: ProductSortField;
  direction: SortDirection;
  items: Product[];
}

interface CategorySummary {
  category: string;
  totalProducts: number;
  totalStock: number;
}

interface ProductStatsSummary {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalStock: number;
  totalInventoryValue: number;
  categories: CategorySummary[];
}

function applyProductFilters(productList: Product[], filters: GetProductsFilters): Product[] {
  let filteredProducts = [...productList];

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

function sortProductList(
  productList: Product[],
  sortBy: ProductSortField,
  direction: SortDirection
): Product[] {
  return [...productList].sort((firstProduct, secondProduct) => {
    const firstValue = firstProduct[sortBy];
    const secondValue = secondProduct[sortBy];

    if (typeof firstValue === 'number' && typeof secondValue === 'number') {
      const result = firstValue - secondValue;

      return direction === 'asc' ? result : result * -1;
    }

    const result = String(firstValue).localeCompare(String(secondValue));

    return direction === 'asc' ? result : result * -1;
  });
}

export function getProducts(options: GetProductsOptions): PaginatedProducts {
  const filteredProducts = applyProductFilters(products, {
    category: options.category,
    active: options.active
  });

  const sortedProducts = sortProductList(
    filteredProducts,
    options.sortBy,
    options.direction
  );

  const total = sortedProducts.length;
  const totalPages = Math.ceil(total / options.limit);
  const startIndex = (options.page - 1) * options.limit;
  const endIndex = startIndex + options.limit;
  const items = sortedProducts.slice(startIndex, endIndex);

  return {
    total,
    page: options.page,
    limit: options.limit,
    totalPages,
    hasNextPage: options.page < totalPages,
    hasPreviousPage: options.page > 1,
    sortBy: options.sortBy,
    direction: options.direction,
    items
  };
}

export function getProductsStatsSummary(): ProductStatsSummary {
  const categoryMap = new Map<string, CategorySummary>();

  let activeProducts = 0;
  let inactiveProducts = 0;
  let totalStock = 0;
  let totalInventoryValue = 0;

  for (const product of products) {
    if (product.active) {
      activeProducts += 1;
    } else {
      inactiveProducts += 1;
    }

    totalStock += product.stock;
    totalInventoryValue += product.price * product.stock;

    const currentCategory = categoryMap.get(product.category) ?? {
      category: product.category,
      totalProducts: 0,
      totalStock: 0
    };

    currentCategory.totalProducts += 1;
    currentCategory.totalStock += product.stock;

    categoryMap.set(product.category, currentCategory);
  }

  return {
    totalProducts: products.length,
    activeProducts,
    inactiveProducts,
    totalStock,
    totalInventoryValue,
    categories: Array.from(categoryMap.values())
  };
}

export function getProductById(id: string): Product {
  const product = products.find((currentProduct) => currentProduct.id === id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
}

export function createProduct(input: CreateProductInput): Product {
  const normalizedName = input.name.trim();
  const normalizedCategory = input.category.trim().toLowerCase();

  if (!normalizedName) {
    throw new AppError('Product name is required', 400);
  }

  if (!normalizedCategory) {
    throw new AppError('Product category is required', 400);
  }

  if (!Number.isFinite(input.price) || input.price <= 0) {
    throw new AppError('Product price must be greater than 0', 400);
  }

  if (!Number.isInteger(input.stock) || input.stock < 0) {
    throw new AppError('Product stock must be 0 or greater');
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

export function updateProductById(id: string, input: UpdateProductInput): Product {
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    throw new AppError('Product not found', 404);
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
    throw new AppError('Product name is required', 400);
  }

  if (!nextCategory) {
    throw new AppError('Product category is required', 400);
  }

  if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
    throw new AppError('Product price must be greater than 0', 400);
  }

  if (!Number.isInteger(nextStock) || nextStock < 0) {
    throw new AppError('Product stock must be 0 or greater', 400);
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

export function deleteProductById(id: string): Product {
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    throw new AppError('Product not found', 404);
  }

  const [deletedProduct] = products.splice(productIndex, 1);

  return deletedProduct;
}
