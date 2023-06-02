import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'ali', description: 'Name of User' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'ali@gmail.com', description: 'User Email' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@$$w0rd', description: 'User Password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'P@$$w0rd', description: 'Confirm Password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  confirm_password: string;

  @ApiProperty({ example: 'ADMIN', description: 'Role of User' })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ example: 1, description: 'User Organization' })
  @IsNotEmpty()
  @IsNumber()
  org_id: number;
}
