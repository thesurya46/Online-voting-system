import { prisma } from '../config/database.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class BulkImportService {
  async importVotersFromCSV(electionId: string, csvData: Array<{ email: string; firstName: string; lastName: string }>) {
    // Verify election exists
    const election = await prisma.election.findUnique({
      where: { id: electionId }
    });

    if (!election) {
      throw new NotFoundError('Election');
    }

    if (csvData.length === 0) {
      throw new ValidationError('CSV data is empty');
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const row of csvData) {
      try {
        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { email: row.email }
        });

        // If not, create new user
        if (!user) {
          const voterRole = await prisma.role.findUnique({
            where: { name: 'VOTER' }
          });

          user = await prisma.user.create({
            data: {
              email: row.email,
              firstName: row.firstName,
              lastName: row.lastName,
              password: 'temp_password_to_be_changed', // User must change password
              roleId: voterRole!.id
            }
          });
        }

        // Add voter to election
        const existingVoter = await prisma.voter.findFirst({
          where: {
            userId: user.id,
            electionId
          }
        });

        if (!existingVoter) {
          await prisma.voter.create({
            data: {
              userId: user.id,
              electionId
            }
          });
        }

        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Row ${row.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        logger.error(`Failed to import voter ${row.email}`, error);
      }
    }

    return results;
  }
}

export const bulkImportService = new BulkImportService();
