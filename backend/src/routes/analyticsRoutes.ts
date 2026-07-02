import { Router } from 'express';
import {
  getElectionStats,
  getSystemStats,
  getUserActivityLog,
  getElectionReport,
  exportReportAsPDF,
  exportReportAsCSV
} from '../controllers/analyticsController.js';
import { authenticate, authorize, asyncHandler } from '../middleware/index.js';

const router = Router();

// Public routes
router.get('/election/:electionId/stats', asyncHandler(getElectionStats));
router.get('/election/:electionId/report', asyncHandler(getElectionReport));
router.get('/election/:electionId/report/pdf', asyncHandler(exportReportAsPDF));
router.get('/election/:electionId/report/csv', asyncHandler(exportReportAsCSV));

// Protected routes - Admin only
router.get(
  '/system/stats',
  asyncHandler(authenticate),
  asyncHandler(authorize(['SUPER_ADMIN'])),
  asyncHandler(getSystemStats)
);

router.get(
  '/user/activity-log',
  asyncHandler(authenticate),
  asyncHandler(getUserActivityLog)
);

export default router;
