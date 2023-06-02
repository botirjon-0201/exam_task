import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'google', description: 'Organization Name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
