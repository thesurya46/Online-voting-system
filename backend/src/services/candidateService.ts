import { prisma } from '../config/database.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export class CandidateService {
  async createCandidate(
    name: string,
    positionId: string,
    bio?: string,
    photo?: string,
    order: number = 1
  ) {
    // Verify position exists
    const position = await prisma.position.findUnique({
      where: { id: positionId }
    });

    if (!position) {
      throw new NotFoundError('Position');
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        positionId,
        bio,
        photo,
        order
      }
    });

    return candidate;
  }

  async getCandidate(candidateId: string) {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      throw new NotFoundError('Candidate');
    }

    return candidate;
  }

  async updateCandidate(
    candidateId: string,
    data: {
      name?: string;
      bio?: string;
      photo?: string;
      order?: number;
    }
  ) {
    const candidate = await prisma.candidate.update({
      where: { id: candidateId },
      data
    });

    return candidate;
  }

  async deleteCandidate(candidateId: string) {
    await prisma.candidate.delete({
      where: { id: candidateId }
    });
  }

  async listCandidatesByPosition(positionId: string) {
    const candidates = await prisma.candidate.findMany({
      where: { positionId },
      orderBy: { order: 'asc' }
    });

    return candidates;
  }
}

export const candidateService = new CandidateService();
