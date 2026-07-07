import { Router } from 'express';

import { asyncHandler } from '../../shared/utils/async-handler';
import {
  createProductController,
  deleteProductByIdController,
  getProductByIdController,
  getProductsStatsSummaryController,
  listProductsController,
  updateProductByIdController
} from './product.controller';

export const productRoutes = Router();

productRoutes.get('/', asyncHandler(listProductsController));

productRoutes.post('/', asyncHandler(createProductController));

productRoutes.get('/stats/summary', asyncHandler(getProductsStatsSummaryController));

productRoutes.get('/:id', asyncHandler(getProductByIdController));

productRoutes.patch('/:id', asyncHandler(updateProductByIdController));

productRoutes.delete('/:id', asyncHandler(deleteProductByIdController));
