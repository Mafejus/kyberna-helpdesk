import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectorDto } from './dto/create-projector.dto';
import { UpdateProjectorDto } from './dto/update-projector.dto';
import { EquipmentType } from '@prisma/client';

@Injectable()
export class ProjectorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(type?: EquipmentType) {
    return this.prisma.projector.findMany({
      where: type ? { equipmentType: type } : undefined,
      orderBy: [{ classroom: 'asc' }, { brand: 'asc' }],
    });
  }

  async findOne(id: string) {
    const projector = await this.prisma.projector.findUnique({ where: { id } });
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
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.projector.delete({ where: { id } });
  }
}
