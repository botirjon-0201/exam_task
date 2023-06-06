import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from '../organizations/models/organization.model';
import { Project } from '../projects/models/project.model';
import { Task } from '../tasks/models/task.model';
import sequelize from 'sequelize';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
  ) {}

  async getOrganizationStatistics(): Promise<any> {
    const result = await Organization.findAll({
      attributes: [
        'name',
        [
          sequelize.literal(
            '(SELECT COUNT(DISTINCT "projects"."id") FROM "projects" WHERE "projects"."org_id" = "Organization"."id")',
          ),
          'projectCount',
        ],
        [
          sequelize.literal(
            '(SELECT COUNT("tasks"."id") FROM "tasks" INNER JOIN "projects" ON "projects"."id" = "tasks"."project_id" WHERE "projects"."org_id" = "Organization"."id")',
          ),
          'taskCount',
        ],
      ],
    });

    const response = {
      orgStatistics: result,
      message: 'Statistics in cross-section of the organization',
    };
    return response;
  }

  async getProjectStatistics(): Promise<any> {
    const organizations = await Organization.findAll({
      attributes: ['name'],
      include: [
        {
          model: Project,
          as: 'projects',
          attributes: ['id', 'name'],
        },
      ],
    });

    const organizationStatistics = [];

    for (const organization of organizations) {
      const projectStatistics = [];

      for (const project of organization.projects) {
        const taskCount = await Task.count({
          where: { project_id: project.id },
        });
        projectStatistics.push({
          projectName: project.name,
          taskCount: taskCount.toString(),
        });
      }

      organizationStatistics.push({
        organizationName: organization.name,
        projectInfo: projectStatistics,
      });
    }

    const response = {
      orgProjStatistics: organizationStatistics,
      message: "Statistics in the cross-section of the organization's projects",
    };
    return response;
  }

  async getGeneralStatistics(): Promise<any> {
    const organizationCount = await Organization.count();
    const projectCount = await Project.count();
    const taskCount = await Task.count();

    const response = {
      generalStatistics: { organizationCount, projectCount, taskCount },
      message: 'General statistics about organization',
    };
    return response;
  }
}
