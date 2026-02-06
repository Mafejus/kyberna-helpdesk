import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LESSON_TIMES, ATTENDANCE_TOLERANCE } from '../common/constants';
import { Role } from '@prisma/client';

export interface AttendanceStatus {
  status: 'WORKED' | 'LATE' | 'NO_SHOW' | 'MISSING_CHECKOUT' | 'IN_PROGRESS' | 'UPCOMING';
  minutesWorked: number;
  lateByMinutes: number;
}

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private getPragueDate(date: Date = new Date()): Date {
    // Current time in Prague
    // We want a Date object that represents the same "wall clock" time as in Prague
    // but in local system time (for comparisons).
    // Actually, best to just use timestamps and proper TZ conversions.
    // But for date string comparisons (YYYY-MM-DD), we need Prague date.
    const timeZone = 'Europe/Prague';
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
    
    // Format: MM/DD/YYYY, HH:mm:ss
    const parts = formatter.formatToParts(date);
    const getPart = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value;
    
    const year = parseInt(getPart('year'));
    const month = parseInt(getPart('month')) - 1;
    const day = parseInt(getPart('day'));
    const hour = parseInt(getPart('hour'));
    const minute = parseInt(getPart('minute'));
    const second = parseInt(getPart('second'));
    
    // Attempt to construct a Date object that LOOKS like Prague time (even if stored as local/UTC)
    // This is useful for "is it 8:00 AM yet" logic where 8:00 AM is Prague time.
    return new Date(year, month, day, hour, minute, second);
  }
  
  private getLessonTimes(dateStr: string, lesson: number) {
    const times = LESSON_TIMES[lesson];
    if (!times) return null;
    
    // dateStr is YYYY-MM-DD
    // Times are HH:mm
    // We need to construct Date objects for Start and End in Prague TZ context
    // Ideally we want to compare UNIX timestamps.
    // dateStr + times.start -> ISO string in Prague Offset?
    // Let's assume input dateStr is Prague-based date.
    
    // Helper to create Date from strings assuming Prague Time
    // We can't easily do "new Date('2026-02-05T07:50:00+01:00')" without knowing offset (DST?)
    // But generally Javascript handles local. 
    // We should rely on libraries but raw JS:
    // Create UTC date then shift? No.
    
    // Let's simplify: Compare string-based times if in same day, or relative timestamps.
    // Or simpler: Construct string "YYYY-MM-DDTHH:mm:00" and append a known offset or use generic if server is UTC.
    // Server might be UTC.
    // "2026-02-05T07:50:00" as a string.
    // If we parse this as UTC, we get a timestamp.
    // If we parse current 'now' as UTC-equivalent of Prague time, we can compare.
    
    // Strategy: Convert EVERYTHING to "Prague Wall Clock Time" (as basic numbers/dates) and compare there.
    // 1. Get NOW in Prague (GetPragueDate returns a Date object where .getHours() is Prague hour).
    // 2. Parse Shift Start/End into Date objects (Year/Month/Day from shift.date, H/M from LESSON_TIMES)
    // 3. Compare.
    
    return { startStr: times.start, endStr: times.end };
  }
  
  // Reusable Status Logic
  private calculateStatus(
    shiftDate: string, // YYYY-MM-DD
    lesson: number,
    checkIn: { startedAt: Date; endedAt: Date | null } | null | undefined,
    now: Date // Prague "Wall Clock" Date
  ): AttendanceStatus {
    const times = LESSON_TIMES[lesson];
    if (!times) return { status: 'UPCOMING', minutesWorked: 0, lateByMinutes: 0 };
    
    // Parse Shift Start/End (Prague Wall Clock)
    const [sy, sm, sd] = shiftDate.split('-').map(Number);
    const [sh, smin] = times.start.split(':').map(Number);
    const [eh, emin] = times.end.split(':').map(Number);
    
    // Create Date objects treating the inputs as local time components = Prague components
    const shiftStart = new Date(sy, sm - 1, sd, sh, smin, 0);
    const shiftEnd = new Date(sy, sm - 1, sd, eh, emin, 0);
    
    // Tolerance
    const lateThreshold = new Date(shiftStart.getTime() + ATTENDANCE_TOLERANCE.LATE_MINUTES * 60000);
    const noShowThreshold = new Date(shiftStart.getTime() + ATTENDANCE_TOLERANCE.NO_SHOW_MINUTES * 60000);
    
    // Check-in times need to be converted to Prague Wall Clock too?
    // "startedAt" from Prisma is a Date object (UTC usually).
    // We need to convert that UTC timestamp to Prague Wall Clock Date.
    const toPrague = (d: Date) => this.getPragueDate(d);
    
    const checkInStart = checkIn ? toPrague(checkIn.startedAt) : null;
    const checkInEnd = checkIn?.endedAt ? toPrague(checkIn.endedAt) : null;
    
    // 1. Upcoming
    if (now < shiftStart && !checkInStart) {
        return { status: 'UPCOMING', minutesWorked: 0, lateByMinutes: 0 };
    }
    
    // 2. No Show
    // If now is past NoShow threshold AND (no checkin OR checkin started AFTER threshold)
    // Actually if checkin exists but is super late, is it No Show or Late?
    // Request says: "No-show = nemá start do 10 minut po začátku." -> implying if they come after 10m it is still No Show? 
    // Usually systems mark as No Show then.
    // And "Late = start po začátku + 5 minut".
    // So if start at +8 mins -> Late.
    // If start at +12 mins -> No Show (technically). Or just Very Late? 
    // Definition: "No-show = je naplánovaný ... ale nemá check-in start do určité tolerance."
    // So if checkin exists later, maybe we count it? 
    // But let's stick to strict definition: "Has start < 10m".
    // If they arrive after 20 mins, they technically have a start time. 
    // But the system might have already flagged them No Show.
    // We prioritize actual data: If they HAVE a checkin, they are NOT No-Show (unless rule says otherwise).
    // Let's assume: If CheckIn exists:
    //    If Start > ShiftStart + 5 -> Late
    //    Else -> Worked/In Progress
    // If No CheckIn:
    //    If Now > ShiftStart + 10 -> No Show
    //    Else -> Upcoming/In Progress waiting
    
    if (checkInStart) {
        // Calculate lateness
        const diffMs = checkInStart.getTime() - shiftStart.getTime();
        const lateMins = Math.max(0, Math.floor(diffMs / 60000));
        
        const isLate = lateMins > ATTENDANCE_TOLERANCE.LATE_MINUTES;
        
        // Worked Minutes
        // If ended: End - Start (clamped to lesson duration?)
        // Request: "diff(checkout - checkin) clamp do [0, lessonDuration]"
        // Lesson Duration
        const lessonDurationMs = shiftEnd.getTime() - shiftStart.getTime();
        const lessonDurationMins = Math.floor(lessonDurationMs / 60000);
        
        let workedMs = 0;
        
        if (checkInEnd) {
             workedMs = checkInEnd.getTime() - checkInStart.getTime();
        } else {
             // Still running or missing checkout
             if (now > shiftEnd) { // shift ended
                 // "pokud chybí checkout a shift skončil: počítej do plannedEnd"
                 // Wait, request said: "počítaj do plannedEnd" but also "označ MISSING_CHECKOUT"
                 // So we assume they worked until the end.
                 // Ideally: Worked = shiftEnd - checkInStart
                 // But wait, if they arrived late? 
                 // shiftEnd - checkInStart is correct "available time".
                 workedMs = shiftEnd.getTime() - checkInStart.getTime();
             } else {
                 // Shift is running
                 workedMs = now.getTime() - checkInStart.getTime();
             }
        }
        
        // Clamp
        if (workedMs < 0) workedMs = 0;
        if (workedMs > lessonDurationMs) workedMs = lessonDurationMs; // Clamp max to lesson duration
        
        const minutesWorked = Math.floor(workedMs / 60000);
        
        if (checkInEnd) {
             return { 
                 status: isLate ? 'LATE' : 'WORKED',
                 minutesWorked,
                 lateByMinutes: isLate ? lateMins : 0
             };
        } else {
             // No End Checkin
             if (now > shiftEnd) {
                 return {
                     status: 'MISSING_CHECKOUT',
                     minutesWorked, // Calculated as if they stayed till end
                     lateByMinutes: isLate ? lateMins : 0
                 };
             } else {
                 return {
                     status: 'IN_PROGRESS',
                     minutesWorked, // Until now
                     lateByMinutes: isLate ? lateMins : 0
                 };
             }
        }
    } else {
        // No Checkin
        if (now > noShowThreshold) {
            return { status: 'NO_SHOW', minutesWorked: 0, lateByMinutes: 0 };
        } else {
            return { status: 'UPCOMING', minutesWorked: 0, lateByMinutes: 0 };
        }
    }
  }

  // --- Endpoints ---

  async getAttendanceSummary(from: string, to: string) {
     const students = await this.prisma.user.findMany({
         where: { role: Role.STUDENT },
         include: {
             helpdeskShifts: {
                 where: {
                     shift: {
                         date: { gte: from, lte: to }
                     }
                 },
                 include: {
                     shift: {
                         include: {
                             checkIns: true // We need to match checkin to user
                         }
                     }
                 }
             }
             // We can also just query ShiftAssignees directly for better perf?
             // But iterating students ensures we list students with 0 shifts too?
             // "Vrátí list studentů s metrikami" -> probably all students.
         }
     });
     
     const now = this.getPragueDate();
     
     const summary = students.map(student => {
         let totalShifts = 0;
         let workedShifts = 0;
         let lateShifts = 0;
         let noShowShifts = 0;
         let missingCheckoutShifts = 0;
         let totalMinutesWorked = 0;
         
         // Process shifts
         for (const assignment of student.helpdeskShifts) {
             const shift = assignment.shift;
             // Find checkin for this user and this shift
             const checkIn = shift.checkIns.find(c => c.userId === student.id);
             
             const { status, minutesWorked } = this.calculateStatus(shift.date, shift.lesson, checkIn, now);
             
             totalShifts++;
             totalMinutesWorked += minutesWorked;
             
             switch (status) {
                 case 'WORKED': workedShifts++; break;
                 case 'LATE': lateShifts++; break; // "LATE" usually counts as worked too? Or separate? 
                 // Request says: "workedShifts", "lateShifts". Usually disjoint or overlapping? 
                 // "Odpracováno dnes" vs "Pozdní dnes". 
                 // Logic: If LATE, is it WORKED? Usually yes but flagged.
                 // Let's count specific buckets.
                 // "totalWorked" usually implies they showed up.
                 // Let's assume "workedShifts" = WORKED + LATE + MISSING_CHECKOUT (they were there).
                 // But strictly the prompt asks for specific fields.
                 
                 // Let's separate them:
                 // workedShifts (Pure worked?)
                 // lateShifts
                 // noShowShifts
                 // missingCheckoutShifts
                 
                 // But wait: "Admin musí vidět ... kolik odpracoval".
                 // I will make "workedShifts" be the count of non-NoShow? 
                 // Or strict status === WORKED?
                 // Let's stick to status counts for the grid, but "totalWorked" metric might combine.
                 // In the summary object I will return strict counts per status.
                 // And user can sum them up if needed.
                 
                 case 'NO_SHOW': noShowShifts++; break;
                 case 'MISSING_CHECKOUT': missingCheckoutShifts++; break;
                 case 'IN_PROGRESS': break; // Don't count as worked yet? Or do?
             }
         }
         
         const realWorkedCount = workedShifts + lateShifts + missingCheckoutShifts; // They attended
         
         return {
             id: student.id,
             fullName: student.fullName,
             email: student.email,
             totalShifts,
             workedShifts: realWorkedCount, // "worked" generally means attended
             stats: {
                 cleanWorked: workedShifts,
                 late: lateShifts,
                 noShow: noShowShifts,
                 missingCheckout: missingCheckoutShifts
             },
             totalMinutesWorked,
             reliability: totalShifts > 0 ? Math.round((realWorkedCount / totalShifts) * 100) : 100
         };
     });
     
     return summary;
  }

  async getStudentAttendance(userId: string, from?: string, to?: string) {
      const now = this.getPragueDate();
      
      const whereClause: any = { userId };
      if (from || to) {
          whereClause.shift = {
              date: {
                  gte: from,
                  lte: to
              }
          };
      }
      
      const assignments = await this.prisma.helpdeskShiftAssignee.findMany({
          where: whereClause,
          include: {
              shift: {
                  include: { checkIns: { where: { userId } } }
              }
          },
          orderBy: [
              { shift: { date: 'desc' } },
              { shift: { lesson: 'desc' } }
          ] // Newest date first, then highest lesson (evening) first
      });

      return assignments.map(a => {
          const shift = a.shift;
          const checkIn = shift.checkIns[0];
          const calc = this.calculateStatus(shift.date, shift.lesson, checkIn, now);
          
          const times = LESSON_TIMES[shift.lesson];
          
          return {
              id: shift.id,
              date: shift.date,
              lesson: shift.lesson,
              plannedStart: times?.start,
              plannedEnd: times?.end,
              checkInAt: checkIn?.startedAt || null,
              checkOutAt: checkIn?.endedAt || null,
              status: calc.status,
              minutesWorked: calc.minutesWorked,
              lateByMinutes: calc.lateByMinutes
          };
      });
  }

  async getWeekCalendar(start: string) {
      // Start is Monday YYYY-MM-DD
      // Generate 5 days
      const dates = [];
      const d = new Date(start);
      for(let i=0; i<5; i++) {
          const dateStr = new Date(d.getTime() + i * 86400000).toISOString().split('T')[0];
          dates.push(dateStr);
      }
      
      const shifts = await this.prisma.helpdeskShift.findMany({
          where: { date: { in: dates } },
          include: {
              assignees: { include: { user: true } },
              checkIns: true
          }
      });
      
      const now = this.getPragueDate();
      const result = {};
      
      for(const date of dates) {
          result[date] = {};
          for(let lesson=1; lesson<=12; lesson++) {
              const shift = shifts.find(s => s.date === date && s.lesson === lesson);
              if (shift) {
                  const assignees = shift.assignees.map(a => {
                      const checkIn = shift.checkIns.find(c => c.userId === a.userId);
                      const calc = this.calculateStatus(shift.date, shift.lesson, checkIn, now);
                      return {
                          user: { id: a.user.id, fullName: a.user.fullName },
                          status: calc.status
                      };
                  });
                  result[date][lesson] = { assignees };
              } else {
                  result[date][lesson] = { assignees: [] };
              }
          }
      }
      return result;
  }
  
  async getCurrentStatus() {
       const now = this.getPragueDate();
       const dateStr = now.toISOString().split('T')[0]; // Prague Date YYYY-MM-DD
       
       // Find current lesson
       const nowMinutes = now.getHours() * 60 + now.getMinutes();
       let currentLesson = -1;
       
       for(const [l, times] of Object.entries(LESSON_TIMES)) {
            const [sh, sm] = times.start.split(':').map(Number);
            const [eh, em] = times.end.split(':').map(Number);
            const startM = sh * 60 + sm;
            const endM = eh * 60 + em;
            
            if (nowMinutes >= startM && nowMinutes <= endM) {
                currentLesson = parseInt(l);
                break;
            }
       }
       
       let currentSlot = null;
       if (currentLesson !== -1) {
            const shift = await this.prisma.helpdeskShift.findUnique({
                where: { date_lesson: { date: dateStr, lesson: currentLesson } },
                include: { assignees: { include: { user: true } }, checkIns: true }
            });
            if (shift) {
                currentSlot = {
                    lesson: currentLesson,
                    date: dateStr,
                    users: shift.assignees.map(a => {
                        const checkIn = shift.checkIns.find(c => c.userId === a.userId);
                        return {
                            fullName: a.user.fullName,
                            hasCheckIn: !!checkIn,
                            checkInStart: checkIn?.startedAt
                        };
                    })
                };
            }
       }
       
       return { currentSlot };
  }
  
  async exportCsv(from: string, to: string) {
      const data = await this.getAttendanceSummary(from, to);
      // Generate CSV string
      const header = "Student,Email,Total Shifts,Worked Shifts,Late,No-Show,Missing Checkout,Total Minutes\n";
      const rows = data.map(d => 
          `"${d.fullName}","${d.email}",${d.totalShifts},${d.workedShifts},${d.stats.late},${d.stats.noShow},${d.stats.missingCheckout},${d.totalMinutesWorked}`
      ).join("\n");
      
      return header + rows;
  }
}
