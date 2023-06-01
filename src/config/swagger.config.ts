import { DocumentBuilder } from '@nestjs/swagger';

export const getSwaggerConfig = new DocumentBuilder()
  .setTitle('Project Management API')
  .setDescription('API for managing projects and tasks')
  .setVersion('1.0.0')
  .addTag('NodeJs, NestJs, Postgres, Sequalize, Jwt, Swagger')
  .addServer('api')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'Bearer',
  )
  .build();
