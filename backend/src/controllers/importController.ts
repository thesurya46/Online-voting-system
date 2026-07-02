import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/index.js';
import { bulkImportService } from '../services/bulkImportService.js';
import { sendSuccess } from '../utils/response.js';
import { z } from 'zod';

const bulkImportSchema = z.object({
  electionId: z.string(),
  voters: z.array(
    z.object({
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string()
    })
  )
});

export const bulkImportVoters = asyncHandler(async (req: Request, res: Response) => {
  const { electionId, voters } = bulkImportSchema.parse(req.body);

  const results = await bulkImportService.importVotersFromCSV(electionId, voters);
  sendSuccess(res, 201, 'Bulk import completed', results);
});
