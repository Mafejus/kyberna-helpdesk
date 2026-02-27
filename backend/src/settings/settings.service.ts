import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getRetentionDays(): Promise<number> {
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: 'TICKET_RETENTION_DAYS' },
    });
    return setting ? parseInt(setting.value, 10) : 30; // default to 30
  }

  async updateRetentionDays(days: number): Promise<void> {
    await this.prisma.systemSetting.upsert({
      where: { key: 'TICKET_RETENTION_DAYS' },
      update: { value: days.toString() },
      create: { key: 'TICKET_RETENTION_DAYS', value: days.toString() },
    });
  }
}
