import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

interface RequestLog {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  userId?: string;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userId: (req as any).user?.userId
    };

    if (res.statusCode >= 400) {
      logger.error(`Request failed: ${req.method} ${req.path}`, log);
    } else if (duration > 1000) {
      logger.warn(`Slow request detected: ${req.method} ${req.path}`, log);
    } else {
      logger.info(`${req.method} ${req.path}`, log);
    }
  });

  next();
};
