import type { Request, Response } from 'express';

import { AppError } from '../../shared/errors/app-error';
import {
  parsePositiveIntegerQuery,
  parseStringParam
} from '../../shared/http/request-parsers';
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  getProductsStatsSummary,
  updateProductById
} from './product.service';
import type { CreateProductInput, UpdateProductInput } from './product.types';

type ProductSortField = 'name' | 'category' | 'price' | 'stock' | 'createdAt';
type SortDirection = 'asc' | 'desc';

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

function parseSortByQuery(value: unknown): ProductSortField {
  if (value === undefined) {
    return 'createdAt';
  }

  if (typeof value !== 'string') {
    throw new AppError('sortBy must be a string', 400);
  }

  const allowedFields: ProductSortField[] = [
    'name',
    'category',
    'price',
    'stock',
    'createdAt'
  ];

  if (!allowedFields.includes(value as ProductSortField)) {
    throw new AppError('Invalid sortBy. Use: name, category, price, stock or createdAt', 400);
  }

  return value as ProductSortField;
}

function parseDirectionQuery(value: unknown): SortDirection {
  if (value === undefined) {
    return 'asc';
  }

  if (value === 'asc') {
    return 'asc';
  }

  if (value === 'desc') {
    return 'desc';
  }

  throw new AppError('Invalid direction. Use: asc or desc', 400);
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

export function listProductsController(request: Request, response: Response): void {
  const category = typeof request.query.category === 'string'
    ? request.query.category
    : undefined;

  const active = parseActiveQuery(request.query.active);
  const page = parsePositiveIntegerQuery(request.query.page, 'page', 1);
  const limit = parsePositiveIntegerQuery(request.query.limit, 'limit', 10);
  const sortBy = parseSortByQuery(request.query.sortBy);
  const direction = parseDirectionQuery(request.query.direction);

  const result = getProducts({
    category,
    active,
    page,
    limit,
    sortBy,
    direction
  });

  response.status(200).json({
    ...result,
    filters: {
      category: category ?? null,
      active: active ?? null
    }
  });
}

export function createProductController(request: Request, response: Response): void {
  const input = parseCreateProductInput(request.body);
  const product = createProduct(input);

  response.status(201).json(product);
}

export function getProductsStatsSummaryController(_request: Request, response: Response): void {
  const summary = getProductsStatsSummary();

  response.status(200).json(summary);
}

export function getProductByIdController(request: Request, response: Response): void {
  const id = parseStringParam(request.params.id, 'Product id');
  const product = getProductById(id);

  response.status(200).json(product);
}

export function updateProductByIdController(request: Request, response: Response): void {
  const id = parseStringParam(request.params.id, 'Product id');
  const input = parseUpdateProductInput(request.body);
  const product = updateProductById(id, input);

  response.status(200).json(product);
}

export function deleteProductByIdController(request: Request, response: Response): void {
  const id = parseStringParam(request.params.id, 'Product id');
  const product = deleteProductById(id);

  response.status(200).json({
    message: 'Product deleted successfully',
    product
  });
}
