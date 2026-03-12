import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PowerSocketService {
  constructor(private prisma: PrismaService) {}

  // ---- Sockets ----

  async getSockets(classroomId: string) {
    return this.prisma.powerSocket.findMany({
      where: { classroomId },
      orderBy: { number: 'asc' },
      include: { values: true },
    });
  }

  async generateSockets(classroomId: string) {
    const count = await this.prisma.powerSocket.count({ where: { classroomId } });
    if (count > 0) return { message: 'Sockets already exist', count };

    const data = Array.from({ length: 50 }, (_, i) => ({
      classroomId,
      number: i + 1,
      isWorking: true,
    }));

    await this.prisma.powerSocket.createMany({ data });
    return { message: 'Generated 50 power sockets' };
  }

  async createSocket(classroomId: string, data: { number?: number; note?: string }) {
    // Auto-pick next number if not provided
    if (!data.number) {
      const last = await this.prisma.powerSocket.findFirst({
        where: { classroomId },
        orderBy: { number: 'desc' },
      });
      data.number = (last?.number ?? 0) + 1;
    }
    return this.prisma.powerSocket.create({
      data: { classroomId, number: data.number, isWorking: true, note: data.note },
      include: { values: true },
    });
  }

  async updateSocket(socketId: string, data: { isWorking?: boolean; hasProblem?: boolean; note?: string; number?: number }) {
    return this.prisma.powerSocket.update({
      where: { id: socketId },
      data,
      include: { values: true },
    });
  }

  async deleteSocket(socketId: string) {
    return this.prisma.powerSocket.delete({ where: { id: socketId } });
  }

  // ---- Properties ----

  async getProperties(classroomId: string) {
    return this.prisma.socketProperty.findMany({
      where: { classroomId },
      orderBy: { order: 'asc' },
    });
  }

  async createProperty(classroomId: string, data: { key: string; label: string; type: 'BOOLEAN' | 'TEXT'; order?: number }) {
    return this.prisma.socketProperty.create({ data: { ...data, classroomId } });
  }

  async deleteProperty(id: string) {
    return this.prisma.socketProperty.delete({ where: { id } });
  }

  async reorderProperties(items: { id: string; order: number }[]) {
    return Promise.all(
      items.map((item) =>
        this.prisma.socketProperty.update({ where: { id: item.id }, data: { order: item.order } }),
      ),
    );
  }

  // ---- Property Values ----

  async updateValues(socketId: string, values: { propertyId: string; valueBool?: boolean; valueText?: string }[]) {
    return Promise.all(
      values.map((v) =>
        this.prisma.socketPropertyValue.upsert({
          where: { socketId_propertyId: { socketId, propertyId: v.propertyId } },
          create: { socketId, propertyId: v.propertyId, valueBool: v.valueBool, valueText: v.valueText },
          update: { valueBool: v.valueBool, valueText: v.valueText },
        }),
      ),
    );
  }
}
