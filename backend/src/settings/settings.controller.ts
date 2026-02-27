import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('retention')
  @Roles(Role.ADMIN)
  async getRetention() {
    const days = await this.settingsService.getRetentionDays();
    return { days };
  }

  @Patch('retention')
  @Roles(Role.ADMIN)
  async updateRetention(@Body('days') days: number) {
    await this.settingsService.updateRetentionDays(days);
    return { success: true };
  }
}
