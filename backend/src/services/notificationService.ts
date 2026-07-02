import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

export class NotificationService {
  async sendEmailNotification(
    email: string,
    subject: string,
    template: string,
    data: Record<string, unknown>
  ) {
    try {
      logger.info(`Sending email to ${email}`, { subject });
      // Integration with nodemailer
      // TODO: Implement email sending
      logger.info('Email sent successfully');
    } catch (error) {
      logger.error('Failed to send email', error);
      throw error;
    }
  }

  async sendSmsNotification(phone: string, message: string) {
    try {
      logger.info(`Sending SMS to ${phone}`);
      // Integration with Twilio
      // TODO: Implement SMS sending
      logger.info('SMS sent successfully');
    } catch (error) {
      logger.error('Failed to send SMS', error);
      throw error;
    }
  }

  async notifyElectionStart(electionId: string) {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: { voters: true }
    });

    if (!election) return;

    for (const voter of election.voters) {
      await this.sendEmailNotification(
        voter.user.email,
        `Election "${election.title}" has started!`,
        'election-start',
        { electionTitle: election.title }
      );
    }
  }

  async notifyElectionEnd(electionId: string) {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: { voters: true }
    });

    if (!election) return;

    for (const voter of election.voters) {
      await this.sendEmailNotification(
        voter.user.email,
        `Election "${election.title}" has ended`,
        'election-end',
        { electionTitle: election.title }
      );
    }
  }
}

export const notificationService = new NotificationService();
