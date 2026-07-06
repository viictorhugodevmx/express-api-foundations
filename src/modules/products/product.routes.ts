import { Router } from 'express';

import { getProductById, getProducts } from './product.service';

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
