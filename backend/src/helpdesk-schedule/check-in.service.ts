import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { User, Role, AuditAction, AuditEntityType } from '@prisma/client';
import { LESSON_TIMES } from '../common/constants';

@Injectable()
export class CheckInService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService
  ) {}

  async startCheckIn(user: User, date: string, lesson: number) {
    if (user.role !== Role.STUDENT) {
        throw new ForbiddenException('Only students can check-in');
    }

    // 1. Find shift
    const shift = await this.prisma.helpdeskShift.findUnique({
        where: { date_lesson: { date, lesson } },
        include: { assignees: true }
    });

    if (!shift) throw new NotFoundException('Shift not found');

    // 2. Verify assignment
    if (!shift.assignees.some(a => a.userId === user.id)) {
        throw new ForbiddenException('You are not assigned to this shift');
    }

    // 3. Verify check-in time (15 minute rule)
    const times = LESSON_TIMES[lesson];
    if (!times) throw new BadRequestException('Invalid lesson');

    // Parse Lesson Start/End as Prague Time
    // We assume 'date' is YYYY-MM-DD. 'times.start' is HH:mm.
    // We want to create a Date object that corresponds to that Wall Clock time in Prague.
    const parsePragueTime = (dateStr: string, timeStr: string) => {
        // Create an ISO string with Prague offset lookup? 
        // Or cleaner: use Intl to find the offset for that date, or easier: assume server is UTC and shift?
        // Let's use a robust method: Construct a string that `new Date()` parses as Local, but we want Prague.
        // Actually, we can use a library if available, but let's stick to native JS.
        
        // Hack: Create a date as UTC, then adjust by the difference between UTC-wallclock and Prague-wallclock?
        // Better: Use Intl to format a reference date to parts in Prague, compare, and adjust.
        // BUT simplest for now without libraries:
        // Use 'Europe/Prague' formatter.
        
        // We need to compare 'now' (Server Time) with 'Lesson Start' (Prague Time).
        // Let's convert 'now' to Prague Wall Clock Time for comparison logic (e.g. 12:48), 
        // and compare it to Lesson Start Wall Clock (12:35).
        // If we do strictly relative minute comparison it's safest.
        
        const now = new Date();
        const pragueNowStr = new Intl.DateTimeFormat('en-CA', { // YYYY-MM-DD ...
            timeZone: 'Europe/Prague',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        }).format(now);
        // pragueNowStr is like "2026-02-05, 12:48:30" (depending on locale, en-CA gives ISO-ish)
        // Let's parse parts manually to be safe across node versions
        const f = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Europe/Prague',
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        });
        const parts = f.formatToParts(now);
        const get = (t: string) => parseInt(parts.find(p => p.type === t)?.value || '0');
        
        // Current Prague Wall Clock
        const pYear = get('year');
        const pMonth = get('month'); // 1-12
        const pDay = get('day');
        const pHour = get('hour');
        const pMinute = get('minute');
        
        // Lesson Target (from input date + constant time)
        const [lYear, lMonth, lDay] = dateStr.split('-').map(Number);
        const [lStartH, lStartM] = timeStr.split(':').map(Number);
        
        // Check if Date matches (if student tries to check in for different day)
        if (pYear !== lYear || pMonth !== lMonth || pDay !== lDay) {
            // It's a different day. Block?
            // "date" param is the shift date.
            // If today is 5th, shift is 5th -> OK.
            // If today is 6th, shift is 5th -> Late/Past.
            // We should compare full timestamps.
        }
        
        // Convert both to rough "Prague Minutes from Epoch" or just comparison?
        // Create UTC dates from the definition values to compare numbers.
        const nowPragueVal = new Date(Date.UTC(pYear, pMonth-1, pDay, pHour, pMinute)).getTime();
        const lessonStartVal = new Date(Date.UTC(lYear, lMonth-1, lDay, lStartH, lStartM)).getTime();
        
        return { nowPragueVal, lessonStartVal };
    };
    
    const { nowPragueVal, lessonStartVal } = parsePragueTime(date, times.start);
    const [eH, eM] = times.end.split(':').map(Number);
    // Re-parse end same way
    // Reuse date parts from date string
    const [lY, lM, lD] = date.split('-').map(Number);
    const lessonEndVal = new Date(Date.UTC(lY, lM-1, lD, eH, eM)).getTime();
    
    // 15 mins = 15 * 60 * 1000
    const allowStartVal = lessonStartVal - 15 * 60000;
    
    console.log(`[CheckIn Debug] Now: ${new Date(nowPragueVal).toISOString()} (Val: ${nowPragueVal}), Start: ${times.start} (Val: ${lessonStartVal}), Allow: ${new Date(allowStartVal).toISOString()}`);

    if (nowPragueVal < allowStartVal) {
         const diffM = Math.ceil((allowStartVal - nowPragueVal) / 60000);
         throw new BadRequestException(`Check-in možný nejdříve 15 minut před začátkem. (Za ${diffM} min)`);
    }
    if (nowPragueVal > lessonEndVal) {
         throw new BadRequestException(`Služba již skončila. (Konec: ${times.end})`);
    }

    // 4. Check duplicate
    const active = await this.prisma.helpdeskCheckIn.findFirst({
        where: { userId: user.id, shiftId: shift.id, endedAt: null }
    });
    if (active) throw new BadRequestException('Already checked in');

    const checkIn = await this.prisma.helpdeskCheckIn.create({
        data: {
            shiftId: shift.id,
            userId: user.id,
            startedAt: new Date() // ensure logged time is accurate
        }
    });

    await this.auditService.log({
        actorUserId: user.id,
        actorRole: user.role,
        actorName: user.fullName,
        entityType: AuditEntityType.SCHEDULE_SLOT,
        entityId: shift.id,
        action: AuditAction.CHECK_IN_STARTED,
        message: 'Student check-in started',
        after: { checkInId: checkIn.id }
    });

    return checkIn;
  }

  async endCheckIn(user: User, shiftId: string) {
    // Student can end their own. Admin can end anyone's.
    
    // Check active
    const active = await this.prisma.helpdeskCheckIn.findFirst({
        where: { 
            shiftId: shiftId, 
            endedAt: null,
            // If student, must be their own
            userId: user.role === Role.STUDENT ? user.id : undefined 
        },
        include: { user: true } // to get name for audit if admin ends
    });

    if (!active) throw new NotFoundException('No active check-in found');

    const endedCheckIn = await this.prisma.helpdeskCheckIn.update({
        where: { id: active.id },
        data: {
            endedAt: new Date(),
            endedByUserId: user.id
        }
    });

    await this.auditService.log({
        actorUserId: user.id,
        actorRole: user.role,
        actorName: user.fullName,
        entityType: AuditEntityType.SCHEDULE_SLOT,
        entityId: shiftId,
        action: AuditAction.CHECK_IN_ENDED,
        message: user.id === active.userId ? 'Student ended check-in' : 'Admin forced check-in end',
        after: { endedAt: endedCheckIn.endedAt, targetUser: active.user.fullName }
    });

    return endedCheckIn;
  }

  async getActiveCheckIns() {
    return this.prisma.helpdeskCheckIn.findMany({
        where: { endedAt: null },
        include: { user: { select: { id: true, fullName: true } } }
    });
  }

  async getUserActiveCheckIn(userId: string) {
      return this.prisma.helpdeskCheckIn.findFirst({
          where: { userId, endedAt: null },
          include: { 
              shift: true 
          }
      });
  }
}
