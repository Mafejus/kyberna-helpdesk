import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(private prisma: PrismaService) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const existing = await this.prisma.classroom.findUnique({
      where: { code: createClassroomDto.code },
    });
    if (existing) throw new ConflictException('Classroom code already exists');

    return this.prisma.classroom.create({ data: createClassroomDto });
  }

  findAll() {
    return this.prisma.classroom.findMany({
      orderBy: { code: 'asc' },
      include: {
        _count: {
          select: { tickets: { where: { status: 'APPROVED' } } }, // count approved
        },
      },
    });
  }

  // Custom method to return stats directly if needed, or mapped in controller
  async findAllWithStats() {
    const classrooms = await this.prisma.classroom.findMany({
      orderBy: { code: 'asc' },
      include: {
        tickets: {
          select: { status: true },
        },
      },
    });

    return classrooms.map((c) => ({
      id: c.id,
      code: c.code,
      approved: c.tickets.filter((t) => t.status === 'APPROVED').length,
      unfinished: c.tickets.filter((t) => t.status !== 'APPROVED').length,
    }));
  }

  findOne(id: string) {
    return this.prisma.classroom.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.classroom.delete({ where: { id } });
  }
}
