import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassroomDto {
  @ApiProperty({ example: '205' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
