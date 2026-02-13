import { Controller, Get, Query, Param, UseGuards, Res } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Response } from 'express';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('summary')
  async getSummary(@Query('from') from: string, @Query('to') to: string) {
    return this.attendanceService.getAttendanceSummary(from, to);
  }

  @Get('now')
  async getNow() {
    return this.attendanceService.getCurrentStatus();
  }

  @Get('calendar/week')
  async getCalendarWeek(@Query('start') start: string) {
    return this.attendanceService.getWeekCalendar(start);
  }

  @Get('export')
  async exportCsv(
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const csv = await this.attendanceService.exportCsv(from, to);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="attendance-${from}-${to}.csv"`,
    );
    res.send(csv);
  }

  @Get('students/:id')
  async getStudentDetail(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.attendanceService.getStudentAttendance(id, from, to);
  }
}
