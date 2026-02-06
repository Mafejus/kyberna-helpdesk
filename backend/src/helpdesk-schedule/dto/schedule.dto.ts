import { IsInt, IsISO8601, IsArray, IsUUID, IsString, Min, Max, ArrayMaxSize } from 'class-validator';

export class ClaimSlotDto {
  @IsISO8601()
  date: string; // YYYY-MM-DD

  @IsInt()
  @Min(1)
  @Max(12)
  lesson: number;
}

export class SetSlotDto {
  @IsISO8601()
  date: string;

  @IsInt()
  @Min(1)
  @Max(12)
  lesson: number;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMaxSize(10)
  studentIds: string[];
}

export class RemoveStudentDto {
  @IsISO8601()
  date: string;

  @IsInt()
  @Min(1)
  @Max(12)
  lesson: number;

  @IsUUID()
  studentId: string;
}
