import { Request, Response, NextFunction } from 'express';
import { AppError, ServerError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error:', err);

  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  const error = new ServerError(process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message);
  sendError(res, error.statusCode, error.message);
};
