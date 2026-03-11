import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EquipmentType, PropertyType } from '@prisma/client';

export class CreateEquipmentPropertyDto {
  @ApiProperty({ enum: EquipmentType })
  @IsEnum(EquipmentType)
  equipmentType: EquipmentType;

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

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  order?: number;
}
