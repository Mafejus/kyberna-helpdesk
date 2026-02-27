import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketCronService {
  private readonly logger = new Logger(TicketCronService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async archiveOldTickets() {
    this.logger.log('Running daily ticket archiving cron job...');

    // Fetch retention days setting
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: 'TICKET_RETENTION_DAYS' },
    });
    
    const retentionDays = setting ? parseInt(setting.value, 10) : 30;
    
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - retentionDays);

    const ticketsToArchive = await this.prisma.ticket.updateMany({
      where: {
        status: 'APPROVED',
        isArchived: false,
        updatedAt: {
          lt: thresholdDate,
        },
      },
      data: {
        isArchived: true,
      },
    });

    this.logger.log(`Archived ${ticketsToArchive.count} old tickets.`);
  }
}
