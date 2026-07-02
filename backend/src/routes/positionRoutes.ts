import { Router } from 'express';
import {
  createPosition,
  getPosition,
  updatePosition,
  deletePosition,
  listPositionsByElection
} from '../controllers/index.js';
import { authenticate, authorize, asyncHandler } from '../middleware/index.js';

const router = Router();

// Public routes
router.get('/election/:electionId', asyncHandler(listPositionsByElection));
router.get('/:id', asyncHandler(getPosition));

// Protected routes - Election Admin only
router.post(
  '/',
  asyncHandler(authenticate),
  asyncHandler(authorize(['ELECTION_ADMIN', 'SUPER_ADMIN'])),
  asyncHandler(createPosition)
);

router.put(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(['ELECTION_ADMIN', 'SUPER_ADMIN'])),
  asyncHandler(updatePosition)
);

router.delete(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(['ELECTION_ADMIN', 'SUPER_ADMIN'])),
  asyncHandler(deletePosition)
);

export default router;
