import { IsOptional, IsString } from 'class-validator';

export class UpdateWorkOrderDto {
  @IsOptional() @IsString() event?: string;
  @IsOptional() @IsString() dateRange?: string;
  @IsOptional() @IsString() problemDescription?: string;
  @IsOptional() @IsString() resolution?: string;
  @IsOptional() @IsString() status?: string;
}
