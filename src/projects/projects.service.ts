import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from './models/project.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  async create(userId: number, createProjectDto: CreateProjectDto) {
    const project = await this.findByName(createProjectDto.name, userId);
    if (project)
      throw new BadRequestException('Project that name already exists!');

    await this.projectModel.create({
      ...createProjectDto,
      created_by: userId,
    });

    const response = { message: 'New Project created successfully!' };
    return response;
  }

  async findAll(userId: number) {
    const projects = await this.projectModel.findAll({
      where: { created_by: userId },
      include: { all: true },
    });
    if (!projects) throw new NotFoundException('No any Projects');

    const response = { projects, message: 'All Projects' };
    return response;
  }

  async findOne(id: number, userId: number) {
    const project = await this.findById(id, userId);
    if (!project) throw new NotFoundException('Project Not Found');

    const response = { project, message: 'Project Information' };
    return response;
  }

  async update(id: number, userId: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findById(id, userId);
    if (!project) throw new NotFoundException('Project not found');

    await this.projectModel.update(
      { ...updateProjectDto },
      { where: { id, created_by: userId }, returning: true },
    );

    const response = { message: 'Project information updated successfully!' };
    return response;
  }

  async remove(id: number, userId: number) {
    const project = await this.findById(id, userId);
    if (!project) throw new NotFoundException('Project not found');
    await this.projectModel.destroy({ where: { id, created_by: userId } });

    const response = { message: `Project with that #${id} id removed` };
    return response;
  }

  async findById(id: number, userId: number): Promise<Project | null> {
    return await this.projectModel.findOne({
      where: { id, created_by: userId },
      include: { all: true },
    });
  }

  async findByName(name: string, userId: number): Promise<Project | null> {
    return await this.projectModel.findOne({
      where: { name, created_by: userId },
      include: { all: true },
    });
  }
}
