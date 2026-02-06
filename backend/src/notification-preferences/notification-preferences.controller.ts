import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { NotificationPreferencesService } from './notification-preferences.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User, NotificationType } from '@prisma/client';

@Controller('notification-preferences')
@UseGuards(JwtAuthGuard)
export class NotificationPreferencesController {
  constructor(private readonly service: NotificationPreferencesService) {}

  @Get('me')
  async getMyPreferences(@Request() req: any) {
    const user = req.user as User;
    return this.service.getPreferences(user);
  }

  @Patch('me')
  async updateMyPreferences(@Request() req: any, @Body() body: any) {
    const user = req.user as User;
    // Expect array of { type, enabled }
    const updates = Array.isArray(body) ? body : [];
    // Or if frontend sends object map, convert it? 
    // Plan said "Accepts partial update Record<NotificationType, boolean>".
    // BUT strict service expects array.
    // Let's support array as per my service change. 
    // And if it WAS map, convert it for backward compat or just enforce array in FE.
    // I will stick to array in FE.
    return this.service.updatePreferences(user, updates);
  }
}
