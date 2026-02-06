import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { ROLE_NOTIFICATIONS } from './constants';
import { User } from '@prisma/client';

@Injectable()
export class NotificationPreferencesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns generic preferences filtered by USER ROLE.
   * If a setting is missing in DB, it defaults to TRUE (enabled).
   */
  async getPreferences(user: User) {
    const pref = await this.prisma.notificationPreference.findUnique({
      where: { userId: user.id },
    });

    const allowedTypes = ROLE_NOTIFICATIONS[user.role] || [];
    const settings = (pref?.settings as Record<string, boolean>) || {};

    // Construct response: only allowed types, default = true if not present
    const result = allowedTypes.map(type => ({
      type,
      enabled: settings[type] !== false // Default true
    }));

    return result;
  }

  async updatePreferences(user: User, updates: { type: NotificationType; enabled: boolean }[]) {
    const allowedTypes = ROLE_NOTIFICATIONS[user.role] || [];
    const newSettings: Record<string, boolean> = {};

    // Validate payloads
    for (const update of updates) {
      if (!allowedTypes.includes(update.type)) {
         throw new ForbiddenException(`Notification type ${update.type} is not allowed for role ${user.role}`);
      }
      newSettings[update.type] = update.enabled;
    }

    const existing = await this.prisma.notificationPreference.findUnique({
        where: { userId: user.id }
    });
    
    const currentSettings = (existing?.settings as Record<string, boolean>) || {};
    const mergedSettings = { ...currentSettings, ...newSettings };

    return this.prisma.notificationPreference.upsert({
      where: { userId: user.id },
      update: { settings: mergedSettings },
      create: {
        userId: user.id,
        settings: mergedSettings,
      },
    });
  }

  /**
   * GUARD: Check if a notification should be sent based on user ROLE and PREFERENCES.
   */
  async shouldSend(user: User, type: NotificationType): Promise<boolean> {
    // 1. Check Role Relevance
    const allowedTypes = ROLE_NOTIFICATIONS[user.role];
    if (!allowedTypes || !allowedTypes.includes(type)) {
        console.warn(`Attempted to send notification ${type} to user ${user.id} (Role: ${user.role}) but it is not allowed for this role.`);
        return false; 
    }

    // 2. Check Preferences
    const pref = await this.prisma.notificationPreference.findUnique({
      where: { userId: user.id },
    });

    if (!pref || !pref.settings) return true; // Default true

    const settings = pref.settings as Record<string, boolean>;
    if (settings[type] === false) return false;
    
    return true;
  }

  /**
   * Bulk check for multiple users.
   * Returns list of userIds that SHOULD receive the notification.
   */
  async filterRecipients(users: User[], type: NotificationType): Promise<string[]> {
    if (users.length === 0) return [];

    const userIds = users.map(u => u.id);

    // 1. Prefetch preferences
    const prefs = await this.prisma.notificationPreference.findMany({
      where: { 
        userId: { in: userIds }
      }
    });

    // Map userId -> settings
    const settingsMap = new Map<string, Record<string, boolean>>();
    for (const p of prefs) {
        settingsMap.set(p.userId, p.settings as Record<string, boolean>);
    }

    const eligibleUserIds: string[] = [];

    for (const user of users) {
        // 1. Role Check
        const allowedTypes = ROLE_NOTIFICATIONS[user.role];
        if (!allowedTypes || !allowedTypes.includes(type)) {
            continue; // Skip ineligible role
        }

        // 2. Preference Check
        const userSettings = settingsMap.get(user.id);
        if (userSettings && userSettings[type] === false) {
            continue; // Explicitly disabled
        }

        eligibleUserIds.push(user.id);
    }

    return eligibleUserIds;
  }
}
