import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { productRoutes } from './modules/products/product.routes';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    app: 'express-api-foundations',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/products', productRoutes);
