
import { PrismaClient, TicketStatus, Priority, AuditAction, AuditEntityType, Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting pagination seed...');

  // Get a teacher and a student/admin
  const teacher = await prisma.user.findFirst({ where: { role: Role.TEACHER } }) || await prisma.user.findFirst();
  const classroom = await prisma.classroom.findFirst();

  if (!teacher || !classroom) {
      console.error('Need at least one user and classroom to seed tickets.');
      return;
  }

  // Seed 60 Tickets
  console.log('Seeding 60 tickets...');
  const ticketsData = [];
  for (let i = 0; i < 60; i++) {
    ticketsData.push({
      title: `Pagination Test Ticket ${i + 1}`,
      description: `Description for ticket ${i + 1}.`,
      status: TicketStatus.UNASSIGNED,
      priority: Priority.NORMAL,
      classroomId: classroom.id,
      createdById: teacher.id,
      createdAt: new Date(Date.now() - i * 1000000), // Staggered times
      dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  }

  // Create tickets mostly one by one to correct IDs or use createMany if ID not auto-generated (Prisma usually CUID/UUID)
  // UUIDs are auto-generated. createMany is faster.
  await prisma.ticket.createMany({ data: ticketsData });
  console.log('Tickets seeded.');

  // Seed 100 Audit Logs
  console.log('Seeding 100 Audit Logs...');
  const auditData = [];
  for (let i = 0; i < 100; i++) {
      auditData.push({
          actorUserId: teacher.id,
          actorRole: teacher.role,
          actorName: teacher.fullName,
          entityType: AuditEntityType.TICKET,
          entityId: uuidv4(),
          action: AuditAction.TICKET_CREATED,
          message: `Pagination Audit Log ${i + 1}`,
          createdAt: new Date(Date.now() - i * 500000)
      });
  }
  await prisma.auditLog.createMany({ data: auditData });
  console.log('Audit Logs seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
