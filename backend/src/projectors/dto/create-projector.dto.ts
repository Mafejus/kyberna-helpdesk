import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EquipmentType } from '@prisma/client';

export class CreateProjectorDto {
  @ApiPropertyOptional({ enum: EquipmentType, default: EquipmentType.PROJECTOR })
  @IsEnum(EquipmentType)
  @IsOptional()
  equipmentType?: EquipmentType;

  @ApiProperty({ example: '202' })
  @IsString()
  @IsNotEmpty()
  classroom: string;

  @ApiPropertyOptional({ example: 'Epson' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ example: 'EB-990U' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isFunctional?: boolean;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  lastInspectionDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  // Projector-specific
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasDellDock?: boolean;

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

  // Hub-specific
  @ApiPropertyOptional({ example: 'Nový Mikrotik' })
  @IsString()
  @IsOptional()
  hubType?: string;

  // Audio-specific
  @ApiPropertyOptional({ example: 'Nedokončené' })
  @IsString()
  @IsOptional()
  audioStatus?: string;

  @ApiPropertyOptional({ example: 'napájecí kabel 2-3 m' })
  @IsString()
  @IsOptional()
  missingItems?: string;

  // AP-specific
  @ApiPropertyOptional({ example: 'Cisco' })
  @IsString()
  @IsOptional()
  apType?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasEduroam?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasGuestNetwork?: boolean;
}
