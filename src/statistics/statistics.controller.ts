import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '../decorators/role.decorator';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({ summary: 'Get statistics in section of the organization' })
  @ApiResponse({ status: 200, type: Object })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Get('organization')
  getOrganizationStatistics(): any {
    return this.statisticsService.getOrganizationStatistics();
  }

  @ApiOperation({ summary: "Get in section of the organization's projects" })
  @ApiResponse({ status: 200, type: Object })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Get('project')
  getProjectStatistics() {
    return this.statisticsService.getProjectStatistics();
  }

  @ApiOperation({ summary: 'Get general statistics' })
  @ApiResponse({ status: 200, type: Object })
  @HttpCode(HttpStatus.OK)
  @Role('ADMIN')
  @Get('general')
  getGeneralStatistics() {
    return this.statisticsService.getGeneralStatistics();
  }
}
