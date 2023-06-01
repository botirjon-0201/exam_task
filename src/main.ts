import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());

    const config = getSwaggerConfig;
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/exam-task', app, document);

    const PORT = process.env.PORT || 5555;
    await app.listen(PORT);
    console.log(`Server is working on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
