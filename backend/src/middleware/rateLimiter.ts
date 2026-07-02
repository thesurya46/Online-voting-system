import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import { AppError } from '../utils/errors.js';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

const cleanExpiredEntries = (): void => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
};

export const rateLimiter = (req: Request, _res: Response, next: NextFunction): void => {
  cleanExpiredEntries();

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const windowMs = config.rate_limit_window * 60 * 1000;
  const maxRequests = config.rate_limit_max_requests;

  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    next();
    return;
  }

  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + windowMs;
    next();
    return;
  }

  entry.count++;

  if (entry.count > maxRequests) {
    throw new AppError(429, 'Too many requests, please try again later');
  }

  next();
};
