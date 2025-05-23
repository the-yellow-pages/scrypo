import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../controllers/types.js';

// Handle 404 errors
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.url}`
  });
};

// Handle all other errors
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  
  const errorResponse: ErrorResponse = {
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? [err.message] : undefined
  };
  
  res.status(500).json(errorResponse);
}; 