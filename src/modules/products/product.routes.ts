import { Router } from 'express';

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

  throw new Error('Invalid active filter. Use true or false');
}

function parseCreateProductInput(body: unknown): CreateProductInput {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body is required');
  }

  const candidate = body as Record<string, unknown>;

  if (typeof candidate.name !== 'string') {
    throw new Error('Product name must be a string');
  }

  if (typeof candidate.category !== 'string') {
    throw new Error('Product category must be a string');
  }

  if (typeof candidate.price !== 'number') {
    throw new Error('Product price must be a number');
  }

  if (typeof candidate.stock !== 'number') {
    throw new Error('Product stock must be a number');
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
    throw new Error('Request body is required');
  }

  const candidate = body as Record<string, unknown>;
  const input: UpdateProductInput = {};

  if (candidate.name !== undefined) {
    if (typeof candidate.name !== 'string') {
      throw new Error('Product name must be a string');
    }

    input.name = candidate.name;
  }

  if (candidate.category !== undefined) {
    if (typeof candidate.category !== 'string') {
      throw new Error('Product category must be a string');
    }

    input.category = candidate.category;
  }

  if (candidate.price !== undefined) {
    if (typeof candidate.price !== 'number') {
      throw new Error('Product price must be a number');
    }

    input.price = candidate.price;
  }

  if (candidate.stock !== undefined) {
    if (typeof candidate.stock !== 'number') {
      throw new Error('Product stock must be a number');
    }

    input.stock = candidate.stock;
  }

  if (candidate.active !== undefined) {
    if (typeof candidate.active !== 'boolean') {
      throw new Error('Product active must be a boolean');
    }

    input.active = candidate.active;
  }

  if (Object.keys(input).length === 0) {
    throw new Error('At least one field is required');
  }

  return input;
}

productRoutes.get('/', (request, response) => {
  try {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected products error';

    response.status(400).json({
      message
    });
  }
});

productRoutes.post('/', (request, response) => {
  try {
    const input = parseCreateProductInput(request.body);
    const product = createProduct(input);

    response.status(201).json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected products error';

    response.status(400).json({
      message
    });
  }
});

productRoutes.get('/:id', (request, response) => {
  const { id } = request.params;
  const product = getProductById(id);

  if (!product) {
    response.status(404).json({
      message: 'Product not found'
    });
    return;
  }

  response.status(200).json(product);
});

productRoutes.patch('/:id', (request, response) => {
  try {
    const { id } = request.params;
    const input = parseUpdateProductInput(request.body);
    const product = updateProductById(id, input);

    if (!product) {
      response.status(404).json({
        message: 'Product not found'
      });
      return;
    }

    response.status(200).json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected products error';

    response.status(400).json({
      message
    });
  }
});

productRoutes.delete('/:id', (request, response) => {
  const { id } = request.params;
  const product = deleteProductById(id);

  if (!product) {
    response.status(404).json({
      message: 'Product not found'
    });
    return;
  }

  response.status(200).json({
    message: 'Product deleted successfully',
    product
  });
});
