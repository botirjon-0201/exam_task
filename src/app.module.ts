import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getFilePathConfig } from './config/filepath.config';
import { getSequelizeConfig } from './config/sequelize.config';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot(getFilePathConfig()),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getSequelizeConfig,
      inject: [ConfigService],
    }),
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    TasksModule,
    AuthModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
