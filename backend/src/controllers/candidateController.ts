import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/index.js';
import { candidateService } from '../services/index.js';
import { sendSuccess } from '../utils/response.js';
import { ValidationError } from '../utils/errors.js';
import { z } from 'zod';

const createCandidateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  positionId: z.string(),
  bio: z.string().optional(),
  photo: z.string().optional(),
  order: z.number().default(1)
});

const updateCandidateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  photo: z.string().optional(),
  order: z.number().optional()
});

export const createCandidate = asyncHandler(async (req: Request, res: Response) => {
  const { name, positionId, bio, photo, order } = createCandidateSchema.parse(req.body);

  const candidate = await candidateService.createCandidate(
    name,
    positionId,
    bio,
    photo,
    order
  );

  sendSuccess(res, 201, 'Candidate created successfully', candidate);
});

export const getCandidate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const candidate = await candidateService.getCandidate(id);
  sendSuccess(res, 200, 'Candidate retrieved', candidate);
});

export const updateCandidate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updateCandidateSchema.parse(req.body);

  const candidate = await candidateService.updateCandidate(id, data);
  sendSuccess(res, 200, 'Candidate updated successfully', candidate);
});

export const deleteCandidate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await candidateService.deleteCandidate(id);
  sendSuccess(res, 200, 'Candidate deleted successfully');
});

export const listCandidatesByPosition = asyncHandler(async (req: Request, res: Response) => {
  const { positionId } = req.params;
  const candidates = await candidateService.listCandidatesByPosition(positionId);
  sendSuccess(res, 200, 'Candidates retrieved', candidates);
});
