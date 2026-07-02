import { Router } from 'express';
import { bulkImportVoters } from '../controllers/importController.js';
import { authenticate, authorize, asyncHandler } from '../middleware/index.js';

const router = Router();

// Protected routes - Election Admin only
router.post(
  '/voters',
  asyncHandler(authenticate),
  asyncHandler(authorize(['ELECTION_ADMIN', 'SUPER_ADMIN'])),
  asyncHandler(bulkImportVoters)
);

export default router;
