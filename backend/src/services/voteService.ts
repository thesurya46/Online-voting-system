import { prisma } from '../config/database.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export class VoteService {
  async castVote(
    voterId: string,
    electionId: string,
    positionId: string,
    candidateId: string
  ) {
    // Check if voter exists in election
    const voter = await prisma.voter.findUnique({
      where: {
        userId_electionId: {
          userId: voterId,
          electionId
        }
      }
    });

    if (!voter) {
      throw new NotFoundError('Voter');
    }

    // Check if voter has already voted for this position
    const existingVote = await prisma.vote.findFirst({
      where: {
        voterId: voter.id,
        electionId,
        positionId
      }
    });

    if (existingVote) {
      throw new ValidationError('You have already voted for this position');
    }

    // Verify candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      throw new NotFoundError('Candidate');
    }

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        voterId: voter.id,
        electionId,
        candidateId,
        positionId,
        encryptedVote: `${candidateId}_encrypted` // In production, use real encryption
      }
    });

    // Update voter if all votes cast
    const totalPositions = await prisma.position.count({
      where: { electionId }
    });

    const votesCount = await prisma.vote.count({
      where: {
        voterId: voter.id,
        electionId
      }
    });

    if (votesCount === totalPositions) {
      await prisma.voter.update({
        where: { id: voter.id },
        data: {
          hasVoted: true,
          votedAt: new Date()
        }
      });
    }

    return vote;
  }

  async getVoteResults(electionId: string, positionId: string) {
    const candidates = await prisma.candidate.findMany({
      where: { positionId },
      include: {
        votes: {
          where: {
            electionId
          }
        }
      }
    });

    return candidates.map((candidate) => ({
      candidateId: candidate.id,
      candidateName: candidate.name,
      voteCount: candidate.votes.length,
      percentage: 0 // Calculate percentage on frontend
    }));
  }

  async getElectionResults(electionId: string) {
    const positions = await prisma.position.findMany({
      where: { electionId },
      include: {
        candidates: {
          include: {
            votes: {
              where: { electionId }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return positions.map((position) => ({
      positionId: position.id,
      positionTitle: position.title,
      candidates: position.candidates.map((candidate) => ({
        candidateId: candidate.id,
        candidateName: candidate.name,
        voteCount: candidate.votes.length
      }))
    }));
  }
}

export const voteService = new VoteService();
