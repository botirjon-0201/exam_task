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
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '../decorators/role.decorator';
import { Organization } from './models/organization.model';
import { GetUser } from '../decorators/user.decorator';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Create Organization' })
  @ApiResponse({ status: 201, type: Organization })
  @HttpCode(HttpStatus.CREATED)
  @Role('ADMIN')
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @GetUser('id') id: string,
  ) {
    return this.organizationsService.create(+id, createOrganizationDto);
  }

  @ApiOperation({ summary: 'Find All Organizations' })
  @ApiResponse({ status: 200, type: [Organization] })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @ApiOperation({ summary: 'Find Organization by ID' })
  @ApiResponse({ status: 200, type: Organization })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update Organization by ID' })
  @ApiResponse({ status: 200, type: Organization })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @ApiOperation({ summary: 'Delete Organization by ID' })
  @ApiResponse({ status: 200, type: Object })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(+id);
  }
}
