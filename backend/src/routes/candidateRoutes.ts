import { Router } from 'express';
import {
  createCandidate,
  getCandidate,
  updateCandidate,
  deleteCandidate,
  listCandidatesByPosition
} from '../controllers/index.js';
import { authenticate, authorize, asyncHandler } from '../middleware/index.js';

const router = Router();

// Public routes
router.get('/position/:positionId', asyncHandler(listCandidatesByPosition));
router.get('/:id', asyncHandler(getCandidate));

// Protected routes - Election Admin only
router.post(
  '/',
  asyncHandler(authenticate),
  asyncHandler(authorize(['ELECTION_ADMIN', 'SUPER_ADMIN'])),
  asyncHandler(createCandidate)
);

router.put(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(['ELECTION_ADMIN', 'SUPER_ADMIN'])),
  asyncHandler(updateCandidate)
);

router.delete(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(['ELECTION_ADMIN', 'SUPER_ADMIN'])),
  asyncHandler(deleteCandidate)
);

export default router;
