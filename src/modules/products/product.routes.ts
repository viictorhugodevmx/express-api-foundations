import { Router } from 'express';

import { createProduct, getProductById, getProducts } from './product.service';
import type { CreateProductInput } from './product.types';

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
