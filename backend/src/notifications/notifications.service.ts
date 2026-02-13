import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationPreferencesService } from '../notification-preferences/notification-preferences.service';

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  linkUrl: string;
  metadata?: any;
  skipPreferenceCheck?: boolean;
}

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private preferencesService: NotificationPreferencesService,
  ) {}

  async create(data: CreateNotificationDto) {
    const { userId, type, skipPreferenceCheck, ...dbData } = data;

    if (!skipPreferenceCheck) {
      // Fetch user strictly for Guard checks
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        console.warn(
          `Attempted to send notification to non-existent user ${userId}`,
        );
        return null;
      }

      const shouldSend = await this.preferencesService.shouldSend(user, type);
      if (!shouldSend) return null;
    }

    return this.prisma.notification.create({
      data: {
        userId,
        type,
        ...dbData,
      },
    });
  }

  async findAll(userId: string, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        readAt: unreadOnly ? null : undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    });
  }

  async markAsRead(id: string, userId: string) {
    // Verify ownership
    const notif = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notif) return null;

    return this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
