import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditAction, AuditEntityType, Prisma, User } from '@prisma/client';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class ClassroomPcService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll(classroomId: string) {
    const pcs = await this.prisma.classroomPc.findMany({
      where: { classroomId },
      orderBy: {
        label: 'asc',
        // We'll need a way to sort numerically if labels are "1", "2"...
        // For now string sort is default, frontend can enhance.
      },
      include: {
        values: true,
      },
    });

    // Sort logic hack for numerical strings:
    pcs.sort((a, b) => {
      const numA = parseInt(a.label);
      const numB = parseInt(b.label);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.label.localeCompare(b.label);
    });

    return pcs;
  }

  async getProperties(classroomId: string) {
    return this.prisma.pcProperty.findMany({
      where: { classroomId },
      orderBy: { order: 'asc' },
    });
  }

  async createProperty(
    classroomId: string,
    user: User,
    data: {
      key: string;
      label: string;
      type: 'BOOLEAN' | 'TEXT';
      order?: number;
    },
  ) {
    const prop = await this.prisma.pcProperty.create({
      data: {
        ...data,
        classroomId,
      },
    });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.CLASSROOM_PC,
      entityId: prop.id,
      action: AuditAction.PROPERTY_CREATED,
      message: `Created PC property ${prop.label} (${prop.key}) in classroom ${classroomId}`,
    });

    return prop;
  }

  async deleteProperty(id: string, user: User) {
    const prop = await this.prisma.pcProperty.delete({ where: { id } });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.CLASSROOM_PC,
      entityId: id,
      action: AuditAction.PROPERTY_DELETED,
      message: `Deleted PC property ${prop.label}`,
      before: prop,
    });

    return prop;
  }

  async reorderProperties(items: { id: string; order: number }[]) {
    const updates = items.map((item) =>
      this.prisma.pcProperty.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );
    return Promise.all(updates);
  }

  async create(classroomId: string, user: User, data: { label: string; note?: string }) {
    const pc = await this.prisma.classroomPc.create({
      data: { ...data, classroomId },
    });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.CLASSROOM_PC,
      entityId: pc.id,
      action: AuditAction.PC_CREATED,
      message: `Created PC ${pc.label} in classroom ${classroomId}`,
      after: data,
    });

    return pc;
  }

  async update(id: string, user: User, data: { label?: string; note?: string }) {
    const before = await this.prisma.classroomPc.findUnique({ where: { id } });
    const pc = await this.prisma.classroomPc.update({
      where: { id },
      data,
    });

    const changes: string[] = [];
    if (data.label !== undefined && data.label !== before?.label) {
      changes.push(`označení (${before?.label} 👉 ${data.label})`);
    }
    if (data.note !== undefined && data.note !== before?.note) {
      changes.push(`poznámka`);
    }

    const changeText = changes.length > 0 ? ` (upraveno: ${changes.join(', ')})` : '';

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.CLASSROOM_PC,
      entityId: id,
      action: AuditAction.PC_UPDATED,
      message: `Upraven PC ${pc.label}${changeText}`,
      before,
      after: data,
    });

    return pc;
  }

  async updateValues(
    pcId: string,
    user: User,
    values: { propertyId: string; valueBool?: boolean; valueText?: string }[],
  ) {
    const pc = await this.prisma.classroomPc.findUnique({ where: { id: pcId } });
    // Upsert each value
    const results = await Promise.all(
      values.map((v) =>
        this.prisma.pcPropertyValue.upsert({
          where: {
            pcId_propertyId: {
              pcId,
              propertyId: v.propertyId,
            },
          },
          create: {
            pcId,
            propertyId: v.propertyId,
            valueBool: v.valueBool,
            valueText: v.valueText,
          },
          update: {
            valueBool: v.valueBool,
            valueText: v.valueText,
          },
        }),
      ),
    );

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.CLASSROOM_PC,
      entityId: pcId,
      action: AuditAction.PC_UPDATED,
      message: `Updated custom values for PC ${pc?.label}`,
      after: values,
    });

    return results;
  }

  async remove(id: string, user: User) {
    const pc = await this.prisma.classroomPc.delete({ where: { id } });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.CLASSROOM_PC,
      entityId: id,
      action: AuditAction.PC_DELETED,
      message: `Deleted PC ${pc.label}`,
      before: pc,
    });

    return pc;
  }

  // Renamed/Refactored generatePcs
  async generatePcs(classroomId: string, user: User) {
    const count = await this.prisma.classroomPc.count({
      where: { classroomId },
    });
    if (count > 0) return { message: 'PCs already exist' };

    const pcs = [];
    for (let i = 1; i <= 30; i++) {
      pcs.push({
        classroomId,
        label: i.toString(), // Store as string
        note: null,
      });
    }

    await this.prisma.classroomPc.createMany({ data: pcs });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.CLASSROOM_PC,
      entityId: classroomId,
      action: AuditAction.SOCKET_GENERATED, // Using SOCKET_GENERATED as placeholder or we should add PC_GENERATED but for now SOCKET_GENERATED is ok, or better adjust AuditAction
      message: `Generated 30 PCs for classroom ${classroomId}`,
    });

    return { message: 'Generated 30 PCs' };
  }
}
