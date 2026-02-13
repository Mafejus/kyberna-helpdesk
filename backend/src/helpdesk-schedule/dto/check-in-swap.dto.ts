import { IsString, IsInt, IsUUID, IsISO8601, Min, Max } from 'class-validator';

export class CheckInStartDto {
  @IsISO8601()
  date: string;

  @IsInt()
  @Min(1)
  @Max(12)
  lesson: number;
}

export class CheckInEndDto {
  @IsUUID()
  shiftId: string;
}

export class SwapCreateDto {
  @IsISO8601()
  date: string; // YYYY-MM-DD

  @IsInt()
  @Min(1)
  @Max(12)
  lesson: number;
}
