import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/index.js';
import { voteService } from '../services/index.js';
import { sendSuccess } from '../utils/response.js';
import { ValidationError } from '../utils/errors.js';
import { z } from 'zod';

const castVoteSchema = z.object({
  electionId: z.string(),
  positionId: z.string(),
  candidateId: z.string()
});

export const castVote = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ValidationError('User not authenticated');
  }

  const { electionId, positionId, candidateId } = castVoteSchema.parse(req.body);

  const vote = await voteService.castVote(
    req.user.userId,
    electionId,
    positionId,
    candidateId
  );

  sendSuccess(res, 201, 'Vote cast successfully', vote);
});

export const getVoteResults = asyncHandler(async (req: Request, res: Response) => {
  const { electionId, positionId } = req.params;

  const results = await voteService.getVoteResults(electionId, positionId);
  sendSuccess(res, 200, 'Vote results retrieved', results);
});

export const getElectionResults = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.params;

  const results = await voteService.getElectionResults(electionId);
  sendSuccess(res, 200, 'Election results retrieved', results);
});
