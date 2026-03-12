import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty({ enum: PropertyType, required: false })
  @IsEnum(PropertyType)
  @IsOptional()
  type?: PropertyType;

  @ApiPropertyOptional({ default: 0 })
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  order?: number;
}
