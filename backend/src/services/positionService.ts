import { prisma } from '../config/database.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export class PositionService {
  async createPosition(
    title: string,
    electionId: string,
    description?: string,
    order: number = 1,
    maxVotes: number = 1
  ) {
    // Verify election exists
    const election = await prisma.election.findUnique({
      where: { id: electionId }
    });

    if (!election) {
      throw new NotFoundError('Election');
    }

    // Check if position already exists in election
    const existingPosition = await prisma.position.findFirst({
      where: {
        electionId,
        title
      }
    });

    if (existingPosition) {
      throw new ValidationError('Position already exists in this election');
    }

    const position = await prisma.position.create({
      data: {
        title,
        electionId,
        description,
        order,
        maxVotes
      }
    });

    return position;
  }

  async getPosition(positionId: string) {
    const position = await prisma.position.findUnique({
      where: { id: positionId },
      include: { candidates: true }
    });

    if (!position) {
      throw new NotFoundError('Position');
    }

    return position;
  }

  async updatePosition(
    positionId: string,
    data: {
      title?: string;
      description?: string;
      order?: number;
      maxVotes?: number;
    }
  ) {
    const position = await prisma.position.update({
      where: { id: positionId },
      data
    });

    return position;
  }

  async deletePosition(positionId: string) {
    await prisma.position.delete({
      where: { id: positionId }
    });
  }

  async listPositionsByElection(electionId: string) {
    const positions = await prisma.position.findMany({
      where: { electionId },
      include: { candidates: true },
      orderBy: { order: 'asc' }
    });

    return positions;
  }
}

export const positionService = new PositionService();
