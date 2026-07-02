import { Router } from 'express';
import {
  createElection,
  getElection,
  updateElection,
  deleteElection,
  listElections
} from '../controllers/index.js';
import { authenticate, authorize, asyncHandler } from '../middleware/index.js';

const router = Router();

// Public routes
router.get('/', asyncHandler(listElections));
router.get('/:id', asyncHandler(getElection));

// Protected routes - Election Admin only
router.post(
  '/',
  asyncHandler(authenticate),
  asyncHandler(authorize(['ELECTION_ADMIN', 'SUPER_ADMIN'])),
  asyncHandler(createElection)
);

router.put(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(['ELECTION_ADMIN', 'SUPER_ADMIN'])),
  asyncHandler(updateElection)
);

router.delete(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(['ELECTION_ADMIN', 'SUPER_ADMIN'])),
  asyncHandler(deleteElection)
);

export default router;
