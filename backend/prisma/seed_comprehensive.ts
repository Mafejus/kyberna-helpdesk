
import { PrismaClient, TicketStatus, Priority, Role, AuditAction, AuditEntityType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const LOCATIONS = [
  'Učebna 205', 'Učebna 206', 'Učebna 213', 'Učebna 215', 
  'Učebna 302', 'Učebna 320', 'Učebna 406', 'Kabinet IT', 
  'Sborovna', 'Ředitelna'
];

const ISSUES = [
  'Nefunkční projektor', 'Nejde zvuk', 'Pomalý internet', 'Chybí HDMI kabel',
  'Počítač se nezapne', 'Aktualizace software', 'Instalace VS Code', 
  'Problém s tiskárnou', 'Nefunguje myš', 'Klávesnice vynechává znaky',
  'Zapomenuté heslo', 'Nelze se přihlásit', 'Monitory blikají',
  'Výměna toneru', 'Vir v počítači', 'Nefunkční Wi-Fi',
  'Poškozený kabel', 'Hlučný větrák', 'Modrá smrt (BSOD)',
  'Potřeba vyčistit PC'
];

const COMMENTS_STUDENT = [
  'Opraveno, vyzkoušeno.', 'Kabel vyměněn.', 'Nainstalováno.', 
  'Byl to jen vypojený kabel.', 'Restart pomohl.', 'Vyměněno za nový kus.',
  'Vir odstraněn antivirem.', 'Toner doplněn ze skladu.',
  'Aktualizace proběhla úspěšně.', 'Vyčištěno stlačeným vzduchem.'
];

const COMMENTS_ADMIN = [
  'Díky, super práce.', 'Dobře vyřešeno.', 'Rychlá reakce, chválím.',
  'OK.', 'S tímto řešením souhlasím.', 'Výborně.', 
  'Příště prosím rychleji.', 'Díky za pomoc.'
];

// Helpers
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // 1. Ensure Classrooms
  const classrooms = [];
  for (const name of LOCATIONS) {
    const code = name.replace('Učebna ', '');
    const c = await prisma.classroom.upsert({
      where: { code },
      update: {},
      create: { code }
    });
    classrooms.push(c);
  }

  // 2. Fetch Users
  const teachers = await prisma.user.findMany({ where: { role: Role.TEACHER } });
  const students = await prisma.user.findMany({ where: { role: Role.STUDENT } });
  const admins = await prisma.user.findMany({ where: { role: Role.ADMIN } });
  
  // Create fallback users if none exist
  if (teachers.length === 0 || students.length === 0) {
      console.log('⚠️ Warning: Not enough users found. Please run basic seed first.');
      // Ideally we would create them here, but assuming basic seed ran based on previous context.
      // We will try to fetch ALL users as fallback
  }
  
  const allUsers = [...teachers, ...students, ...admins];
  if (allUsers.length === 0) {
      console.error('❌ No users found. Aborting.');
      return;
  }
  
  const authors = teachers.length > 0 ? teachers : allUsers;
  const assigneesPool = students.length > 0 ? students : allUsers;

  // 3. Generate Tickets
  console.log('🎫 Generating 200 tickets...');
  
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const ticketsToCreate = [];
  const auditLogsToCreate = [];

  // REDUCED TO 30 TICKETS
  for (let i = 0; i < 30; i++) {
    // Random timestamps
    const createdAt = randomDate(sixMonthsAgo, now);
    // Due date usually 1-14 days after creation
    const dueAt = new Date(createdAt);
    dueAt.setDate(createdAt.getDate() + randomInt(1, 14));
    
    // Determine status
    // 60% APPROVED, 10% REJECTED, 10% DONE_WAITING, 10% IN_PROGRESS, 10% UNASSIGNED
    const rand = Math.random();
    let status: TicketStatus = TicketStatus.APPROVED;
    if (rand > 0.9) status = TicketStatus.UNASSIGNED;
    else if (rand > 0.8) status = TicketStatus.IN_PROGRESS;
    else if (rand > 0.7) status = TicketStatus.DONE_WAITING_APPROVAL;
    else if (rand > 0.6) status = TicketStatus.REJECTED;

    const author = randomItem(authors);
    const classroom = randomItem(classrooms);
    const title = randomItem(ISSUES);
    const priority = Math.random() > 0.9 ? Priority.CRITICAL : (Math.random() > 0.7 ? Priority.HIGH : Priority.NORMAL);
    
    // Assignees
    let assignees = [];
    if (status !== TicketStatus.UNASSIGNED) {
        const u1 = randomItem(assigneesPool);
        assignees.push(u1);
        if (Math.random() > 0.9) {
             let u2 = randomItem(assigneesPool);
             // Simple duplicate check
             if (u2.id !== u1.id) assignees.push(u2);
        }
    }

    // Notes
    let studentWorkNote = null;
    let adminApprovalNote = null;
    let difficultyPoints = null;

    if (['DONE_WAITING_APPROVAL', 'APPROVED', 'REJECTED'].includes(status)) {
        studentWorkNote = randomItem(COMMENTS_STUDENT);
    }
    
    if (['APPROVED', 'REJECTED'].includes(status)) {
        adminApprovalNote = randomItem(COMMENTS_ADMIN);
        if (status === 'APPROVED') difficultyPoints = randomInt(1, 5);
    }

    // Prepare Ticket Data (we have to create one by one due to relations or use createMany without relations, 
    // but we need relations for assignees. So we will just use prisma.ticket.create in loop or construct a transaction)
    
    // For bulk speed, standard `create` in loop is fine for 200 items.
    
    const ticketId = uuidv4(); // Generate ID for audit log connection reference
    
    // Push promised operation to array? No, Prisma types are tricky with raw objects. 
    // We will run them in loop.
    
    // Audit Log: Ticket Created
    auditLogsToCreate.push({
        actorUserId: author.id,
        actorRole: author.role,
        actorName: author.fullName,
        entityType: AuditEntityType.TICKET,
        entityId: ticketId, // We can't easily pre-assign ID in Prisma create unless we force it, which uuid allows.
        action: AuditAction.TICKET_CREATED,
        message: `Vytvořen ticket: ${title}`,
        createdAt: createdAt
    });

    // Audit Log: Ticket Status Change (simulated for closed tickets)
    if (status === 'APPROVED' || status === 'REJECTED') {
         const resolver = assignees[0] || author; // Fallback
         const approver = admins.length > 0 ? admins[0] : author;
         
         // Log for Work Done
         const workDate = new Date(createdAt);
         workDate.setHours(createdAt.getHours() + randomInt(1, 48)); // Work done 1-48h later
         
         if (workDate < now) {
             auditLogsToCreate.push({
                actorUserId: resolver.id,
                actorRole: resolver.role,
                actorName: resolver.fullName,
                entityType: AuditEntityType.TICKET,
                entityId: ticketId,
                action: AuditAction.TICKET_STATUS_CHANGED,
                message: `Stav změněn na DONE_WAITING_APPROVAL`,
                createdAt: workDate
            });
         }

         // Log for Approval
         const approveDate = new Date(workDate);
         approveDate.setHours(workDate.getHours() + randomInt(1, 24)); // Approved 1-24h after work

         if (approveDate < now) {
            auditLogsToCreate.push({
                actorUserId: approver.id,
                actorRole: approver.role,
                actorName: approver.fullName,
                entityType: AuditEntityType.TICKET,
                entityId: ticketId,
                action: status === 'APPROVED' ? AuditAction.TICKET_APPROVED : AuditAction.TICKET_REJECTED,
                message: adminApprovalNote || `Ticket ${status}`,
                createdAt: approveDate
            });
         }
    }

    // Execute Create
    await prisma.ticket.create({
        data: {
            id: ticketId,
            title,
            description: `${title} v místnosti ${classroom.code}. Prosím o vyřešení.`,
            status,
            priority,
            classroomId: classroom.id,
            createdById: author.id,
            createdAt: createdAt,
            updatedAt: createdAt, // simplified
            dueAt: dueAt,
            difficultyPoints,
            studentWorkNote,
            adminApprovalNote,
            assignees: {
                create: assignees.map((u, idx) => ({
                    userId: u.id,
                    orderIndex: idx + 1
                }))
            }
        }
    });

    if (i % 20 === 0) process.stdout.write('.');
  }
  console.log('\n✅ Tickets created.');

  // 4. Generate Attendance (Shifts & Check-ins)
  console.log('📅 Generating Attendance (Shifts & Check-ins)...');
  
  // Iterate strictly by day for the last 6 months
  const dayIterator = new Date(sixMonthsAgo);
  
  while (dayIterator < now) {
      // 30% chance of a shift on any given day (simulating skipping weekends or empty days naturally)
      if (Math.random() > 0.3) {
          const dateStr = dayIterator.toISOString().split('T')[0];
          // Create 1-2 shifts for this day
          const shiftsCount = randomInt(1, 2);
          
          for (let s = 0; s < shiftsCount; s++) {
              const lesson = randomInt(1, 8); // Random lesson
              
              // Skip if exists (unique constraint) - simplifying by ignoring
              try {
                  const shift = await prisma.helpdeskShift.create({
                      data: {
                          date: dateStr,
                          lesson: lesson
                      }
                  });
                  
                  // Assign 1-2 students
                  const shiftAssignees = [];
                  const s1 = randomItem(assigneesPool);
                  shiftAssignees.push(s1);
                  if (Math.random() > 0.8) {
                       const s2 = randomItem(assigneesPool);
                       if (s2.id !== s1.id) shiftAssignees.push(s2);
                  }
                  
                  // Create Assignees
                  await prisma.helpdeskShiftAssignee.createMany({
                      data: shiftAssignees.map(user => ({
                          shiftId: shift.id,
                          userId: user.id
                      }))
                  });

                  // If in past, Create Check-ins
                  if (dayIterator < now) {
                      for (const assignee of shiftAssignees) {
                          // 80% attendance rate
                          if (Math.random() < 0.8) {
                               // Base time for lesson (dummy logic: 8:00 + lesson * 45m)
                               const baseTime = new Date(dayIterator);
                               baseTime.setHours(8 + lesson, 0, 0); 
                               
                               const startedAt = new Date(baseTime);
                               startedAt.setMinutes(startedAt.getMinutes() + randomInt(-5, 10)); // -5 to +10 min arrival
                               
                               const endedAt = new Date(baseTime);
                               endedAt.setMinutes(endedAt.getMinutes() + 45); // Full lesson
                               
                               await prisma.helpdeskCheckIn.create({
                                   data: {
                                       shiftId: shift.id,
                                       userId: assignee.id,
                                       startedAt: startedAt,
                                       endedAt: endedAt,
                                       note: Math.random() > 0.9 ? 'Pozdní příchod' : null
                                   }
                               });
                          }
                      }
                  }
                  
              } catch (e) {
                  // Ignore unique constraint violations for random generation
              }
          }
      }
      dayIterator.setDate(dayIterator.getDate() + 1);
  }
  console.log('✅ Attendance created.');

  // 5. Create Audit Logs Bulk
  console.log(`📜 Creating ${auditLogsToCreate.length} audit logs...`);
  await prisma.auditLog.createMany({ data: auditLogsToCreate });
  console.log('✅ Audit logs created.');

  console.log('🏁 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
