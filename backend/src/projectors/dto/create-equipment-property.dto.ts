import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EquipmentType, PropertyType } from '@prisma/client';

export class CreateEquipmentPropertyDto {
  @ApiProperty({ enum: EquipmentType })
  @IsEnum(EquipmentType)
  equipmentType: EquipmentType;

  @ApiProperty({ example: 'needs_replacement' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Je potřeba vyměnit' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiPropertyOptional({ enum: PropertyType, default: PropertyType.BOOLEAN })
  @IsEnum(PropertyType)
  @IsOptional()
  type?: PropertyType;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;
}
