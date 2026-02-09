"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password', saltRounds);
    console.log('Seeding Users...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ssakhk.cz' },
        update: {
            passwordHash
        },
        create: {
            email: 'admin@ssakhk.cz',
            fullName: 'Hlavní Administrátor',
            role: client_1.Role.ADMIN,
            passwordHash,
        },
    });
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
                role: client_1.Role.TEACHER,
                passwordHash,
            },
        });
        teachers.push(t);
    }
    const studentsData = [
        { email: 'matej.geralsky@ssakhk.cz', name: 'Matej Geralsky' },
        { email: 'lucian.vondra@ssakhk.cz', name: 'Lucian Vondra' },
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
                role: client_1.Role.STUDENT,
                passwordHash,
            },
        });
        students.push(s);
    }
    console.log('Seeding Classrooms...');
    const classroomCodes = ['205', '206', '213', '215', '302', '320', '406', '202'];
    const classrooms = [];
    for (const code of classroomCodes) {
        const c = await prisma.classroom.upsert({
            where: { code },
            update: {},
            create: { code },
        });
        classrooms.push(c);
        if (['320', '302', '202'].includes(code)) {
            const properties = [];
            if (code === '320') {
                properties.push({ key: 'office', label: 'Office', type: 'BOOLEAN', order: 1 }, { key: 'adobe', label: 'Adobe', type: 'BOOLEAN', order: 2 }, { key: 'cloned', label: 'Zklonováno', type: 'BOOLEAN', order: 3 }, { key: 'imageMoved', label: 'Image přesunutý', type: 'BOOLEAN', order: 4 }, { key: 'inDomain', label: 'Je v doméně', type: 'BOOLEAN', order: 5 });
            }
            else if (code === '302') {
                properties.push({ key: 'office', label: 'Office', type: 'BOOLEAN', order: 1 }, { key: 'cloned', label: 'Zklonováno', type: 'BOOLEAN', order: 2 }, { key: 'inDomain', label: 'Je v doméně', type: 'BOOLEAN', order: 3 });
            }
            else if (code === '202') {
                properties.push({ key: 'cloned', label: 'Zklonováno', type: 'BOOLEAN', order: 1 }, { key: 'inDomain', label: 'Je v doméně', type: 'BOOLEAN', order: 2 });
            }
            for (const prop of properties) {
                await prisma.pcProperty.upsert({
                    where: { classroomId_key: { classroomId: c.id, key: prop.key } },
                    update: {},
                    create: {
                        classroomId: c.id,
                        key: prop.key,
                        label: prop.label,
                        type: prop.type,
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
    console.log('Seeding Tickets...');
    const createTicket = async (title, status, author, classroom, assignees = [], priority = client_1.Priority.NORMAL, difficultyPoints = null, workNote = null, approvalNote = null) => {
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
    if (dealwith(classrooms, 0, teachers, 0)) {
        await createTicket('Nefunkční projektor', client_1.TicketStatus.UNASSIGNED, teachers[0], classrooms[0], [], client_1.Priority.HIGH);
    }
    if (dealwith(classrooms, 1, teachers, 1)) {
        await createTicket('Chybějící kabel HDMI', client_1.TicketStatus.UNASSIGNED, teachers[1], classrooms[1]);
    }
    if (dealwith(classrooms, 2, teachers, 2, students, 0)) {
        await createTicket('Instalace VS Code', client_1.TicketStatus.IN_PROGRESS, teachers[2], classrooms[2], [students[0].id]);
    }
    if (dealwith(classrooms, 3, teachers, 0, students, 1)) {
        await createTicket('Výměna myši', client_1.TicketStatus.IN_PROGRESS, teachers[0], classrooms[3], [students[1].id, students[2].id]);
    }
    if (dealwith(classrooms, 4, teachers, 1, students, 0)) {
        await createTicket('Reinstalace PC', client_1.TicketStatus.DONE_WAITING_APPROVAL, teachers[1], classrooms[4], [students[0].id], client_1.Priority.NORMAL, null, 'Reinstalace provedena, ovladače nainstalovány.');
    }
    if (dealwith(classrooms, 5, teachers, 2, students, 3)) {
        await createTicket('Oprava sítě', client_1.TicketStatus.DONE_WAITING_APPROVAL, teachers[2], classrooms[5], [students[3].id], client_1.Priority.CRITICAL, null, 'Kabel byl překousnutý, vyměněn.');
    }
    if (dealwith(classrooms, 6, teachers, 0, students, 1)) {
        await createTicket('Aktualizace učebny', client_1.TicketStatus.APPROVED, teachers[0], classrooms[6], [students[1].id], client_1.Priority.NORMAL, 5, 'Vše hotovo.', 'Super práce, díky.');
    }
    if (dealwith(classrooms, 0, teachers, 1, students, 2)) {
        await createTicket('Úklid kabinetu', client_1.TicketStatus.REJECTED, teachers[1], classrooms[0], [students[2].id], client_1.Priority.NORMAL, null, 'Uklizeno.', 'Úklid není IT support úkol.');
    }
    console.log('Seeding Helpdesk Shifts (current week)...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formatDate = (d) => d.toISOString().split('T')[0];
    const dateToday = formatDate(today);
    const dateTomorrow = formatDate(tomorrow);
    const createShift = async (date, lesson, studentEmails = []) => {
        const assignees = [];
        for (const email of studentEmails) {
            const u = students.find(s => s.email === email);
            if (u)
                assignees.push(u);
        }
        return prisma.helpdeskShift.upsert({
            where: {
                date_lesson: {
                    date,
                    lesson,
                },
            },
            update: {},
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
    if (students.length >= 2) {
        await createShift(dateToday, 2, [students[0].email]);
        await createShift(dateTomorrow, 3, [students[0].email, students[1].email]);
        await createShift(dateTomorrow, 5, []);
    }
    console.log('Seeding Swap Offers...');
    if (students.length >= 2) {
        const shiftTomorrow3 = await prisma.helpdeskShift.findUnique({
            where: { date_lesson: { date: dateTomorrow, lesson: 3 } }
        });
        if (shiftTomorrow3) {
            await prisma.helpdeskSwap.create({
                data: {
                    shiftId: shiftTomorrow3.id,
                    offeredByUserId: students[0].id,
                    status: 'OPEN',
                }
            });
        }
    }
    console.log('Seeding Check-ins...');
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
    console.log('Seeding Notifications...');
    await prisma.notification.create({
        data: {
            userId: students[0].id,
            type: 'TICKET_APPROVED',
            title: 'Váš ticket byl schválen',
            body: 'Ticket "Nefunkční projektor" byl schválen a máš za něj 5 bodů.',
            linkUrl: '/dashboard/tickets/123456789',
            readAt: null
        }
    });
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
//# sourceMappingURL=seed.js.map