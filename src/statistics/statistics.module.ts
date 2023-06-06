import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from '../organizations/models/organization.model';
import { Project } from '../projects/models/project.model';
import { Task } from '../tasks/models/task.model';
import { OrganizationsModule } from '../organizations/organizations.module';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Organization, Project, Task]),
    OrganizationsModule,
    ProjectsModule,
    TasksModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
