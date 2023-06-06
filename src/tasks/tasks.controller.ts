import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '../decorators/role.decorator';
import { Task } from './models/task.model';
import { GetUser } from '../decorators/user.decorator';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({ status: 201, type: Task })
  @HttpCode(HttpStatus.CREATED)
  @Role('HEAD')
  @Post()
  create(@GetUser('id') userId: number, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(userId, createTaskDto);
  }

  @ApiOperation({ summary: 'Find all tasks' })
  @ApiResponse({ status: 200, type: [Task] })
  @HttpCode(HttpStatus.OK)
  @Role('HEAD')
  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.tasksService.findAll(userId);
  }

  @ApiOperation({ summary: 'Find all tasks in the project section' })
  @ApiResponse({ status: 200, type: [Task] })
  @HttpCode(HttpStatus.OK)
  @Role('HEAD')
  @Get('project')
  findAllTasksInProject(@GetUser('id') userId: number) {
    return this.tasksService.findAllTasksInProject(userId);
  }

  @ApiOperation({
    summary:
      'Find all tasks assigned to the employee in the section of project',
  })
  @ApiResponse({ status: 200, type: [Task] })
  @HttpCode(HttpStatus.OK)
  @Role('EMPLOYEE')
  @Get('employee')
  findTasksByProjectForEmployee(@GetUser('id') employeeId: number) {
    return this.tasksService.findTasksByProjectForEmployee(employeeId);
  }

  @ApiOperation({
    summary: 'Find all tasks assigned to the employee in the section of status',
  })
  @ApiResponse({ status: 200, type: [Task] })
  @HttpCode(HttpStatus.OK)
  @Role('EMPLOYEE')
  @Get('status')
  findTasksByStatusForEmployee(@GetUser('id') employeeId: number) {
    return this.tasksService.findTasksByStatusForEmployee(employeeId);
  }

  @ApiOperation({ summary: 'Find one task by ID' })
  @ApiResponse({ status: 200, type: Task })
  @HttpCode(HttpStatus.OK)
  @Role('HEAD')
  @Get(':id')
  findOne(@Param('id') id: number, @GetUser('id') userId: number) {
    return this.tasksService.findOne(id, userId);
  }

  @ApiOperation({ summary: 'Update task by ID' })
  @ApiResponse({ status: 200, type: Task })
  @HttpCode(HttpStatus.OK)
  @Role('HEAD')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @GetUser('id') userId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, userId, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiResponse({ status: 200, type: Object })
  @HttpCode(HttpStatus.OK)
  @Role('HEAD')
  @Delete(':id')
  remove(@Param('id') id: number, @GetUser('id') userId: number) {
    return this.tasksService.remove(id, userId);
  }

  @ApiOperation({ summary: 'Assign task to User' })
  @ApiResponse({ status: 200, type: Task })
  @HttpCode(HttpStatus.OK)
  @Put(':id/assign/:userId')
  @Role('HEAD')
  assignToUser(@Param('id') id: number, @Param('userId') userId: number) {
    return this.tasksService.assignToUser(id, userId);
  }

  @ApiOperation({ summary: 'Set task due date' })
  @ApiResponse({ status: 200, type: Task })
  @HttpCode(HttpStatus.OK)
  @Put('due-date/:id')
  @Role('HEAD')
  setDueDate(
    @Param('id') id: number,
    @GetUser('id') userId: number,
    @Body() dueDate: Date,
  ) {
    return this.tasksService.setDueDate(id, userId, dueDate);
  }

  @ApiOperation({ summary: 'Complete task assigned to Employee' })
  @ApiResponse({ status: 200, type: Task })
  @HttpCode(HttpStatus.OK)
  @Role('EMPLOYEE')
  @Put('complete/:taskId')
  completeTask(
    @Param('taskId') taskId: number,
    @GetUser('id') employeeId: number,
  ) {
    return this.tasksService.completeTask(taskId, employeeId);
  }
}
