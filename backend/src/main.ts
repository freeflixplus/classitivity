import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Global validation pipe with transform
  // Note: whitelist/forbidNonWhitelisted only applies to DTO-validated routes.
  // For multipart FormData uploads, raw @Body() fields bypass DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Don't reject unknown fields — they're needed for FormData uploads
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: config.get('CORS_ORIGINS', 'http://localhost:3000,https://classitivity.vercel.app').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix: /api
  app.setGlobalPrefix('api');

  const port = config.get('PORT', 4000);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Classitivity API running on http://localhost:${port}/api`);
}
bootstrap();
