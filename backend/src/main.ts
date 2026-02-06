import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import type { NestExpressApplication } from '@nestjs/platform-express';

import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security Headers
  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }, // Fixes resource blocking on LAN
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "font-src": ["'self'", "data:"],
          "img-src": ["'self'", "data:", "blob:"], // Common for uploads/previews
        },
      },
    }),
  );

  const isProduction = process.env.NODE_ENV === 'production';

  // Enable CORS
  app.enableCors({
    origin: isProduction 
      ? ['https://helpdesk.ssakhk.cz'] 
      : [
          'http://localhost:3000',
          /^http:\/\/192\.168\.\d+\.\d+:3000$/,
          /^http:\/\/10\.\d+\.\d+\.\d+:3000$/,
          /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:3000$/,
        ],
    credentials: false, // Bearer token used, no cookies needed
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Static Assets (Uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger (only in dev)
  if (!isProduction) {
    const config = new DocumentBuilder()
        .setTitle('School Helpdesk API')
        .setDescription('The School Helpdesk API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
