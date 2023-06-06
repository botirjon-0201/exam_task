import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './models/task.model';
import { Project } from '../projects/models/project.model';
import { OrganizationUser } from '../organizations/models/organization-user.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    @InjectModel(Project)
    private taskModel: typeof Task,
  ) {}

  async create(userId: number, createTaskDto: CreateTaskDto) {
    const { name, project_id, worker_user_id } = createTaskDto;

    const task = await this.findByName(
      name,
      project_id,
      worker_user_id,
      userId,
    );
    if (task) throw new BadRequestException('Task that name already exists!');

    const HeadOrganization = await OrganizationUser.findOne({
      where: { user_id: userId },
      include: { all: true },
    });

    const EmployeeOrganization = await OrganizationUser.findOne({
      where: { user_id: worker_user_id },
      include: { all: true },
    });

    if (!(HeadOrganization.org_id === EmployeeOrganization.org_id))
      throw new BadRequestException('This worker is not your employee');

    await this.taskModel.create({
      ...createTaskDto,
      created_by: userId,
    });

    const response = { message: 'New Task created successfully!' };
    return response;
  }

  async findAll(userId: number) {
    const tasks = await this.taskModel.findAll({
      where: { created_by: userId },
      include: { all: true },
    });
    if (!tasks) throw new NotFoundException('No any Tasks');

    const response = { tasks, message: 'All Tasks' };
    return response;
  }

  async findAllTasksInProject(userId: number) {
    const tasks = await this.taskModel.findAll({
      where: { created_by: userId },
      include: [{ model: Project, attributes: ['id', 'name'] }],
    });
    if (!tasks) throw new NotFoundException('No any Tasks');

    const result = {};
    tasks.forEach((task) => {
      const projectName = task.project.name;
      if (!result[projectName]) {
        result[projectName] = [];
      }
      result[projectName].push(task);
    });

    const response = {
      tasks: result,
      message: 'All tasks in the section of projects',
    };
    return response;
  }

  async findTasksByProjectForEmployee(employeeId: number) {
    const tasks = await this.taskModel.findAll({
      where: { worker_user_id: employeeId },
      include: [{ model: Project, attributes: ['id', 'name'] }],
    });
    if (!tasks) throw new NotFoundException('No any Tasks');

    const result = {};
    tasks.forEach((task) => {
      const projectName = task.project.name;
      if (!result[projectName]) {
        result[projectName] = [];
      }
      result[projectName].push(task);
    });

    const response = {
      tasks: result,
      message: 'All tasks assigned to the employee in the section of projects',
    };
    return response;
  }

  async findTasksByStatusForEmployee(employeeId: number) {
    const tasks = await this.taskModel.findAll({
      where: { worker_user_id: employeeId },
      include: [{ model: Project, attributes: ['id', 'name'] }],
    });
    if (!tasks) throw new NotFoundException('No any Tasks');

    const result = {};
    tasks.forEach((task) => {
      const status = task.status;
      if (!result[status]) {
        result[status] = [];
      }
      result[status].push(task);
    });

    const response = {
      tasks: result,
      message: 'All tasks assigned to the employee in the section of status',
    };
    return response;
  }

  async findOne(id: number, userId: number) {
    const task = await this.findById(id, userId);
    if (!task) throw new NotFoundException('Task Not Found');

    const response = { task, message: 'Task Information' };
    return response;
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findById(id, userId);
    if (!task) throw new NotFoundException('Task not found');

    await this.taskModel.update(
      { ...updateTaskDto },
      { where: { id, created_by: userId }, returning: true },
    );

    const response = { message: 'Task information updated successfully!' };
    return response;
  }

  async remove(id: number, userId: number) {
    const task = await this.findById(id, userId);
    if (!task) throw new NotFoundException('Task not found');
    await this.taskModel.destroy({ where: { id, created_by: userId } });

    const response = { message: `Task with that #${id} id removed` };
    return response;
  }

  async assignToUser(id: number, userId: number) {
    const task = await this.findById(id, userId);
    if (!task) throw new NotFoundException('Task not found');

    await this.taskModel.update(
      { worker_user_id: userId },
      { where: { id }, returning: true },
    );

    const response = { message: 'Assigned task to user!' };
    return response;
  }

  async setDueDate(id: number, userId: number, dueDate: Date) {
    const task = await this.findById(id, userId);
    if (!task) throw new NotFoundException('Task not found');

    await this.taskModel.update(
      { due_date: dueDate },
      { where: { id }, returning: true },
    );

    const response = { message: 'Due date task!' };
    return response;
  }

  async completeTask(taskId: number, employeeId: number) {
    const task = await this.taskModel.findOne({
      where: { id: taskId, worker_user_id: employeeId },
      include: { all: true },
    });
    if (!task) throw new NotFoundException('Task not found');

    await this.taskModel.update(
      { status: 'DONE', done_at: new Date() },
      { where: { id: taskId, worker_user_id: employeeId }, returning: true },
    );

    const response = { message: 'Task status updated successfully!' };
    return response;
  }

  async findById(id: number, userId: number): Promise<Task | null> {
    return await this.taskModel.findOne({
      where: { id, created_by: userId },
      include: { all: true },
    });
  }

  async findByName(
    name: string,
    project_id: number,
    worker_user_id: number,
    userId: number,
  ): Promise<Task | null> {
    return await this.taskModel.findOne({
      where: { name, project_id, worker_user_id, created_by: userId },
      include: { all: true },
    });
  }
}
