import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TicketActionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string; // studentWorkNote or adminApprovalNote
}

export class ApproveTicketDto {
  @ApiProperty({ enum: [1, 3, 5] })
  @IsIn([1, 3, 5])
  difficultyPoints: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  adminApprovalNote?: string;
}

export class RejectTicketDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  adminApprovalNote?: string;

  @ApiProperty({ enum: [1, 3, 5], required: false })
  @IsOptional()
  @IsIn([1, 3, 5])
  penaltyPoints?: number;
}

export class AssignTicketDto {
  @ApiProperty({ type: [String] })
  @IsUUID('4', { each: true })
  studentIds: string[];
}

export enum AssigneeAction {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  SET_FIRST = 'SET_FIRST',
}

export class ManageAssigneesDto {
  @ApiProperty({ enum: AssigneeAction })
  @IsEnum(AssigneeAction)
  action: AssigneeAction;

  @ApiProperty()
  @IsUUID()
  userId: string;
}
