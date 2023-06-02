import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'alfa', description: 'Project Name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 1, description: 'Foreign Key' })
  @IsNotEmpty()
  @IsNumber()
  org_id: number;
}
