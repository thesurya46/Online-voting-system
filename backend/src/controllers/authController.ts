import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/index.js';
import { authService } from '../services/index.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { ValidationError } from '../utils/errors.js';
import { validate, validateEmail, validatePassword } from '../utils/validation.js';
import { z } from 'zod';

const registerSchema = z.object({
  email: validateEmail,
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: validatePassword
});

const loginSchema = z.object({
  email: validateEmail,
  password: z.string().min(1, 'Password is required')
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = validate(registerSchema, req.body);

  const user = await authService.register(email, firstName, lastName, password);
  sendSuccess(res, 201, 'User registered successfully', user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = validate(loginSchema, req.body);

  const result = await authService.login(email, password);

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  sendSuccess(res, 200, 'Login successful', {
    user: result.user,
    accessToken: result.accessToken
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new ValidationError('Refresh token is required');
  }

  const tokens = await authService.refreshToken(refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  sendSuccess(res, 200, 'Token refreshed', {
    accessToken: tokens.accessToken
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ValidationError('User not authenticated');
  }

  await authService.logout(req.user.userId);

  res.clearCookie('refreshToken');
  sendSuccess(res, 200, 'Logout successful');
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ValidationError('User not authenticated');
  }

  sendSuccess(res, 200, 'Current user retrieved', req.user);
});
