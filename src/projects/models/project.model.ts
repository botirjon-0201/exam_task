import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Organization } from '../../organizations/models/organization.model';
import { User } from '../../users/models/user.model';
import { Task } from '../../tasks/models/task.model';

@Table({ tableName: 'projects' })
export class Project extends Model<Project> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({ example: 'alfa', description: 'Project Name' })
  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @ApiProperty({ example: 1, description: 'Foreign Key' })
  @ForeignKey(() => Organization)
  @Column({ type: DataType.INTEGER })
  org_id: number;

  @ApiProperty({ example: 1, description: 'Foreign Key' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  created_by: number;

  @BelongsTo(() => Organization, 'org_id')
  organization: Organization;

  @BelongsTo(() => User, 'created_by')
  created_by_user: User;

  @HasMany(() => Task)
  tasks: Task[];
}
