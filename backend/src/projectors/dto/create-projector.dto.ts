import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectorDto {
  @ApiProperty({ example: '202' })
  @IsString()
  @IsNotEmpty()
  classroom: string;

  @ApiProperty({ example: 'Epson' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'EB-990U' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasDellDock?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isFunctional?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasHdmi?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasHdmiExtension?: boolean;

  @ApiPropertyOptional({ example: 'ano USB-A' })
  @IsString()
  @IsOptional()
  usbExtensionType?: string;

  @ApiPropertyOptional({ example: '2232+205' })
  @IsString()
  @IsOptional()
  lampHours?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  lastInspectionDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
