import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassroomPcService {
  constructor(private prisma: PrismaService) {}

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
    data: {
      key: string;
      label: string;
      type: 'BOOLEAN' | 'TEXT';
      order?: number;
    },
  ) {
    return this.prisma.pcProperty.create({
      data: {
        ...data,
        classroomId,
      },
    });
  }

  async deleteProperty(id: string) {
    return this.prisma.pcProperty.delete({ where: { id } });
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

  async create(classroomId: string, data: { label: string; note?: string }) {
    const pc = await this.prisma.classroomPc.create({
      data: { ...data, classroomId },
    });
    // Auto-create simplified empty values not strictly needed as frontend can handle missing values
    return pc;
  }

  async update(id: string, data: { label?: string; note?: string }) {
    return this.prisma.classroomPc.update({
      where: { id },
      data,
    });
  }

  async updateValues(
    pcId: string,
    values: { propertyId: string; valueBool?: boolean; valueText?: string }[],
  ) {
    // Upsert each value
    const updates = values.map((v) =>
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
    );
    return Promise.all(updates);
  }

  async remove(id: string) {
    return this.prisma.classroomPc.delete({ where: { id } });
  }

  // Renamed/Refactored generatePcs
  async generatePcs(classroomId: string) {
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
    // Should we generate empty property values? Not strictly necessary if lazy.
    return { message: 'Generated 30 PCs' };
  }
}
