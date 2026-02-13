import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  User,
  Role,
  AuditAction,
  AuditEntityType,
  NotificationType,
  SwapStatus,
} from '@prisma/client';
import { LESSON_TIMES } from '../common/constants';
import { NotificationPreferencesService } from '../notification-preferences/notification-preferences.service';

@Injectable()
export class SwapService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
    private preferencesService: NotificationPreferencesService,
  ) {}

  async createOffer(user: User, date: string, lesson: number) {
    if (user.role !== Role.STUDENT) throw new ForbiddenException();

    // 1. Find shift
    const shift = await this.prisma.helpdeskShift.findUnique({
      where: { date_lesson: { date, lesson } },
      include: { assignees: true },
    });
    if (!shift) throw new NotFoundException('Shift not found');

    // 2. Verify assignee
    if (!shift.assignees.some((a) => a.userId === user.id)) {
      throw new BadRequestException('You are not assigned to this shift');
    }

    // 3. Verify duplicate
    const existing = await this.prisma.helpdeskSwap.findFirst({
      where: {
        shiftId: shift.id,
        offeredByUserId: user.id,
        status: SwapStatus.OPEN,
      },
    });
    if (existing) {
      throw new BadRequestException('Swap already received/offered');
    }

    // 4. Verify date is in the future
    const times = LESSON_TIMES[lesson];
    if (!times) {
      throw new BadRequestException('Invalid lesson time config');
    }

    const shiftEnd = new Date(new Date(`${date}T${times.end}:00`)); // Local time construction
    const now = new Date();

    console.log(
      `[SwapService] Swap offer: User=${user.id} Date=${date} Lesson=${lesson} ShiftEnd=${shiftEnd.toISOString()}`,
    );

    if (shiftEnd < now) {
      throw new BadRequestException('Cannot swap past shifts');
    }

    // 5. Create Swap
    const swap = await this.prisma.helpdeskSwap.create({
      data: {
        shiftId: shift.id,
        offeredByUserId: user.id,
        status: SwapStatus.OPEN,
      },
    });

    // Notify Other Students (Broadcast)
    // "POSLAT notifikaci všem ostatním studentům (kromě autora)"
    // Notify Other Students (Broadcast)
    // "POSLAT notifikaci všem ostatním studentům (kromě autora)"
    const otherStudents = await this.prisma.user.findMany({
      where: {
        role: Role.STUDENT,
        id: { not: user.id },
      },
      // Fetch full user object strictly for ROLE check in filterRecipients
    });

    const filteredIds = await this.preferencesService.filterRecipients(
      otherStudents,
      NotificationType.SWAP_OFFER_CREATED,
    );

    for (const studentId of filteredIds) {
      await this.notificationsService.create({
        userId: studentId,
        type: NotificationType.SWAP_OFFER_CREATED,
        title: 'Nová nabídka výměny služby',
        body: `Student ${user.fullName} nabízí výměnu služby: ${date} – ${lesson}. hod. Otevři plánování a přijmi nabídku.`,
        linkUrl: '/dashboard/planning',
        metadata: { swapId: swap.id },
        skipPreferenceCheck: true, // Skip redundant check (User fetched, Role Checked, Prefs Checked)
      });
    }

    // Audit
    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.SWAP,
      entityId: swap.id,
      action: AuditAction.SWAP_REQUESTED,
      message: 'Swap offer created',
    });

    return swap;
  }

  async acceptOffer(user: User, swapId: string) {
    if (user.role !== Role.STUDENT) throw new ForbiddenException();

    return this.prisma.$transaction(async (tx) => {
      const swap = await tx.helpdeskSwap.findUnique({
        where: { id: swapId },
        include: { shift: { include: { assignees: true } }, offeredBy: true },
      });
      if (!swap) throw new NotFoundException('Swap offer not found');
      if (swap.status !== SwapStatus.OPEN)
        throw new BadRequestException('Swap offer not available');
      if (swap.offeredByUserId === user.id)
        throw new BadRequestException('Cannot accept own offer');

      // Logic: Replace logic (Swap only happens if strict capacity of 2? Prompt "Když slot už má 2, swap jen jako výměna (replace)". If < 2, technically could be add, but swap implies replace).
      // The prompt says "po accept se přepíše obsazení slotu (původní student odebrán, nový přidán)". This means ALWAYS REPLACE.

      // 1. Remove Offerer
      await tx.helpdeskShiftAssignee.delete({
        where: {
          shiftId_userId: {
            shiftId: swap.shiftId,
            userId: swap.offeredByUserId,
          },
        },
      });

      // 2. Add Accepter (User)
      // Ensure user not already assigned?
      if (swap.shift.assignees.some((a) => a.userId === user.id)) {
        throw new BadRequestException('You are already assigned to this shift');
      }

      await tx.helpdeskShiftAssignee.create({
        data: {
          shiftId: swap.shiftId,
          userId: user.id,
        },
      });

      // 3. Update Swap
      const updatedSwap = await tx.helpdeskSwap.update({
        where: { id: swapId },
        data: {
          status: SwapStatus.ACCEPTED,
          acceptedByUserId: user.id,
          decidedAt: new Date(),
        },
      });

      // 4. Notifications

      // A) Notify Offerer (Author)
      await this.notificationsService.create({
        userId: swap.offeredByUserId,
        type: NotificationType.SWAP_OFFER_ACCEPTED,
        title: 'Tvoje nabídka výměny byla přijata!',
        body: `Tvou nabídku na ${swap.shift.date} přijal(a) ${user.fullName}.`,
        linkUrl: '/dashboard/planning',
        metadata: { swapId },
      });

      // B) Notify Accepter (User)
      await this.notificationsService.create({
        userId: user.id,
        type: NotificationType.SWAP_OFFER_ACCEPTED, // Or distinct type
        title: 'Výměna potvrzena',
        body: `Úspěšně jsi přijal(a) výměnu služby na ${swap.shift.date}.`,
        linkUrl: '/dashboard/planning',
        metadata: { swapId },
      });

      // C) Notify Admin
      const admins = await this.prisma.user.findMany({
        where: { role: Role.ADMIN },
      });
      for (const admin of admins) {
        await this.notificationsService.create({
          userId: admin.id,
          type: NotificationType.SWAP_OFFER_ACCEPTED, // Or SWAP_COMPLETED_ADMIN
          title: 'Proběhla výměna služby',
          body: `${swap.offeredBy.fullName} ↔ ${user.fullName}, ${swap.shift.date} – ${swap.shift.lesson}. hod`,
          linkUrl: '/dashboard/admin/audit', // Or planning
          metadata: { swapId },
        });
      }

      // 5. Audit
      await this.auditService.log({
        actorUserId: user.id,
        actorRole: user.role,
        actorName: user.fullName,
        entityType: AuditEntityType.SWAP,
        entityId: swapId,
        action: AuditAction.SWAP_ACCEPTED,
        message: `Swap accepted by ${user.fullName}`,
        after: { acceptedBy: user.id },
      });

      return updatedSwap;
    });
  }

  async cancelOffer(user: User, swapId: string) {
    const swap = await this.prisma.helpdeskSwap.findUnique({
      where: { id: swapId },
    });
    if (!swap) throw new NotFoundException();

    // Owner or Admin
    if (user.role !== Role.ADMIN && swap.offeredByUserId !== user.id) {
      throw new ForbiddenException();
    }

    if (swap.status !== SwapStatus.OPEN)
      throw new BadRequestException('Can only cancel OPEN offers');

    const updated = await this.prisma.helpdeskSwap.update({
      where: { id: swapId },
      data: { status: SwapStatus.CANCELLED, decidedAt: new Date() },
    });

    // Notify Owner (Author) about cancellation
    // "Pokud zrušil autor: notify jen autor (info „nabídka zrušena“)"
    // "Pokud zrušil admin: notify jen autor"
    // So always notify the original offeredByUserId.
    await this.notificationsService.create({
      userId: swap.offeredByUserId,
      type: NotificationType.SWAP_OFFER_CANCELLED, // Or generic
      title: 'Nabídka výměny zrušena',
      body: 'Tvoje nabídka na výměnu služby byla zrušena.',
      linkUrl: '/dashboard/planning',
      metadata: { swapId },
    });

    await this.auditService.log({
      actorUserId: user.id,
      actorRole: user.role,
      actorName: user.fullName,
      entityType: AuditEntityType.SWAP,
      entityId: swapId,
      action: AuditAction.SWAP_CANCELLED,
      message: 'Swap offer cancelled',
    });

    return updated;
  }

  async listOffers(weekStart?: string) {
    // Logic to filter by week if needed, or return all OPEN
    // For now returning all OPEN future offers
    return this.prisma.helpdeskSwap.findMany({
      where: {
        status: SwapStatus.OPEN,
        shift: {
          date: { gte: new Date().toISOString().split('T')[0] }, // Future only
        },
      },
      include: {
        shift: true,
        offeredBy: { select: { fullName: true, id: true } },
      },
      orderBy: { shift: { date: 'asc' } },
    });
  }
}
