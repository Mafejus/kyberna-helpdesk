import { PrismaClient, Role, TicketStatus, Priority } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  // Unified password for all: "password"
  const passwordHash = await bcrypt.hash('password', saltRounds);

  // 1. Users
  console.log('Seeding Users...');
  
  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ssakhk.cz' },
    update: { 
      passwordHash 
    },
    create: {
      email: 'admin@ssakhk.cz',
      fullName: 'Hlavní Administrátor',
      role: Role.ADMIN,
      passwordHash,
    },
  });

  // Teachers
  const teachersData = [
    { email: 'milan.hlousek@ssakhk.cz', name: 'Milan Hlousek' },
    { email: 'mia.duchackova@ssakhk.cz', name: 'Mia Duchackova' },
    { email: 'jan.lang@ssakhk.cz', name: 'Jan Lang' },
  ];

  const teachers = [];
  for (const tData of teachersData) {
    const t = await prisma.user.upsert({
      where: { email: tData.email },
      update: { passwordHash },
      create: {
        email: tData.email,
        fullName: tData.name,
        role: Role.TEACHER,
        passwordHash,
      },
    });
    teachers.push(t);
  }

  // Students
  const studentsData = [
    { email: 'matej.geralsky@ssakhk.cz', name: 'Matej Geralsky' },
    { email: 'lucian.vondra@ssakhk.cz', name: 'Lucian Vondra' },
    // Add a few generic ones to fill leaderboard
    { email: 'adam.novak@ssakhk.cz', name: 'Adam Novak' },
    { email: 'petr.svoboda@ssakhk.cz', name: 'Petr Svoboda' },
    { email: 'jana.kralova@ssakhk.cz', name: 'Jana Kralova' },
  ];

  const students = [];
  for (const sData of studentsData) {
    const s = await prisma.user.upsert({
      where: { email: sData.email },
      update: { passwordHash },
      create: {
        email: sData.email,
        fullName: sData.name,
        role: Role.STUDENT,
        passwordHash,
      },
    });
    students.push(s);
  }

  // 2. Classrooms
  console.log('Seeding Classrooms...');
  const classroomCodes = ['205', '206', '213', '215', '302', '320', '406', '202']; // Added 202
  const classrooms = [];
  for (const code of classroomCodes) {
    const c = await prisma.classroom.upsert({
      where: { code },
      update: {},
      create: { code },
    });
    classrooms.push(c);
    
    // Seed PCs for 320, 302, 202
    // Seed PCs for 320, 302, 202
    if (['320', '302', '202'].includes(code)) {
        // Define Properties per classroom
        const properties = [];
        if (code === '320') {
            properties.push(
                { key: 'office', label: 'Office', type: 'BOOLEAN', order: 1 },
                { key: 'adobe', label: 'Adobe', type: 'BOOLEAN', order: 2 },
                { key: 'cloned', label: 'Zklonováno', type: 'BOOLEAN', order: 3 },
                { key: 'imageMoved', label: 'Image přesunutý', type: 'BOOLEAN', order: 4 },
                { key: 'inDomain', label: 'Je v doméně', type: 'BOOLEAN', order: 5 },
                // "Jine" is usually the 'note' field on PC itself, or can be a text property. 
                // Requirement says "poslední sloupec Jiné/Poznámka (note)". 
                // Note is built-in. If "Jiné" was a property, we'd add it here.
            );
        } else if (code === '302') {
             properties.push(
                { key: 'office', label: 'Office', type: 'BOOLEAN', order: 1 },
                { key: 'cloned', label: 'Zklonováno', type: 'BOOLEAN', order: 2 },
                { key: 'inDomain', label: 'Je v doméně', type: 'BOOLEAN', order: 3 },
            );
        } else if (code === '202') {
            properties.push(
                { key: 'cloned', label: 'Zklonováno', type: 'BOOLEAN', order: 1 },
                { key: 'inDomain', label: 'Je v doméně', type: 'BOOLEAN', order: 2 },
            );
        }

        // Create Properties
        for (const prop of properties) {
            await prisma.pcProperty.upsert({
                where: { classroomId_key: { classroomId: c.id, key: prop.key } },
                update: {},
                create: {
                    classroomId: c.id,
                    key: prop.key,
                    label: prop.label,
                    type: prop.type as any,
                    order: prop.order
                }
            });
        }

        const pcCount = await prisma.classroomPc.count({ where: { classroomId: c.id } });
        if (pcCount === 0) {
            console.log(`Generating PCs for ${code}...`);
            const pcs = [];
            for (let i = 1; i <= 30; i++) {
                pcs.push({
                    classroomId: c.id,
                    label: i.toString(),
                    note: null,
                });
            }
            await prisma.classroomPc.createMany({ data: pcs });
        }
    }
  }

  // 3. Tickets
  console.log('Seeding Tickets...');

  // Helper to create ticket (upsert-like logic check)
  const createTicket = async (title, status, author, classroom, assignees = [], priority: Priority = Priority.NORMAL, difficultyPoints = null, workNote = null, approvalNote = null) => {
    // Check if ticket with same title exists for this classroom/author to avoid duplicates in dev
    const existing = await prisma.ticket.findFirst({
        where: {
            title,
            classroomId: classroom.id,
            createdById: author.id
        }
    });

    if (existing) {
        console.log(`Ticket "${title}" already exists. Skipping.`);
        return existing;
    }

    return prisma.ticket.create({
      data: {
        title,
        description: `Toto je testovací ticket: ${title}`,
        status,
        priority,
        createdById: author.id,
        classroomId: classroom.id,
        difficultyPoints,
        studentWorkNote: workNote,
        adminApprovalNote: approvalNote,
        assignees: {
          create: assignees.map((userId, index) => ({
            userId,
            orderIndex: index + 1
          }))
        }
      }
    });
  };

  // UNASSIGNED
  if (dealwith(classrooms, 0, teachers, 0)) {
     await createTicket('Nefunkční projektor', TicketStatus.UNASSIGNED, teachers[0], classrooms[0], [], Priority.HIGH);
  }
  if (dealwith(classrooms, 1, teachers, 1)) {
     await createTicket('Chybějící kabel HDMI', TicketStatus.UNASSIGNED, teachers[1], classrooms[1]);
  }

  // IN_PROGRESS
  if (dealwith(classrooms, 2, teachers, 2, students, 0)) {
    await createTicket('Instalace VS Code', TicketStatus.IN_PROGRESS, teachers[2], classrooms[2], [students[0].id]);
  }
  if (dealwith(classrooms, 3, teachers, 0, students, 1)) {
    await createTicket('Výměna myši', TicketStatus.IN_PROGRESS, teachers[0], classrooms[3], [students[1].id, students[2].id]);
  }

  // DONE_WAITING_APPROVAL
  if (dealwith(classrooms, 4, teachers, 1, students, 0)) {
    await createTicket('Reinstalace PC', TicketStatus.DONE_WAITING_APPROVAL, teachers[1], classrooms[4], [students[0].id], Priority.NORMAL, null, 'Reinstalace provedena, ovladače nainstalovány.');
  }
  if (dealwith(classrooms, 5, teachers, 2, students, 3)) {
    await createTicket('Oprava sítě', TicketStatus.DONE_WAITING_APPROVAL, teachers[2], classrooms[5], [students[3].id], Priority.CRITICAL, null, 'Kabel byl překousnutý, vyměněn.');
  }

  // APPROVED
  if (dealwith(classrooms, 6, teachers, 0, students, 1)) {
    await createTicket('Aktualizace učebny', TicketStatus.APPROVED, teachers[0], classrooms[6], [students[1].id], Priority.NORMAL, 5, 'Vše hotovo.', 'Super práce, díky.');
  }
  
  // REJECTED
  if (dealwith(classrooms, 0, teachers, 1, students, 2)) {
    await createTicket('Úklid kabinetu', TicketStatus.REJECTED, teachers[1], classrooms[0], [students[2].id], Priority.NORMAL, null, 'Uklizeno.', 'Úklid není IT support úkol.');
  }

  // 4. Helpdesk Shifts
  console.log('Seeding Helpdesk Shifts (current week)...');
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const dateToday = formatDate(today);
  const dateTomorrow = formatDate(tomorrow);

  // Helper to create shift with assignees
  const createShift = async (date: string, lesson: number, studentEmails: string[] = []) => {
    // Find users
    const assignees = [];
    for (const email of studentEmails) {
      const u = students.find(s => s.email === email);
      if (u) assignees.push(u);
    }

    return prisma.helpdeskShift.upsert({
      where: {
        date_lesson: {
          date,
          lesson,
        },
      },
      update: {}, // Do nothing if exists
      create: {
        date,
        lesson,
        assignees: {
          create: assignees.map(u => ({
            userId: u.id
          }))
        }
      }
    });
  };

  // Only seed if we actually have student objects loaded
  if (students.length >= 2) {
    // Today: Lesson 2 (1 student)
    await createShift(dateToday, 2, [students[0].email]);
    
    // Tomorrow: Lesson 3 (2 students - FULL)
    await createShift(dateTomorrow, 3, [students[0].email, students[1].email]);

    // Tomorrow: Lesson 5 (Empty)
    await createShift(dateTomorrow, 5, []);
  }

  // 5. Helpdesk Swaps (Demo)
  console.log('Seeding Swap Offers...');
  if (students.length >= 2) {
    // Student 0 offers their shift tomorrow (Lesson 3)
    // First, find the shift
    const shiftTomorrow3 = await prisma.helpdeskShift.findUnique({
        where: { date_lesson: { date: dateTomorrow, lesson: 3 } }
    });
    
    if (shiftTomorrow3) {
        await prisma.helpdeskSwap.create({
            data: {
                shiftId: shiftTomorrow3.id,
                offeredByUserId: students[0].id,
                status: 'OPEN', // Enum uses string in Prisma types usually or imported enum
            }
        });
    }
  }

  // 6. Check-ins (History Demo)
  console.log('Seeding Check-ins...');
  // Create a past shift for yesterday to have a completed check-in
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dateYesterday = formatDate(yesterday);
  
  const shiftYesterday = await createShift(dateYesterday, 4, [students[0].email]);
  
  await prisma.helpdeskCheckIn.create({
      data: {
          shiftId: shiftYesterday.id,
          userId: students[0].id,
          startedAt: new Date(yesterday.setHours(10, 0, 0)),
          endedAt: new Date(yesterday.setHours(10, 45, 0)),
      }
  });

  // 7. Notifications (Demo)
  console.log('Seeding Notifications...');
  await prisma.notification.create({
      data: {
          userId: students[0].id,
          type: 'TICKET_APPROVED',
          title: 'Váš ticket byl schválen',
          body: 'Ticket "Nefunkční projektor" byl schválen a máš za něj 5 bodů.',
          linkUrl: '/dashboard/tickets/123456789', // Dummy ID
          readAt: null // Unread
      }
  });

  // 8. Audit Logs (Demo)
  console.log('Seeding Audit Logs...');
  await prisma.auditLog.create({
      data: {
          actorUserId: admin.id,
          actorRole: 'ADMIN',
          actorName: admin.fullName,
          entityType: 'USER',
          entityId: students[0].id,
          action: 'USER_UPDATED',
          message: 'Admin changed user email.',
          before: { email: 'old@test.cz' },
          after: { email: students[0].email }
      }
  });

  console.log('Seeding finished.');
}

function dealwith(classrooms, c, teachers, t, students = [], s = -1) {
    return classrooms[c] && teachers[t] && (s === -1 || students[s]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
