import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/index.js';
import { positionService } from '../services/index.js';
import { sendSuccess } from '../utils/response.js';
import { ValidationError } from '../utils/errors.js';
import { z } from 'zod';

const createPositionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  electionId: z.string(),
  description: z.string().optional(),
  order: z.number().default(1),
  maxVotes: z.number().default(1)
});

const updatePositionSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  maxVotes: z.number().optional()
});

export const createPosition = asyncHandler(async (req: Request, res: Response) => {
  const { title, electionId, description, order, maxVotes } = createPositionSchema.parse(
    req.body
  );

  const position = await positionService.createPosition(
    title,
    electionId,
    description,
    order,
    maxVotes
  );

  sendSuccess(res, 201, 'Position created successfully', position);
});

export const getPosition = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const position = await positionService.getPosition(id);
  sendSuccess(res, 200, 'Position retrieved', position);
});

export const updatePosition = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = updatePositionSchema.parse(req.body);

  const position = await positionService.updatePosition(id, data);
  sendSuccess(res, 200, 'Position updated successfully', position);
});

export const deletePosition = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await positionService.deletePosition(id);
  sendSuccess(res, 200, 'Position deleted successfully');
});

export const listPositionsByElection = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.params;
  const positions = await positionService.listPositionsByElection(electionId);
  sendSuccess(res, 200, 'Positions retrieved', positions);
});
