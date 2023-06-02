import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organization } from './models/organization.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrganizationUser } from './models/organization-user.model';

@Module({
  imports: [SequelizeModule.forFeature([Organization, OrganizationUser])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
