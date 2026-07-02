import { Router } from 'express';
import { castVote, getVoteResults, getElectionResults } from '../controllers/index.js';
import { authenticate, asyncHandler } from '../middleware/index.js';

const router = Router();

// Protected routes
router.post('/', asyncHandler(authenticate), asyncHandler(castVote));

// Public routes
router.get('/election/:electionId/results', asyncHandler(getElectionResults));
router.get('/:electionId/position/:positionId', asyncHandler(getVoteResults));

export default router;
