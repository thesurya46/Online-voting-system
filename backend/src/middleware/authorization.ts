import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../utils/errors.js';
import { prisma } from '../config/database.js';

export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      throw new AuthorizationError('User not authenticated');
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { role: true }
      });

      if (!user || !user.role) {
        throw new AuthorizationError('User role not found');
      }

      if (!allowedRoles.includes(user.role.name)) {
        throw new AuthorizationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw new AuthorizationError('Authorization failed');
    }
  };
};
