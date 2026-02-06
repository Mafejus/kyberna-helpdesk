import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'zak1@ssakhk.cz' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Jan Novák' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ enum: Role, example: Role.STUDENT })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ example: 'Password123!', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
