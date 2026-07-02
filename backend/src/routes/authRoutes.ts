import { Router } from 'express';
import { register, login, refreshToken, logout, getCurrentUser } from '../controllers/index.js';
import { authenticate, asyncHandler } from '../middleware/index.js';

const router = Router();

// Public routes
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/refresh', asyncHandler(refreshToken));

// Protected routes
router.post('/logout', asyncHandler(authenticate), asyncHandler(logout));
router.get('/me', asyncHandler(authenticate), asyncHandler(getCurrentUser));

export default router;
