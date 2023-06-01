import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getFilePathConfig } from './config/filepath.config';
import { getSequelizeConfig } from './config/sequelize.config';

@Module({
  imports: [
    ConfigModule.forRoot(getFilePathConfig()),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getSequelizeConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
