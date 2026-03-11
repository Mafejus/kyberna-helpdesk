import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectorDto } from './dto/create-projector.dto';
import { UpdateProjectorDto } from './dto/update-projector.dto';
import { CreateEquipmentPropertyDto } from './dto/create-equipment-property.dto';
import { UpdateEquipmentValuesDto } from './dto/update-equipment-values.dto';
import { EquipmentType } from '@prisma/client';

const PROPERTY_VALUES_INCLUDE = {
  propertyValues: {
    include: { property: true },
    orderBy: { property: { order: 'asc' as const } },
  },
};

@Injectable()
export class ProjectorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(type?: EquipmentType) {
    return this.prisma.projector.findMany({
      where: type ? { equipmentType: type } : undefined,
      orderBy: [{ classroom: 'asc' }, { brand: 'asc' }],
      include: PROPERTY_VALUES_INCLUDE,
    });
  }

  async findOne(id: string) {
    const projector = await this.prisma.projector.findUnique({
      where: { id },
      include: PROPERTY_VALUES_INCLUDE,
    });
    if (!projector) throw new NotFoundException(`Vybavení s ID "${id}" nebylo nalezeno.`);
    return projector;
  }

  create(dto: CreateProjectorDto) {
    return this.prisma.projector.create({
      data: {
        ...dto,
        lastInspectionDate: dto.lastInspectionDate
          ? new Date(dto.lastInspectionDate)
          : undefined,
      },
      include: PROPERTY_VALUES_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateProjectorDto) {
    await this.findOne(id);
    return this.prisma.projector.update({
      where: { id },
      data: {
        ...dto,
        lastInspectionDate: dto.lastInspectionDate
          ? new Date(dto.lastInspectionDate)
          : undefined,
      },
      include: PROPERTY_VALUES_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.projector.delete({ where: { id } });
  }

  // ── Property definitions ─────────────────────────────────────────────────

  getProperties(type: EquipmentType) {
    return this.prisma.equipmentProperty.findMany({
      where: { equipmentType: type },
      orderBy: { order: 'asc' },
    });
  }

  createProperty(dto: CreateEquipmentPropertyDto) {
    return this.prisma.equipmentProperty.create({ data: dto });
  }

  async deleteProperty(id: string) {
    const prop = await this.prisma.equipmentProperty.findUnique({ where: { id } });
    if (!prop) throw new NotFoundException(`Vlastnost s ID "${id}" nebyla nalezena.`);
    return this.prisma.equipmentProperty.delete({ where: { id } });
  }

  // ── Property values ──────────────────────────────────────────────────────

  async updateValues(equipmentId: string, dto: UpdateEquipmentValuesDto) {
    await this.findOne(equipmentId);
    const upserts = dto.values.map((v) =>
      this.prisma.equipmentPropertyValue.upsert({
        where: {
          equipmentId_propertyId: {
            equipmentId,
            propertyId: v.propertyId,
          },
        },
        create: {
          equipmentId,
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
    return Promise.all(upserts);
  }
}
