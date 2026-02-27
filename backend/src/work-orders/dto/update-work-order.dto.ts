import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateWorkOrderDto {
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() payer?: string;
  @IsOptional() @IsString() material?: string;
  @IsOptional() @IsNumber() timeSpent?: number;
  @IsOptional() @IsString() signature?: string;
}
