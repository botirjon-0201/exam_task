import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { OrganizationUser } from './organization-user.model';
import { Project } from '../../projects/models/project.model';
import { User } from '../../users/models/user.model';

@Table({ tableName: 'organizations' })
export class Organization extends Model<Organization> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({ example: 'google', description: 'Organization Name' })
  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @ApiProperty({ example: 1, description: 'Foreign Key' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  created_by: number;

  @BelongsTo(() => User, 'created_by')
  created_by_user: User;

  @BelongsToMany(() => User, () => OrganizationUser)
  users: User[];

  @HasMany(() => Project)
  projects: Project[];
}
