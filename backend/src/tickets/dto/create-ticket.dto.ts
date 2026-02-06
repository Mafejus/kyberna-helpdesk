import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AttachmentMetadataDto {
  @ApiProperty() @IsString() originalName: string;
  @ApiProperty() @IsString() fileName: string;
  @ApiProperty() @IsString() mimeType: string;
  @ApiProperty() @IsNumber() size: number;
  @ApiProperty() @IsString() path: string;
}

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsUUID()
  classroomId: string;

  @ApiProperty({ type: [AttachmentMetadataDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentMetadataDto)
  attachments: AttachmentMetadataDto[];
}
