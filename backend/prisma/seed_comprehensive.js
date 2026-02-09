"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
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
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
async function main() {
    console.log('🌱 Starting comprehensive seed...');
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
    const teachers = await prisma.user.findMany({ where: { role: client_1.Role.TEACHER } });
    const students = await prisma.user.findMany({ where: { role: client_1.Role.STUDENT } });
    const admins = await prisma.user.findMany({ where: { role: client_1.Role.ADMIN } });
    if (teachers.length === 0 || students.length === 0) {
        console.log('⚠️ Warning: Not enough users found. Please run basic seed first.');
    }
    const allUsers = [...teachers, ...students, ...admins];
    if (allUsers.length === 0) {
        console.error('❌ No users found. Aborting.');
        return;
    }
    const authors = teachers.length > 0 ? teachers : allUsers;
    const assigneesPool = students.length > 0 ? students : allUsers;
    console.log('🎫 Generating 200 tickets...');
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const ticketsToCreate = [];
    const auditLogsToCreate = [];
    for (let i = 0; i < 30; i++) {
        const createdAt = randomDate(sixMonthsAgo, now);
        const dueAt = new Date(createdAt);
        dueAt.setDate(createdAt.getDate() + randomInt(1, 14));
        const rand = Math.random();
        let status = client_1.TicketStatus.APPROVED;
        if (rand > 0.9)
            status = client_1.TicketStatus.UNASSIGNED;
        else if (rand > 0.8)
            status = client_1.TicketStatus.IN_PROGRESS;
        else if (rand > 0.7)
            status = client_1.TicketStatus.DONE_WAITING_APPROVAL;
        else if (rand > 0.6)
            status = client_1.TicketStatus.REJECTED;
        const author = randomItem(authors);
        const classroom = randomItem(classrooms);
        const title = randomItem(ISSUES);
        const priority = Math.random() > 0.9 ? client_1.Priority.CRITICAL : (Math.random() > 0.7 ? client_1.Priority.HIGH : client_1.Priority.NORMAL);
        let assignees = [];
        if (status !== client_1.TicketStatus.UNASSIGNED) {
            const u1 = randomItem(assigneesPool);
            assignees.push(u1);
            if (Math.random() > 0.9) {
                let u2 = randomItem(assigneesPool);
                if (u2.id !== u1.id)
                    assignees.push(u2);
            }
        }
        let studentWorkNote = null;
        let adminApprovalNote = null;
        let difficultyPoints = null;
        if (['DONE_WAITING_APPROVAL', 'APPROVED', 'REJECTED'].includes(status)) {
            studentWorkNote = randomItem(COMMENTS_STUDENT);
        }
        if (['APPROVED', 'REJECTED'].includes(status)) {
            adminApprovalNote = randomItem(COMMENTS_ADMIN);
            if (status === 'APPROVED')
                difficultyPoints = randomInt(1, 5);
        }
        const ticketId = (0, uuid_1.v4)();
        auditLogsToCreate.push({
            actorUserId: author.id,
            actorRole: author.role,
            actorName: author.fullName,
            entityType: client_1.AuditEntityType.TICKET,
            entityId: ticketId,
            action: client_1.AuditAction.TICKET_CREATED,
            message: `Vytvořen ticket: ${title}`,
            createdAt: createdAt
        });
        if (status === 'APPROVED' || status === 'REJECTED') {
            const resolver = assignees[0] || author;
            const approver = admins.length > 0 ? admins[0] : author;
            const workDate = new Date(createdAt);
            workDate.setHours(createdAt.getHours() + randomInt(1, 48));
            if (workDate < now) {
                auditLogsToCreate.push({
                    actorUserId: resolver.id,
                    actorRole: resolver.role,
                    actorName: resolver.fullName,
                    entityType: client_1.AuditEntityType.TICKET,
                    entityId: ticketId,
                    action: client_1.AuditAction.TICKET_STATUS_CHANGED,
                    message: `Stav změněn na DONE_WAITING_APPROVAL`,
                    createdAt: workDate
                });
            }
            const approveDate = new Date(workDate);
            approveDate.setHours(workDate.getHours() + randomInt(1, 24));
            if (approveDate < now) {
                auditLogsToCreate.push({
                    actorUserId: approver.id,
                    actorRole: approver.role,
                    actorName: approver.fullName,
                    entityType: client_1.AuditEntityType.TICKET,
                    entityId: ticketId,
                    action: status === 'APPROVED' ? client_1.AuditAction.TICKET_APPROVED : client_1.AuditAction.TICKET_REJECTED,
                    message: adminApprovalNote || `Ticket ${status}`,
                    createdAt: approveDate
                });
            }
        }
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
                updatedAt: createdAt,
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
        if (i % 20 === 0)
            process.stdout.write('.');
    }
    console.log('\n✅ Tickets created.');
    console.log('📅 Generating Attendance (Shifts & Check-ins)...');
    const dayIterator = new Date(sixMonthsAgo);
    while (dayIterator < now) {
        if (Math.random() > 0.3) {
            const dateStr = dayIterator.toISOString().split('T')[0];
            const shiftsCount = randomInt(1, 2);
            for (let s = 0; s < shiftsCount; s++) {
                const lesson = randomInt(1, 8);
                try {
                    const shift = await prisma.helpdeskShift.create({
                        data: {
                            date: dateStr,
                            lesson: lesson
                        }
                    });
                    const shiftAssignees = [];
                    const s1 = randomItem(assigneesPool);
                    shiftAssignees.push(s1);
                    if (Math.random() > 0.8) {
                        const s2 = randomItem(assigneesPool);
                        if (s2.id !== s1.id)
                            shiftAssignees.push(s2);
                    }
                    await prisma.helpdeskShiftAssignee.createMany({
                        data: shiftAssignees.map(user => ({
                            shiftId: shift.id,
                            userId: user.id
                        }))
                    });
                    if (dayIterator < now) {
                        for (const assignee of shiftAssignees) {
                            if (Math.random() < 0.8) {
                                const baseTime = new Date(dayIterator);
                                baseTime.setHours(8 + lesson, 0, 0);
                                const startedAt = new Date(baseTime);
                                startedAt.setMinutes(startedAt.getMinutes() + randomInt(-5, 10));
                                const endedAt = new Date(baseTime);
                                endedAt.setMinutes(endedAt.getMinutes() + 45);
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
                }
                catch (e) {
                }
            }
        }
        dayIterator.setDate(dayIterator.getDate() + 1);
    }
    console.log('✅ Attendance created.');
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
//# sourceMappingURL=seed_comprehensive.js.map