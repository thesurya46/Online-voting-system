import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/index.js';
import { electionService } from '../services/index.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validate, validatePagination } from '../utils/validation.js';
import { ValidationError } from '../utils/errors.js';
import { z } from 'zod';

const createElectionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date()
});

const updateElectionSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional()
});

export const createElection = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ValidationError('User not authenticated');
  }

  const { title, description, startDate, endDate } = validate(createElectionSchema, req.body);

  const election = await electionService.createElection(
    title,
    description,
    startDate,
    endDate,
    req.user.userId
  );

  sendSuccess(res, 201, 'Election created successfully', election);
});

export const getElection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const election = await electionService.getElection(id);
  sendSuccess(res, 200, 'Election retrieved', election);
});

export const updateElection = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ValidationError('User not authenticated');
  }

  const { id } = req.params;
  const data = validate(updateElectionSchema, req.body);

  const election = await electionService.updateElection(id, req.user.userId, data);
  sendSuccess(res, 200, 'Election updated successfully', election);
});

export const deleteElection = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ValidationError('User not authenticated');
  }

  const { id } = req.params;
  await electionService.deleteElection(id, req.user.userId);
  sendSuccess(res, 200, 'Election deleted successfully');
});

export const listElections = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = validate(validatePagination, req.query);
  const adminId = req.query.adminId as string | undefined;

  const result = await electionService.listElections(adminId, page, limit);
  sendSuccess(res, 200, 'Elections retrieved', result);
});
