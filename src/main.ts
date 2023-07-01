import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    const config = getSwaggerConfig;
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/exam-task', app, document);

    const PORT = process.env.PORT || 5000;
    await app.listen(PORT);
    console.log(`Server is working on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
