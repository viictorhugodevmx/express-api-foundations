import type { Request, Response } from 'express';

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
import {
  parseActiveQuery,
  parseCreateProductInput,
  parseDirectionQuery,
  parseSortByQuery,
  parseUpdateProductInput
} from './product.validators';

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
