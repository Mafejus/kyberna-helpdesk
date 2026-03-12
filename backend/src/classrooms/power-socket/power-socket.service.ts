import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PowerSocketService {
  constructor(private prisma: PrismaService) {}

  async getSockets(classroomId: string) {
    return this.prisma.powerSocket.findMany({
      where: { classroomId },
      orderBy: { number: 'asc' },
    });
  }

  async generateSockets(classroomId: string) {
    const count = await this.prisma.powerSocket.count({
      where: { classroomId },
    });

    if (count > 0) {
      return { message: 'Sockets already exist', count };
    }

    const data = Array.from({ length: 50 }, (_, i) => ({
      classroomId,
      number: i + 1,
      isWorking: true,
    }));

    await this.prisma.powerSocket.createMany({ data });
    return { message: 'Generated 50 power sockets' };
  }

  async updateSocket(
    socketId: string,
    data: { isWorking?: boolean; note?: string },
  ) {
    return this.prisma.powerSocket.update({
      where: { id: socketId },
      data,
    });
  }
}
