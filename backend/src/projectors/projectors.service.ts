import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectorDto } from './dto/create-projector.dto';
import { UpdateProjectorDto } from './dto/update-projector.dto';

@Injectable()
export class ProjectorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.projector.findMany({
      orderBy: [{ classroom: 'asc' }, { brand: 'asc' }],
    });
  }

  async findOne(id: string) {
    const projector = await this.prisma.projector.findUnique({ where: { id } });
    if (!projector) throw new NotFoundException(`Projektor s ID "${id}" nebyl nalezen.`);
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
    await this.findOne(id); // throws 404 if not found
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
    await this.findOne(id); // throws 404 if not found
    return this.prisma.projector.delete({ where: { id } });
  }
}
