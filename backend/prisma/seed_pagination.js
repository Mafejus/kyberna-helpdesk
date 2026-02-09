"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting pagination seed...');
    const teacher = await prisma.user.findFirst({ where: { role: client_1.Role.TEACHER } }) || await prisma.user.findFirst();
    const classroom = await prisma.classroom.findFirst();
    if (!teacher || !classroom) {
        console.error('Need at least one user and classroom to seed tickets.');
        return;
    }
    console.log('Seeding 60 tickets...');
    const ticketsData = [];
    for (let i = 0; i < 60; i++) {
        ticketsData.push({
            title: `Pagination Test Ticket ${i + 1}`,
            description: `Description for ticket ${i + 1}.`,
            status: client_1.TicketStatus.UNASSIGNED,
            priority: client_1.Priority.NORMAL,
            classroomId: classroom.id,
            createdById: teacher.id,
            createdAt: new Date(Date.now() - i * 1000000),
            dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
    }
    await prisma.ticket.createMany({ data: ticketsData });
    console.log('Tickets seeded.');
    console.log('Seeding 100 Audit Logs...');
    const auditData = [];
    for (let i = 0; i < 100; i++) {
        auditData.push({
            actorUserId: teacher.id,
            actorRole: teacher.role,
            actorName: teacher.fullName,
            entityType: client_1.AuditEntityType.TICKET,
            entityId: (0, uuid_1.v4)(),
            action: client_1.AuditAction.TICKET_CREATED,
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
//# sourceMappingURL=seed_pagination.js.map