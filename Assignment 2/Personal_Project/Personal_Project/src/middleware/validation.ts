import { Request, Response, NextFunction } from 'express';
import { validateSumRequest } from '../utils/validation';
import { logger } from '../utils/logger';

export const validateSumRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const validation = validateSumRequest(req.body);

  if (validation.error) {
    logger.warn('Validation failed:', validation.error);
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      statusCode: 400,
      timestamp: new Date().toISOString(),
      details: validation.error,
    });
    return;
  }

  req.body = validation.value;
  next();
}; 