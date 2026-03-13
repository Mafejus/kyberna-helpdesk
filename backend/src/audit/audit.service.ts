import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction, AuditEntityType, Prisma } from '@prisma/client';

export interface CreateAuditLogDto {
  actorUserId?: string;
  actorRole: string; // Snapshot
  actorName: string; // Snapshot
  entityType: AuditEntityType;
  entityId: string;
  action: AuditAction;
  before?: any;
  after?: any;
  message?: string;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        ...data,
        before: data.before ?? Prisma.JsonNull,
        after: data.after ?? Prisma.JsonNull,
      },
    });
  }

  // Admin: Get global audit log with filters
  async findAll(params: {
    cursor?: string;
    take?: number;
    entityType?: AuditEntityType;
    entityId?: string;
    action?: AuditAction;
    userId?: string; // Filter by actor
    search?: string;
  }) {
    const {
      cursor,
      take: limitRaw,
      entityType,
      entityId,
      action,
      userId,
      search,
    } = params;

    const limit = limitRaw || 20;
    const take = Math.min(Math.max(limit, 1), 50) + 1;

    const where: Prisma.AuditLogWhereInput = {
      entityType,
      entityId,
      action,
      actorUserId: userId,
    };

    if (search) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { actorName: { contains: search, mode: 'insensitive' } },
        { entityId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const args: Prisma.AuditLogFindManyArgs = {
      where,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }, // Tie-breaker for cursor pagination
      ],
      take,
    };

    if (cursor) {
      args.cursor = { id: cursor };
      args.skip = 1;
    }

    const items = await this.prisma.auditLog.findMany(args);

    let nextCursor: string | null = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem!.id;
    }

    return {
      items,
      nextCursor,
    };
  }

  // Get audit for a specific entity (e.g. Ticket History)
  async findByEntity(entityType: AuditEntityType, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' },
      ],
    });
  }
}
