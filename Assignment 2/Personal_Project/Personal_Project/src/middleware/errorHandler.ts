import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred:', err);

  const error: ApiError = {
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
    statusCode: 500,
    timestamp: new Date().toISOString(),
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.error = 'Validation Error';
    error.statusCode = 400;
  } else if (err.name === 'NotFoundError') {
    error.error = 'Not Found';
    error.statusCode = 404;
  } else if (err.name === 'DatabaseError') {
    error.error = 'Database Error';
    error.statusCode = 500;
  }

  res.status(error.statusCode).json(error);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const error: ApiError = {
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(error);
}; 