import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AuthenticationError } from '../utils/errors.js';
import { JwtPayload, AuthRequest } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthRequest;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

  if (!token) {
    throw new AuthenticationError('No token provided');
  }

  try {
    const decoded = jwt.verify(token, config.jwt_access_secret) as JwtPayload;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roleId: decoded.roleId
    };
    next();
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};
