import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditAction, AuditEntityType, User } from '@prisma/client';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class PowerSocketService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  // ---- Sockets ----

  async getSockets(classroomId: string) {
    return this.prisma.powerSocket.findMany({
      where: { classroomId },
      orderBy: { number: 'asc' },
      include: { values: true },
    });
  }

  async generateSockets(classroomId: string, user: User) {
    const count = await this.prisma.powerSocket.count({ where: { classroomId } });
    if (count > 0) return { message: 'Sockets already exist', count };

    const data = Array.from({ length: 50 }, (_, i) => ({
      classroomId,
      number: i + 1,
      isWorking: true,
    }));

    await this.prisma.powerSocket.createMany({ data });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.POWER_SOCKET,
      entityId: classroomId,
      action: AuditAction.SOCKET_GENERATED,
      message: `Generated 50 power sockets for classroom ${classroomId}`,
    });

    return { message: 'Generated 50 power sockets' };
  }

  async createSocket(classroomId: string, user: User, data: { number?: number; note?: string }) {
    // Auto-pick next number if not provided
    if (!data.number) {
      const last = await this.prisma.powerSocket.findFirst({
        where: { classroomId },
        orderBy: { number: 'desc' },
      });
      data.number = (last?.number ?? 0) + 1;
    }
    const socket = await this.prisma.powerSocket.create({
      data: { classroomId, number: data.number, isWorking: true, note: data.note },
      include: { values: true },
    });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.POWER_SOCKET,
      entityId: socket.id,
      action: AuditAction.SOCKET_CREATED,
      message: `Created power socket #${socket.number} in classroom ${classroomId}`,
      after: { number: socket.number, note: socket.note },
    });

    return socket;
  }

  async updateSocket(socketId: string, user: User, data: { isWorking?: boolean; hasProblem?: boolean; note?: string; number?: number }) {
    const before = await this.prisma.powerSocket.findUnique({ where: { id: socketId } });
    const socket = await this.prisma.powerSocket.update({
      where: { id: socketId },
      data,
      include: { values: true },
    });

    const changes: string[] = [];
    if (data.isWorking !== undefined && data.isWorking !== before?.isWorking) {
      changes.push(`stav na ${data.isWorking ? 'funkční' : 'nefunkční'}`);
    }
    if (data.hasProblem !== undefined && data.hasProblem !== before?.hasProblem) {
      changes.push(data.hasProblem ? 'označena s problémem' : 'zrušeno označení problému');
    }
    if (data.note !== undefined && data.note !== before?.note) {
      changes.push(`upravena poznámka`);
    }
    if (data.number !== undefined && data.number !== before?.number) {
      changes.push(`změněno číslo (${before?.number} 👉 ${data.number})`);
    }

    const changeText = changes.length > 0 ? ` (${changes.join(', ')})` : '';

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.POWER_SOCKET,
      entityId: socket.id,
      action: AuditAction.SOCKET_UPDATED,
      message: `Upravena zásuvka #${socket.number}${changeText}`,
      before,
      after: data,
    });

    return socket;
  }

  async deleteSocket(socketId: string, user: User) {
    const socket = await this.prisma.powerSocket.delete({ where: { id: socketId } });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.POWER_SOCKET,
      entityId: socketId,
      action: AuditAction.SOCKET_DELETED,
      message: `Deleted power socket #${socket.number}`,
      before: socket,
    });

    return socket;
  }

  // ---- Properties ----

  async getProperties(classroomId: string) {
    return this.prisma.socketProperty.findMany({
      where: { classroomId },
      orderBy: { order: 'asc' },
    });
  }

  async createProperty(classroomId: string, user: User, data: { key: string; label: string; type: 'BOOLEAN' | 'TEXT'; order?: number }) {
    const prop = await this.prisma.socketProperty.create({ data: { ...data, classroomId } });
    
    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.POWER_SOCKET,
      entityId: prop.id,
      action: AuditAction.PROPERTY_CREATED,
      message: `Created socket property ${prop.label} (${prop.key}) in classroom ${classroomId}`,
    });

    return prop;
  }

  async deleteProperty(id: string, user: User) {
    const prop = await this.prisma.socketProperty.delete({ where: { id } });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.POWER_SOCKET,
      entityId: id,
      action: AuditAction.PROPERTY_DELETED,
      message: `Deleted socket property ${prop.label}`,
      before: prop,
    });

    return prop;
  }

  async reorderProperties(items: { id: string; order: number }[]) {
    return Promise.all(
      items.map((item) =>
        this.prisma.socketProperty.update({ where: { id: item.id }, data: { order: item.order } }),
      ),
    );
  }

  // ---- Property Values ----

  async updateValues(socketId: string, user: User, values: { propertyId: string; valueBool?: boolean; valueText?: string }[]) {
    const socket = await this.prisma.powerSocket.findUnique({ where: { id: socketId } });
    const results = await Promise.all(
      values.map((v) =>
        this.prisma.socketPropertyValue.upsert({
          where: { socketId_propertyId: { socketId, propertyId: v.propertyId } },
          create: { socketId, propertyId: v.propertyId, valueBool: v.valueBool, valueText: v.valueText },
          update: { valueBool: v.valueBool, valueText: v.valueText },
        }),
      ),
    );

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.POWER_SOCKET,
      entityId: socketId,
      action: AuditAction.SOCKET_UPDATED,
      message: `Updated custom values for power socket #${socket?.number}`,
      after: values,
    });

    return results;
  }
}
