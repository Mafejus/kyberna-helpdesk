import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { WorkOrdersService } from './src/work-orders/work-orders.service';
import { PrismaService } from './src/prisma/prisma.service';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    console.log('No admin found');
    return await app.close();
  }
  console.log('Admin:', admin.email);
  const service = app.get(WorkOrdersService);
  const buffer = fs.readFileSync('test.csv');
  
  try {
     const result = await service.importCsv({ buffer } as any, admin);
     console.log('Success!', result);
  } catch(e) {
     console.error('Error in importCsv:', e);
  }
  await app.close();
}
bootstrap();
