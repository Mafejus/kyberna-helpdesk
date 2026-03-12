import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PropertyValueItem {
  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  valueBool?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  valueText?: string;
}

export class UpdateEquipmentValuesDto {
  @ApiProperty({ type: [PropertyValueItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyValueItem)
  values: PropertyValueItem[];
}
