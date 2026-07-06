import { Router } from 'express';

import { getProductById, getProducts } from './product.service';

export const productRoutes = Router();

productRoutes.get('/', (_request, response) => {
  const products = getProducts();

  response.status(200).json({
    total: products.length,
    items: products
  });
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
