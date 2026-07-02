import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

export class AnalyticsService {
  async trackVoteEvent(electionId: string, voterId: string, candidateId: string) {
    try {
      logger.info('Vote tracked', { electionId, voterId, candidateId });
      // Log to analytics service (Google Analytics, Mixpanel, etc.)
      // TODO: Implement analytics tracking
    } catch (error) {
      logger.error('Failed to track vote event', error);
    }
  }

  async getElectionStats(electionId: string) {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        voters: true,
        votes: true,
        positions: {
          include: {
            candidates: {
              include: { votes: true }
            }
          }
        }
      }
    });

    if (!election) return null;

    const totalVoters = election.voters.length;
    const totalVotes = election.votes.length;
    const voterTurnout = totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0;

    return {
      electionId,
      electionTitle: election.title,
      totalVoters,
      totalVotes,
      voterTurnout,
      positions: election.positions.map((position) => ({
        positionId: position.id,
        positionTitle: position.title,
        candidates: position.candidates.map((candidate) => ({
          candidateId: candidate.id,
          candidateName: candidate.name,
          votes: candidate.votes.length,
          percentage: totalVotes > 0 ? (candidate.votes.length / totalVotes) * 100 : 0
        }))
      }))
    };
  }

  async getUserActivityLog(userId: string, limit = 50) {
    const logs = await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return logs;
  }

  async getSystemStats() {
    const [totalUsers, totalElections, totalVotes] = await Promise.all([
      prisma.user.count(),
      prisma.election.count(),
      prisma.vote.count()
    ]);

    return {
      totalUsers,
      totalElections,
      totalVotes,
      timestamp: new Date()
    };
  }
}

export const analyticsService = new AnalyticsService();
