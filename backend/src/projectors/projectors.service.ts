import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectorDto } from './dto/create-projector.dto';
import { UpdateProjectorDto } from './dto/update-projector.dto';
import { CreateEquipmentPropertyDto } from './dto/create-equipment-property.dto';
import { UpdateEquipmentValuesDto } from './dto/update-equipment-values.dto';
import { AuditAction, AuditEntityType, EquipmentType, User } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

const PROPERTY_VALUES_INCLUDE = {
  propertyValues: {
    include: { property: true },
    orderBy: { property: { order: 'asc' as const } },
  },
};

@Injectable()
export class ProjectorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

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

  create(dto: CreateProjectorDto, user: User) {
    return this.prisma.$transaction(async (tx) => {
      const projector = await tx.projector.create({
        data: {
          ...dto,
          lastInspectionDate: dto.lastInspectionDate
            ? new Date(dto.lastInspectionDate)
            : undefined,
        },
        include: PROPERTY_VALUES_INCLUDE,
      });

      await this.auditService.log({
        actorUserId: user.id,
        actorRole: user.role,
        actorName: user.fullName,
        entityType: AuditEntityType.EQUIPMENT,
        entityId: projector.id,
        action: AuditAction.EQUIPMENT_CREATED,
        message: `Created ${projector.equipmentType} in classroom ${projector.classroom} (${projector.brand} ${projector.model})`,
        after: dto,
      });

      return projector;
    });
  }

  async update(id: string, dto: UpdateProjectorDto, user: User) {
    const before = await this.findOne(id);
    const projector = await this.prisma.projector.update({
      where: { id },
      data: {
        ...dto,
        lastInspectionDate: dto.lastInspectionDate
          ? new Date(dto.lastInspectionDate)
          : undefined,
      },
      include: PROPERTY_VALUES_INCLUDE,
    });

    const changes: string[] = [];
    if (dto.brand !== undefined && dto.brand !== before.brand) changes.push('značka');
    if (dto.model !== undefined && dto.model !== before.model) changes.push('model');
    if (dto.isFunctional !== undefined && dto.isFunctional !== before.isFunctional) changes.push(`stav na ${dto.isFunctional ? 'funkční' : 'nefunkční'}`);
    if (dto.notes !== undefined && dto.notes !== before.notes) changes.push('poznámka');
    if (dto.lastInspectionDate !== undefined) changes.push('datum revize');
    if (dto.equipmentType !== undefined && dto.equipmentType !== before.equipmentType) changes.push('typ');
    if (dto.classroom !== undefined && dto.classroom !== before.classroom) changes.push('učebna');

    const changeText = changes.length > 0 ? ` (upraveno: ${changes.join(', ')})` : '';

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.EQUIPMENT,
      entityId: id,
      action: AuditAction.EQUIPMENT_UPDATED,
      message: `Upraveno vybavení ${projector.equipmentType} v učebně ${projector.classroom}${changeText}`,
      before,
      after: dto,
    });

    return projector;
  }

  async remove(id: string, user: User) {
    const projector = await this.findOne(id);
    await this.prisma.projector.delete({ where: { id } });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.EQUIPMENT,
      entityId: id,
      action: AuditAction.EQUIPMENT_DELETED,
      message: `Deleted ${projector.equipmentType} in ${projector.classroom}`,
      before: projector,
    });

    return projector;
  }

  // ── Property definitions ─────────────────────────────────────────────────

  getProperties(type: EquipmentType) {
    return this.prisma.equipmentProperty.findMany({
      where: { equipmentType: type },
      orderBy: { order: 'asc' },
    });
  }

  async createProperty(dto: CreateEquipmentPropertyDto, user: User) {
    const prop = await this.prisma.equipmentProperty.create({ data: dto });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.EQUIPMENT,
      entityId: prop.id,
      action: AuditAction.PROPERTY_CREATED,
      message: `Created equipment property ${prop.label} for ${prop.equipmentType}`,
    });

    return prop;
  }

  async deleteProperty(id: string, user: User) {
    const prop = await this.prisma.equipmentProperty.findUnique({ where: { id } });
    if (!prop) throw new NotFoundException(`Vlastnost s ID "${id}" nebyla nalezena.`);
    await this.prisma.equipmentProperty.delete({ where: { id } });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.EQUIPMENT,
      entityId: id,
      action: AuditAction.PROPERTY_DELETED,
      message: `Deleted equipment property ${prop.label} for ${prop.equipmentType}`,
      before: prop,
    });

    return prop;
  }

  // ── Property values ──────────────────────────────────────────────────────

  async updateValues(equipmentId: string, dto: UpdateEquipmentValuesDto, user: User) {
    const projector = await this.findOne(equipmentId);
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
    const results = await Promise.all(upserts);

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.EQUIPMENT,
      entityId: equipmentId,
      action: AuditAction.EQUIPMENT_UPDATED,
      message: `Updated custom values for ${projector.equipmentType} in ${projector.classroom}`,
      after: dto.values,
    });

    return results;
  }
}
