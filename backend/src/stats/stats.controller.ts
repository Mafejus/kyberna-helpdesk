import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('me')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  getMyStats(@Request() req) {
    return this.statsService.getMyStats(req.user.id);
  }

  @Get('student/me')
  @Roles(Role.STUDENT)
  getStudentTicketStats(@Request() req) {
    return this.statsService.getTicketStats(req.user.id);
  }

  @Get('admin/overview')
  @Roles(Role.ADMIN)
  getAdminOverview() {
    return this.statsService.getAdminOverview();
  }

  @Get('weekly-tickets')
  @Roles(Role.ADMIN, Role.STUDENT, Role.TEACHER)
  getWeeklyTickets() {
    return this.statsService.getWeeklyTickets();
  }

  @Get('leaderboard')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  getLeaderboard() {
    return this.statsService.getAdminLeaderboard();
  }
}
