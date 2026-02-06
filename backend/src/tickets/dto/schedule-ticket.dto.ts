import { IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleTicketDto {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDateString()
  plannedAt?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueAt?: string;
}
