import { Module } from '@nestjs/common';
import { HelpdeskScheduleService } from './helpdesk-schedule.service';
import { HelpdeskScheduleController } from './helpdesk-schedule.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CheckInService } from './check-in.service';
import { SwapService } from './swap.service';
import { NotificationPreferencesModule } from '../notification-preferences/notification-preferences.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [NotificationPreferencesModule, PrismaModule],
  providers: [
    HelpdeskScheduleService,
    SwapService,
    PrismaService,
    CheckInService,
  ],
  controllers: [HelpdeskScheduleController],
})
export class HelpdeskScheduleModule {}
