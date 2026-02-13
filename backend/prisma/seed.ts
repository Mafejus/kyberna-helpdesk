import 'dotenv/config';
import { PrismaClient, Role, TicketStatus, Priority } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🗑️ Cleaning database...');
  // Delete in order of dependencies (child first)
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.helpdeskCheckIn.deleteMany();
  await prisma.helpdeskSwap.deleteMany();
  await prisma.helpdeskShift.deleteMany();
  await prisma.ticket.deleteMany(); // Deletes relations (assignees) via cascade if configured, but safe to delete relations first if not
  await prisma.classroomPc.deleteMany();
  await prisma.pcProperty.deleteMany();
  await prisma.classroom.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Database cleaned.');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('password', saltRounds);

  // 1. Users
  console.log('🌱 Seeding Users...');
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ssakhk.cz',
      fullName: 'Hlavní Administrátor',
      role: Role.ADMIN,
      passwordHash,
    },
  });

  const teacher = await prisma.user.create({
    data: {
      email: 'ucitel@ssakhk.cz',
      fullName: 'Pan Učitel',
      role: Role.TEACHER,
      passwordHash,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'matej.geralsky@ssakhk.cz',
      fullName: 'Matej Geralsky',
      role: Role.STUDENT,
      passwordHash,
    },
  });

  // 2. Classrooms
  console.log('🌱 Seeding Classrooms...');
  const classroom320 = await prisma.classroom.create({
    data: { code: '320' }
  });

  const classroom205 = await prisma.classroom.create({
    data: { code: '205' }
  });

  // 3. Tickets (Minimal)
  console.log('🌱 Seeding Tickets...');
  
  await prisma.ticket.create({
    data: {
      title: 'Nefunkční projektor',
      description: 'Projektor v učebně 320 nesvítí.',
      status: TicketStatus.UNASSIGNED,
      priority: Priority.HIGH,
      createdById: teacher.id,
      classroomId: classroom320.id,
    }
  });

  await prisma.ticket.create({
    data: {
      title: 'Instalace VS Code',
      description: 'Prosím o instalaci na všech PC.',
      status: TicketStatus.IN_PROGRESS,
      priority: Priority.NORMAL,
      createdById: teacher.id,
      classroomId: classroom320.id,
      assignees: {
        create: [{ userId: student.id, orderIndex: 1 }]
      }
    }
  });

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
