import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/index.js';
import { analyticsService } from '../services/analyticsService.js';
import { reportService } from '../services/reportService.js';
import { sendSuccess } from '../utils/response.js';
import { ValidationError } from '../utils/errors.js';

export const getElectionStats = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.params;

  const stats = await analyticsService.getElectionStats(electionId);
  sendSuccess(res, 200, 'Election statistics retrieved', stats);
});

export const getSystemStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await analyticsService.getSystemStats();
  sendSuccess(res, 200, 'System statistics retrieved', stats);
});

export const getUserActivityLog = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ValidationError('User not authenticated');
  }

  const limit = parseInt(req.query.limit as string) || 50;
  const logs = await analyticsService.getUserActivityLog(req.user.userId, limit);
  sendSuccess(res, 200, 'User activity log retrieved', logs);
});

export const getElectionReport = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.params;

  const report = await reportService.generateElectionReport(electionId);
  sendSuccess(res, 200, 'Election report generated', report);
});

export const exportReportAsPDF = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.params;

  const report = await reportService.exportReportAsPDF(electionId);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="election-report-${electionId}.pdf"`);
  sendSuccess(res, 200, 'PDF report ready', report);
});

export const exportReportAsCSV = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.params;

  const report = await reportService.exportReportAsCSV(electionId);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="election-report-${electionId}.csv"`);
  sendSuccess(res, 200, 'CSV report ready', report);
});
