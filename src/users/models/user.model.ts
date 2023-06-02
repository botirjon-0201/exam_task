import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { OrganizationUser } from '../../organizations/models/organization-user.model';
import { Project } from '../../projects/models/project.model';
import { Task } from '../../tasks/models/task.model';
import { Organization } from '../../organizations/models/organization.model';

export type UserRole = 'ADMIN' | 'HEAD' | 'EMPLOYEE';
export type UserTypeData = keyof User;

// export enum UserRole {
//   ADMIN = 'ADMIN',
//   HEAD = 'HEAD',
//   EMPLOYEE = 'EMPLOYEE',
// }

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({ example: 'ali', description: 'User Name' })
  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @ApiProperty({ example: 'ali@gmail.com', description: 'User Email' })
  @Column({ type: DataType.STRING(255), allowNull: false })
  email: string;

  @ApiProperty({ example: 'P@$$w0rd', description: 'User Password' })
  @Column({ type: DataType.STRING(255), allowNull: false })
  password: string;

  @ApiProperty({ example: 'ADMIN', description: 'User Role' })
  @Column({ type: DataType.STRING(255), defaultValue: 'EMPLOYEE' })
  role: string;

  @ApiProperty({ example: 'refresh token', description: 'Refresh token' })
  @Column({ type: DataType.STRING(255), allowNull: true })
  refresh_token: string;

  @ApiProperty({ example: 'admin', description: 'Who created it?' })
  @Column({ type: DataType.STRING(255), defaultValue: 0, allowNull: true })
  created_by: number;

  @HasMany(() => Organization, 'created_by')
  created_organizations: Organization[];

  @BelongsToMany(() => Organization, () => OrganizationUser)
  organizations: Organization[];

  @HasMany(() => Project, 'created_by')
  created_projects: Project[];

  @HasMany(() => Task, 'created_by')
  created_tasks: Task[];

  @HasMany(() => Task, 'worker_user_id')
  tasks: Task[];
}
