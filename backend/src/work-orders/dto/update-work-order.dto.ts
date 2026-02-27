import { IsOptional, IsString } from 'class-validator';

export class UpdateWorkOrderDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() technician?: string;
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() problemDescription?: string;
  @IsOptional() @IsString() resolution?: string;
  @IsOptional() @IsString() status?: string;
}
