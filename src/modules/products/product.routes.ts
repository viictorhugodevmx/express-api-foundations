import { Router } from 'express';

import { products } from './product.data';

export const productRoutes = Router();

productRoutes.get('/', (_request, response) => {
  response.status(200).json({
    total: products.length,
    items: products
  });
});

productRoutes.get('/:id', (request, response) => {
  const { id } = request.params;

  const product = products.find((currentProduct) => currentProduct.id === id);

  if (!product) {
    response.status(404).json({
      message: 'Product not found'
    });
    return;
  }

  response.status(200).json(product);
});
