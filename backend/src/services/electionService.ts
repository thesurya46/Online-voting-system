import { prisma } from '../config/database.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors.js';
import { ElectionStatus } from '../types/index.js';

export class ElectionService {
  async createElection(
    title: string,
    description: string | undefined,
    startDate: Date,
    endDate: Date,
    adminId: string
  ) {
    // Validate dates
    if (startDate >= endDate) {
      throw new ValidationError('Start date must be before end date');
    }

    // Create election
    const election = await prisma.election.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        admin: {
          connect: { id: adminId }
        }
      },
      include: {
        positions: true,
        admin: true
      }
    });

    return election;
  }

  async getElection(electionId: string) {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        positions: {
          include: {
            candidates: true
          }
        },
        admin: true
      }
    });

    if (!election) {
      throw new NotFoundError('Election');
    }

    return election;
  }

  async updateElection(
    electionId: string,
    adminId: string,
    data: {
      title?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      status?: ElectionStatus;
    }
  ) {
    const election = await this.getElection(electionId);

    // Verify admin
    if (election.adminId !== adminId) {
      throw new AuthorizationError('You can only edit your own elections');
    }

    // Update election
    const updated = await prisma.election.update({
      where: { id: electionId },
      data
    });

    return updated;
  }

  async deleteElection(electionId: string, adminId: string) {
    const election = await this.getElection(electionId);

    // Verify admin
    if (election.adminId !== adminId) {
      throw new AuthorizationError('You can only delete your own elections');
    }

    await prisma.election.delete({
      where: { id: electionId }
    });
  }

  async listElections(adminId?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where = adminId ? { adminId } : {};

    const [elections, total] = await Promise.all([
      prisma.election.findMany({
        where,
        include: {
          positions: { include: { candidates: true } },
          admin: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.election.count({ where })
    ]);

    return {
      elections,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

export const electionService = new ElectionService();
