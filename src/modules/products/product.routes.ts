import { Router } from 'express';

import { products } from './product.data';

export const productRoutes = Router();

productRoutes.get('/', (_request, response) => {
  response.status(200).json({
    total: products.length,
    items: products
  });
});
