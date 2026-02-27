import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketCronService } from './ticket-cron.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, TicketCronService],
})
export class TicketsModule {}
