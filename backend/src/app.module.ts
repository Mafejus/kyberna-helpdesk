import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { TicketsModule } from './tickets/tickets.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadsModule } from './uploads/uploads.module';
import { StatsModule } from './stats/stats.module';
import { HelpdeskScheduleModule } from './helpdesk-schedule/helpdesk-schedule.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationPreferencesModule } from './notification-preferences/notification-preferences.module';
import { ClassroomPcModule } from './classrooms/classroom-pc/classroom-pc.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100, // Global limit: 100 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClassroomsModule,
    TicketsModule,
    UploadsModule, // Dedicated module for file uploads
    StatsModule,
    HelpdeskScheduleModule,
    AuditModule,
    NotificationsModule,
    NotificationPreferencesModule,
    ClassroomPcModule,
    AttendanceModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
