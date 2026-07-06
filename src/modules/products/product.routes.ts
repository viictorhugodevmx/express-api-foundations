import { Router } from 'express';

import { AppError } from '../../shared/errors/app-error';
import { asyncHandler } from '../../shared/utils/async-handler';
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById
} from './product.service';
import type { CreateProductInput, UpdateProductInput } from './product.types';

export const productRoutes = Router();

function parseActiveQuery(value: unknown): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new AppError('Invalid active filter. Use true or false', 400);
}

function getIdParam(value: unknown): string {
  if (typeof value !== 'string') {
    throw new AppError('Product id must be a string', 400);
  }

  return value;
}

function parseCreateProductInput(body: unknown): CreateProductInput {
  if (!body || typeof body !== 'object') {
    throw new AppError('Request body is required', 400);
  }

  const candidate = body as Record<string, unknown>;

  if (typeof candidate.name !== 'string') {
    throw new AppError('Product name must be a string', 400);
  }

  if (typeof candidate.category !== 'string') {
    throw new AppError('Product category must be a string', 400);
  }

  if (typeof candidate.price !== 'number') {
    throw new AppError('Product price must be a number', 400);
  }

  if (typeof candidate.stock !== 'number') {
    throw new AppError('Product stock must be a number', 400);
  }

  return {
    name: candidate.name,
    category: candidate.category,
    price: candidate.price,
    stock: candidate.stock
  };
}

function parseUpdateProductInput(body: unknown): UpdateProductInput {
  if (!body || typeof body !== 'object') {
    throw new AppError('Request body is required', 400);
  }

  const candidate = body as Record<string, unknown>;
  const input: UpdateProductInput = {};

  if (candidate.name !== undefined) {
    if (typeof candidate.name !== 'string') {
      throw new AppError('Product name must be a string', 400);
    }

    input.name = candidate.name;
  }

  if (candidate.category !== undefined) {
    if (typeof candidate.category !== 'string') {
      throw new AppError('Product category must be a string', 400);
    }

    input.category = candidate.category;
  }

  if (candidate.price !== undefined) {
    if (typeof candidate.price !== 'number') {
      throw new AppError('Product price must be a number', 400);
    }

    input.price = candidate.price;
  }

  if (candidate.stock !== undefined) {
    if (typeof candidate.stock !== 'number') {
      throw new AppError('Product stock must be a number', 400);
    }

    input.stock = candidate.stock;
  }

  if (candidate.active !== undefined) {
    if (typeof candidate.active !== 'boolean') {
      throw new AppError('Product active must be a boolean', 400);
    }

    input.active = candidate.active;
  }

  if (Object.keys(input).length === 0) {
    throw new AppError('At least one field is required', 400);
  }

  return input;
}

productRoutes.get('/', asyncHandler((request, response) => {
  const category = typeof request.query.category === 'string'
    ? request.query.category
    : undefined;

  const active = parseActiveQuery(request.query.active);

  const products = getProducts({
    category,
    active
  });

  response.status(200).json({
    total: products.length,
    filters: {
      category: category ?? null,
      active: active ?? null
    },
    items: products
  });
}));

productRoutes.post('/', asyncHandler((request, response) => {
  const input = parseCreateProductInput(request.body);
  const product = createProduct(input);

  response.status(201).json(product);
}));

productRoutes.get('/:id', asyncHandler((request, response) => {
  const id = getIdParam(request.params.id);
  const product = getProductById(id);

  response.status(200).json(product);
}));

productRoutes.patch('/:id', asyncHandler((request, response) => {
  const id = getIdParam(request.params.id);
  const input = parseUpdateProductInput(request.body);
  const product = updateProductById(id, input);

  response.status(200).json(product);
}));

productRoutes.delete('/:id', asyncHandler((request, response) => {
  const id = getIdParam(request.params.id);
  const product = deleteProductById(id);

  response.status(200).json({
    message: 'Product deleted successfully',
    product
  });
}));
