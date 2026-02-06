import { Module } from '@nestjs/common';
import { ClassroomPcService } from './classroom-pc.service';
import { ClassroomPcController } from './classroom-pc.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClassroomPcController],
  providers: [ClassroomPcService],
})
export class ClassroomPcModule {}
