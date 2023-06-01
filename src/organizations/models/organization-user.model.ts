import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Organization } from './organization.model';
import { User } from '../../users/models/user.model';

@Table({ tableName: 'organization_users' })
export class OrganizationUser extends Model<OrganizationUser> {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({ example: 1, description: 'Foreign Key' })
  @ForeignKey(() => Organization)
  @Column({ type: DataType.INTEGER })
  org_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id: number;

  @BelongsTo(() => Organization, 'org_id')
  organization: Organization;

  @BelongsTo(() => User, 'user_id')
  user: User;
}
