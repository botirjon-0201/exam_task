import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Project } from '../../projects/models/project.model';

export enum TaskStatus {
  CREATED = 'CREATED',
  IN_PROCESS = 'IN_PROCESS',
  DONE = 'DONE',
}

@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({ example: 1, description: 'Foreign Key' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  created_by: number;

  @ApiProperty({ example: '2020-01-01', description: 'Created time' })
  @Column({ type: DataType.DATE, defaultValue: new Date() })
  created_at: Date;

  @ApiProperty({ example: 1, description: 'Foreign Key' })
  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER })
  project_id: number;

  @ApiProperty({ example: '2020-01-01', description: 'Due date' })
  @Column({ type: DataType.DATE })
  due_date: Date;

  @ApiProperty({ example: 1, description: 'Foreign Key' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  @Column
  worker_user_id: number;

  @ApiProperty({ example: 'CREATED', description: 'Task Status' })
  status: string;

  @ApiProperty({ example: '2020-01-01', description: 'Done at' })
  @Column({ type: DataType.DATE })
  done_at: Date;

  @BelongsTo(() => User, 'created_by')
  created_by_user: User;

  @BelongsTo(() => Project, 'project_id')
  project: Project;

  @BelongsTo(() => User, 'worker_user_id')
  worker_user: User;
}
