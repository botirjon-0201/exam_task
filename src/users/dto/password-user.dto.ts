import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class PasswordUserDto extends PickType(CreateUserDto, [
  'password',
] as const) {
  @ApiProperty({ example: 'P@$$w0rd1', description: 'User New Password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  new_password: string;

  @ApiProperty({ example: 'P@$$w0rd1', description: 'Confirm New Password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  confirm_new_password: string;
}
