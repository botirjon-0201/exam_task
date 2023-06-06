import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'To do Ui', description: 'Task Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1, description: 'Foreign Key' })
  @IsNotEmpty()
  @IsNumber()
  project_id: number;

  @ApiProperty({ example: 1, description: 'Foreign Key' })
  @IsNotEmpty()
  @IsNumber()
  worker_user_id: number;

  @ApiProperty({ example: '2020-01-01', description: 'Due date' })
  @IsNotEmpty()
  @IsDateString()
  due_date: Date;
}
