import { Module } from '@nestjs/common';
import { PowerSocketService } from './power-socket.service';
import { PowerSocketController } from './power-socket.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PowerSocketController],
  providers: [PowerSocketService],
})
export class PowerSocketModule {}
