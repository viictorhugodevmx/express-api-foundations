import type { RequestHandler } from 'express';

export const notFoundMiddleware: RequestHandler = (request, response) => {
  response.status(404).json({
    message: 'Route not found',
    path: request.originalUrl
  });
};
