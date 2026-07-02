import { prisma } from '../config/database.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export class ReportService {
  async generateElectionReport(electionId: string) {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        positions: {
          include: {
            candidates: {
              include: {
                votes: true
              }
            }
          }
        },
        voters: true,
        votes: true
      }
    });

    if (!election) {
      throw new NotFoundError('Election');
    }

    const totalVoters = election.voters.length;
    const votedVoters = election.voters.filter((v) => v.hasVoted).length;
    const totalVotes = election.votes.length;

    return {
      electionId: election.id,
      electionTitle: election.title,
      electionStatus: election.status,
      generatedAt: new Date(),
      summary: {
        totalVoters,
        votedVoters,
        abstainedVoters: totalVoters - votedVoters,
        voterTurnout: ((votedVoters / totalVoters) * 100).toFixed(2) + '%',
        totalVotes
      },
      results: election.positions.map((position) => ({
        position: position.title,
        candidates: position.candidates
          .map((candidate) => ({
            name: candidate.name,
            votes: candidate.votes.length,
            percentage: totalVotes > 0 ? ((candidate.votes.length / totalVotes) * 100).toFixed(2) + '%' : '0%'
          }))
          .sort((a, b) => b.votes - a.votes)
      }))
    };
  }

  async exportReportAsPDF(electionId: string) {
    const report = await this.generateElectionReport(electionId);
    // TODO: Implement PDF generation using libraries like pdfkit or puppeteer
    return report;
  }

  async exportReportAsCSV(electionId: string) {
    const report = await this.generateElectionReport(electionId);
    // TODO: Implement CSV export
    return report;
  }
}

export const reportService = new ReportService();
