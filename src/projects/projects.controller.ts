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
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '../decorators/role.decorator';
import { Project } from './models/project.model';
import { GetUser } from '../decorators/user.decorator';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Create Project' })
  @ApiResponse({ status: 201, type: Project })
  @HttpCode(HttpStatus.CREATED)
  @Role('HEAD')
  @Post()
  create(
    @GetUser('id') userId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(+userId, createProjectDto);
  }

  @ApiOperation({ summary: 'Find All Projects' })
  @ApiResponse({ status: 200, type: [Project] })
  @HttpCode(HttpStatus.OK)
  @Role('HEAD')
  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.projectsService.findAll(+userId);
  }

  @ApiOperation({ summary: 'Find Project by ID' })
  @ApiResponse({ status: 200, type: Project })
  @HttpCode(HttpStatus.OK)
  @Role('HEAD')
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.projectsService.findOne(+id, +userId);
  }

  @ApiOperation({ summary: 'Update Project by ID' })
  @ApiResponse({ status: 200, type: Project })
  @HttpCode(HttpStatus.OK)
  @Role('HEAD')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(+id, +userId, updateProjectDto);
  }

  @ApiOperation({ summary: 'Delete Project by ID' })
  @ApiResponse({ status: 200, type: Object })
  @HttpCode(HttpStatus.OK)
  @Role('HEAD')
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.projectsService.remove(+id, +userId);
  }
}
