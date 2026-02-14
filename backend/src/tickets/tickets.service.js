"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var ticket_actions_dto_1 = require("./dto/ticket-actions.dto");
var fs_1 = require("fs");
var path_1 = require("path");
var TicketsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TicketsService = _classThis = /** @class */ (function () {
        function TicketsService_1(prisma, auditService, notificationsService) {
            this.prisma = prisma;
            this.auditService = auditService;
            this.notificationsService = notificationsService;
        }
        TicketsService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var ticketsWithoutDue, _i, ticketsWithoutDue_1, t, due;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Migration: CRITICAL -> HIGH
                        return [4 /*yield*/, this.prisma.ticket.updateMany({
                                where: { priority: 'CRITICAL' },
                                data: { priority: 'HIGH' },
                            })];
                        case 1:
                            // Migration: CRITICAL -> HIGH
                            _a.sent();
                            return [4 /*yield*/, this.prisma.ticket.findMany({
                                    where: { dueAt: null },
                                    select: { id: true, createdAt: true },
                                })];
                        case 2:
                            ticketsWithoutDue = _a.sent();
                            if (!(ticketsWithoutDue.length > 0)) return [3 /*break*/, 7];
                            console.log("[Migration] Backfilling dueAt for ".concat(ticketsWithoutDue.length, " tickets..."));
                            _i = 0, ticketsWithoutDue_1 = ticketsWithoutDue;
                            _a.label = 3;
                        case 3:
                            if (!(_i < ticketsWithoutDue_1.length)) return [3 /*break*/, 6];
                            t = ticketsWithoutDue_1[_i];
                            due = new Date(t.createdAt);
                            due.setDate(due.getDate() + 7);
                            return [4 /*yield*/, this.prisma.ticket.update({
                                    where: { id: t.id },
                                    data: { dueAt: due },
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            console.log("[Migration] Backfilled.");
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        TicketsService_1.prototype.create = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var attachmentsData, defaultDueAt, ticket;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            attachmentsData = dto.attachments
                                ? dto.attachments.map(function (a) { return (__assign(__assign({}, a), { uploadedById: user.id })); })
                                : [];
                            defaultDueAt = new Date();
                            defaultDueAt.setDate(defaultDueAt.getDate() + 7);
                            return [4 /*yield*/, this.prisma.ticket.create({
                                    data: {
                                        title: dto.title,
                                        description: dto.description,
                                        classroomId: dto.classroomId,
                                        createdById: user.id,
                                        status: client_1.TicketStatus.UNASSIGNED,
                                        dueAt: defaultDueAt,
                                        attachments: {
                                            create: attachmentsData,
                                        },
                                    },
                                    include: { attachments: true, classroom: true },
                                })];
                        case 1:
                            ticket = _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    actorUserId: user.id,
                                    actorRole: user.role,
                                    actorName: user.fullName,
                                    entityType: client_1.AuditEntityType.TICKET,
                                    entityId: ticket.id,
                                    action: client_1.AuditAction.TICKET_CREATED,
                                    message: "Ticket created",
                                    after: { title: ticket.title, priority: ticket.priority },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, ticket];
                    }
                });
            });
        };
        TicketsService_1.prototype.findAll = function (user_1, status_1, filter_1) {
            return __awaiter(this, arguments, void 0, function (user, status, filter, page, limit) {
                var where, skip, _a, data, total;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            where = {};
                            if (user.role === client_1.Role.STUDENT) {
                                if (filter === 'assigned') {
                                    where.assignees = { some: { userId: user.id } };
                                }
                            }
                            if (status) {
                                where.status = status;
                            }
                            if (user.role === client_1.Role.TEACHER) {
                                where.createdById = user.id;
                            }
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, this.prisma.$transaction([
                                    this.prisma.ticket.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: { createdAt: 'desc' },
                                        include: {
                                            classroom: true,
                                            createdBy: { select: { fullName: true, email: true } },
                                            assignees: {
                                                include: { user: { select: { id: true, fullName: true } } },
                                                orderBy: { orderIndex: 'asc' },
                                            },
                                            _count: { select: { comments: true } },
                                        },
                                    }),
                                    this.prisma.ticket.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), data = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    data: data,
                                    meta: {
                                        total: total,
                                        page: page,
                                        lastPage: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        TicketsService_1.prototype.findOne = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var ticket;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.ticket.findUnique({
                                where: { id: id },
                                include: {
                                    classroom: true,
                                    createdBy: { select: { fullName: true, email: true } },
                                    assignees: {
                                        include: {
                                            user: { select: { id: true, fullName: true, email: true } },
                                        },
                                        orderBy: { orderIndex: 'asc' },
                                    },
                                    attachments: true,
                                    comments: {
                                        include: {
                                            author: { select: { id: true, fullName: true, role: true } },
                                        },
                                        orderBy: { createdAt: 'asc' },
                                    },
                                },
                            })];
                        case 1:
                            ticket = _a.sent();
                            if (!ticket)
                                throw new common_1.NotFoundException('Ticket not found');
                            if (user.role === client_1.Role.TEACHER && ticket.createdById !== user.id) {
                                throw new common_1.ForbiddenException('You can only view your own tickets');
                            }
                            // if (user.role === Role.STUDENT) {
                            //     const isAssigned = ticket.assignees.some(a => a.userId === user.id);
                            //     const isUnassigned = ticket.status === TicketStatus.UNASSIGNED;
                            //     const isRejected = ticket.status === TicketStatus.REJECTED;
                            //     // Allow access if assigned, unassigned (open pool), or rejected (rework pool)
                            //     if (!isAssigned && !isUnassigned && !isRejected) {
                            //          throw new ForbiddenException('You do not have permission to view this ticket');
                            //     }
                            // }
                            return [2 /*return*/, ticket];
                    }
                });
            });
        };
        TicketsService_1.prototype.claim = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (user.role !== client_1.Role.STUDENT)
                        throw new common_1.ForbiddenException('Only students can claim tickets');
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var ticket;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.ticket.findUnique({
                                            where: { id: id },
                                            include: { assignees: true },
                                        })];
                                    case 1:
                                        ticket = _a.sent();
                                        if (!ticket)
                                            throw new common_1.NotFoundException();
                                        if (ticket.status !== client_1.TicketStatus.UNASSIGNED) {
                                            throw new common_1.BadRequestException('Can only claim UNASSIGNED tickets');
                                        }
                                        if (ticket.assignees.some(function (a) { return a.userId === user.id; })) {
                                            throw new common_1.BadRequestException('Already claimed');
                                        }
                                        return [4 /*yield*/, tx.ticketAssignee.create({
                                                data: {
                                                    ticketId: id,
                                                    userId: user.id,
                                                    orderIndex: 1,
                                                },
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, tx.ticket.update({
                                                where: { id: id },
                                                data: { status: client_1.TicketStatus.IN_PROGRESS },
                                            })];
                                    case 3:
                                        _a.sent();
                                        // Audit
                                        return [4 /*yield*/, this.auditService.log({
                                                actorUserId: user.id,
                                                actorRole: user.role,
                                                actorName: user.fullName,
                                                entityType: client_1.AuditEntityType.TICKET,
                                                entityId: id,
                                                action: client_1.AuditAction.TICKET_ASSIGNEE_ADDED,
                                                message: 'Student claimed ticket',
                                                after: { assigneeId: user.id, status: client_1.TicketStatus.IN_PROGRESS },
                                            })];
                                    case 4:
                                        // Audit
                                        _a.sent();
                                        return [2 /*return*/, this.findOne(id, user)];
                                }
                            });
                        }); })];
                });
            });
        };
        TicketsService_1.prototype.join = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (user.role !== client_1.Role.STUDENT)
                        throw new common_1.ForbiddenException('Only students can join tickets');
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var ticket, maxOrder;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.ticket.findUnique({
                                            where: { id: id },
                                            include: { assignees: true },
                                        })];
                                    case 1:
                                        ticket = _a.sent();
                                        if (!ticket)
                                            throw new common_1.NotFoundException();
                                        if (ticket.status !== client_1.TicketStatus.IN_PROGRESS) {
                                            throw new common_1.BadRequestException('Can only join IN_PROGRESS tickets');
                                        }
                                        if (ticket.assignees.some(function (a) { return a.userId === user.id; })) {
                                            throw new common_1.BadRequestException('Already assigned');
                                        }
                                        maxOrder = ticket.assignees.reduce(function (max, a) { return Math.max(max, a.orderIndex); }, 0);
                                        return [4 /*yield*/, tx.ticketAssignee.create({
                                                data: {
                                                    ticketId: id,
                                                    userId: user.id,
                                                    orderIndex: maxOrder + 1,
                                                },
                                            })];
                                    case 2:
                                        _a.sent();
                                        // Audit
                                        return [4 /*yield*/, this.auditService.log({
                                                actorUserId: user.id,
                                                actorRole: user.role,
                                                actorName: user.fullName,
                                                entityType: client_1.AuditEntityType.TICKET,
                                                entityId: id,
                                                action: client_1.AuditAction.TICKET_ASSIGNEE_ADDED,
                                                message: 'Student joined ticket',
                                                after: { assigneeId: user.id },
                                            })];
                                    case 3:
                                        // Audit
                                        _a.sent();
                                        return [2 /*return*/, this.findOne(id, user)];
                                }
                            });
                        }); })];
                });
            });
        };
        TicketsService_1.prototype.leave = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (user.role !== client_1.Role.STUDENT)
                        throw new common_1.ForbiddenException();
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var ticket, assignee, remaining, newStatus, others, i;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.ticket.findUnique({
                                            where: { id: id },
                                            include: { assignees: true },
                                        })];
                                    case 1:
                                        ticket = _a.sent();
                                        if (!ticket)
                                            throw new common_1.NotFoundException();
                                        assignee = ticket.assignees.find(function (a) { return a.userId === user.id; });
                                        if (!assignee)
                                            throw new common_1.BadRequestException('Not assigned');
                                        return [4 /*yield*/, tx.ticketAssignee.delete({
                                                where: { ticketId_userId: { ticketId: id, userId: user.id } },
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, tx.ticketAssignee.count({
                                                where: { ticketId: id },
                                            })];
                                    case 3:
                                        remaining = _a.sent();
                                        newStatus = ticket.status;
                                        if (!(remaining === 0)) return [3 /*break*/, 5];
                                        newStatus = client_1.TicketStatus.UNASSIGNED;
                                        return [4 /*yield*/, tx.ticket.update({
                                                where: { id: id },
                                                data: { status: client_1.TicketStatus.UNASSIGNED },
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [3 /*break*/, 10];
                                    case 5: return [4 /*yield*/, tx.ticketAssignee.findMany({
                                            where: { ticketId: id },
                                            orderBy: { orderIndex: 'asc' },
                                        })];
                                    case 6:
                                        others = _a.sent();
                                        i = 0;
                                        _a.label = 7;
                                    case 7:
                                        if (!(i < others.length)) return [3 /*break*/, 10];
                                        if (!(others[i].orderIndex !== i + 1)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, tx.ticketAssignee.update({
                                                where: {
                                                    ticketId_userId: { ticketId: id, userId: others[i].userId },
                                                },
                                                data: { orderIndex: i + 1 },
                                            })];
                                    case 8:
                                        _a.sent();
                                        _a.label = 9;
                                    case 9:
                                        i++;
                                        return [3 /*break*/, 7];
                                    case 10: 
                                    // Audit
                                    return [4 /*yield*/, this.auditService.log({
                                            actorUserId: user.id,
                                            actorRole: user.role,
                                            actorName: user.fullName,
                                            entityType: client_1.AuditEntityType.TICKET,
                                            entityId: id,
                                            action: client_1.AuditAction.TICKET_ASSIGNEE_REMOVED,
                                            message: 'Student left ticket',
                                            after: { status: newStatus },
                                        })];
                                    case 11:
                                        // Audit
                                        _a.sent();
                                        return [2 /*return*/, { message: 'Left ticket' }];
                                }
                            });
                        }); })];
                });
            });
        };
        TicketsService_1.prototype.markDone = function (id, user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var ticket, updated, admins, _i, admins_1, admin;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.ticket.findUnique({
                                where: { id: id },
                                include: { assignees: true },
                            })];
                        case 1:
                            ticket = _a.sent();
                            if (!ticket)
                                throw new common_1.NotFoundException();
                            if (!ticket.assignees.some(function (a) { return a.userId === user.id; }))
                                throw new common_1.ForbiddenException('Not assigned');
                            if (ticket.status !== client_1.TicketStatus.IN_PROGRESS &&
                                ticket.status !== client_1.TicketStatus.REJECTED) {
                                throw new common_1.BadRequestException('Ticket must be IN_PROGRESS or REJECTED to mark done');
                            }
                            return [4 /*yield*/, this.prisma.ticket.update({
                                    where: { id: id },
                                    data: {
                                        status: client_1.TicketStatus.DONE_WAITING_APPROVAL,
                                        studentWorkNote: dto.note,
                                    },
                                })];
                        case 2:
                            updated = _a.sent();
                            // Audit
                            return [4 /*yield*/, this.auditService.log({
                                    actorUserId: user.id,
                                    actorRole: user.role,
                                    actorName: user.fullName,
                                    entityType: client_1.AuditEntityType.TICKET,
                                    entityId: id,
                                    action: client_1.AuditAction.TICKET_MARKED_DONE,
                                    message: 'Student marked ticket as done',
                                    before: { status: ticket.status },
                                    after: { status: client_1.TicketStatus.DONE_WAITING_APPROVAL, note: dto.note },
                                })];
                        case 3:
                            // Audit
                            _a.sent();
                            // Notifications
                            // 1. Notify Teacher (Reporter)
                            return [4 /*yield*/, this.notificationsService.create({
                                    userId: ticket.createdById,
                                    type: client_1.NotificationType.TICKET_WAITING_APPROVAL,
                                    title: 'Ticket dokončen',
                                    body: "Ticket \"".concat(ticket.title, "\" \u010Dek\u00E1 na schv\u00E1len\u00ED."),
                                    linkUrl: "/tickets/".concat(id),
                                    metadata: { ticketId: id },
                                })];
                        case 4:
                            // Notifications
                            // 1. Notify Teacher (Reporter)
                            _a.sent();
                            return [4 /*yield*/, this.prisma.user.findMany({
                                    where: { role: client_1.Role.ADMIN },
                                })];
                        case 5:
                            admins = _a.sent();
                            _i = 0, admins_1 = admins;
                            _a.label = 6;
                        case 6:
                            if (!(_i < admins_1.length)) return [3 /*break*/, 9];
                            admin = admins_1[_i];
                            return [4 /*yield*/, this.notificationsService.create({
                                    userId: admin.id,
                                    type: client_1.NotificationType.TICKET_WAITING_APPROVAL,
                                    title: 'Ticket dokončen (Admin)',
                                    body: "Student dokon\u010Dil ticket \"".concat(ticket.title, "\"."),
                                    linkUrl: "/tickets/".concat(id),
                                    metadata: { ticketId: id },
                                })];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 6];
                        case 9: return [2 /*return*/, updated];
                    }
                });
            });
        };
        TicketsService_1.prototype.approve = function (id, user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var ticket, updated, primaryAssignee, _i, _a, assignee;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (user.role !== client_1.Role.ADMIN)
                                throw new common_1.ForbiddenException();
                            return [4 /*yield*/, this.prisma.ticket.findUnique({
                                    where: { id: id },
                                    include: { assignees: true },
                                })];
                        case 1:
                            ticket = _b.sent();
                            if (!ticket)
                                throw new common_1.NotFoundException('Ticket not found');
                            if (ticket.status !== client_1.TicketStatus.DONE_WAITING_APPROVAL) {
                                throw new common_1.BadRequestException('Ticket must be in DONE_WAITING_APPROVAL status');
                            }
                            return [4 /*yield*/, this.prisma.ticket.update({
                                    where: { id: id },
                                    data: {
                                        status: client_1.TicketStatus.APPROVED,
                                        difficultyPoints: dto.difficultyPoints,
                                        adminApprovalNote: dto.adminApprovalNote,
                                    },
                                })];
                        case 2:
                            updated = _b.sent();
                            primaryAssignee = ticket.assignees.find(function (a) { return a.orderIndex === 1; });
                            if (!primaryAssignee) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.userScore.create({
                                    data: {
                                        ticketId: id,
                                        userId: primaryAssignee.userId,
                                        points: dto.difficultyPoints,
                                        reason: "Vy\u0159e\u0161en\u00ED: ".concat(ticket.title),
                                    },
                                })];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: 
                        // Audit
                        return [4 /*yield*/, this.auditService.log({
                                actorUserId: user.id,
                                actorRole: user.role,
                                actorName: user.fullName,
                                entityType: client_1.AuditEntityType.TICKET,
                                entityId: id,
                                action: client_1.AuditAction.TICKET_APPROVED,
                                message: 'Ticket approved',
                                before: { status: ticket.status },
                                after: { status: client_1.TicketStatus.APPROVED, points: dto.difficultyPoints },
                            })];
                        case 5:
                            // Audit
                            _b.sent();
                            _i = 0, _a = ticket.assignees;
                            _b.label = 6;
                        case 6:
                            if (!(_i < _a.length)) return [3 /*break*/, 9];
                            assignee = _a[_i];
                            return [4 /*yield*/, this.notificationsService.create({
                                    userId: assignee.userId,
                                    type: client_1.NotificationType.TICKET_APPROVED,
                                    title: 'Tvůj ticket byl schválen!',
                                    body: "Admin schv\u00E1lil ticket \"".concat(ticket.title, "\" (+").concat(dto.difficultyPoints, " b)."),
                                    linkUrl: "/tickets/".concat(id),
                                    metadata: { ticketId: id },
                                })];
                        case 7:
                            _b.sent();
                            _b.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 6];
                        case 9: 
                        // Notify: Teacher
                        return [4 /*yield*/, this.notificationsService.create({
                                userId: ticket.createdById,
                                type: client_1.NotificationType.TICKET_APPROVED,
                                title: 'Váš ticket je hotov',
                                body: "Ticket \"".concat(ticket.title, "\" byl schv\u00E1len adminem."),
                                linkUrl: "/tickets/".concat(id),
                                metadata: { ticketId: id },
                            })];
                        case 10:
                            // Notify: Teacher
                            _b.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        TicketsService_1.prototype.reject = function (id, user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (user.role !== client_1.Role.ADMIN)
                        throw new common_1.ForbiddenException();
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var ticket, updated, primaryAssignee, _i, _a, assignee, penaltyText;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, tx.ticket.findUnique({
                                            where: { id: id },
                                            include: { assignees: true },
                                        })];
                                    case 1:
                                        ticket = _b.sent();
                                        if (!ticket)
                                            throw new common_1.NotFoundException('Ticket not found');
                                        // Strict status check for idempotency
                                        if (ticket.status !== client_1.TicketStatus.DONE_WAITING_APPROVAL) {
                                            throw new common_1.BadRequestException('Ticket must be in DONE_WAITING_APPROVAL status to be rejected');
                                        }
                                        return [4 /*yield*/, tx.ticket.update({
                                                where: { id: id },
                                                data: {
                                                    status: client_1.TicketStatus.REJECTED,
                                                    adminApprovalNote: dto.adminApprovalNote,
                                                },
                                            })];
                                    case 2:
                                        updated = _b.sent();
                                        if (!dto.penaltyPoints) return [3 /*break*/, 4];
                                        primaryAssignee = ticket.assignees.find(function (a) { return a.orderIndex === 1; });
                                        if (!primaryAssignee) return [3 /*break*/, 4];
                                        return [4 /*yield*/, tx.userScore.create({
                                                data: {
                                                    ticketId: id,
                                                    userId: primaryAssignee.userId,
                                                    points: -Math.abs(dto.penaltyPoints), // Ensure negative
                                                    reason: "Penalizace: ".concat(ticket.title),
                                                },
                                            })];
                                    case 3:
                                        _b.sent();
                                        _b.label = 4;
                                    case 4: 
                                    // Audit
                                    return [4 /*yield*/, this.auditService.log({
                                            actorUserId: user.id,
                                            actorRole: user.role,
                                            actorName: user.fullName,
                                            entityType: client_1.AuditEntityType.TICKET,
                                            entityId: id,
                                            action: client_1.AuditAction.TICKET_REJECTED,
                                            message: 'Ticket returned/rejected',
                                            before: { status: ticket.status },
                                            after: {
                                                status: client_1.TicketStatus.REJECTED,
                                                note: dto.adminApprovalNote,
                                                penalty: dto.penaltyPoints,
                                            },
                                        })];
                                    case 5:
                                        // Audit
                                        _b.sent();
                                        _i = 0, _a = ticket.assignees;
                                        _b.label = 6;
                                    case 6:
                                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                                        assignee = _a[_i];
                                        penaltyText = assignee.orderIndex === 1 && dto.penaltyPoints
                                            ? " (Penalizace: -".concat(dto.penaltyPoints, " b)")
                                            : '';
                                        return [4 /*yield*/, this.notificationsService.create({
                                                userId: assignee.userId,
                                                type: client_1.NotificationType.TICKET_RETURNED,
                                                title: 'Ticket vrácen k dopracování',
                                                body: "Admin vr\u00E1til ticket \"".concat(ticket.title, "\". D\u016Fvod: ").concat(dto.adminApprovalNote).concat(penaltyText),
                                                linkUrl: "/tickets/".concat(id),
                                                metadata: { ticketId: id },
                                            })];
                                    case 7:
                                        _b.sent();
                                        _b.label = 8;
                                    case 8:
                                        _i++;
                                        return [3 /*break*/, 6];
                                    case 9: 
                                    // Notify: Teacher
                                    return [4 /*yield*/, this.notificationsService.create({
                                            userId: ticket.createdById,
                                            type: client_1.NotificationType.TICKET_RETURNED,
                                            title: 'Ticket nebyl schválen (vrácen)',
                                            body: "Ticket \"".concat(ticket.title, "\" byl vr\u00E1cen student\u016Fm."),
                                            linkUrl: "/tickets/".concat(id),
                                            metadata: { ticketId: id },
                                        })];
                                    case 10:
                                        // Notify: Teacher
                                        _b.sent();
                                        return [2 /*return*/, updated];
                                }
                            });
                        }); })];
                });
            });
        };
        TicketsService_1.prototype.setPriority = function (id, priority, user) {
            return __awaiter(this, void 0, void 0, function () {
                var ticket, updated, _i, _a, assignee;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.ticket.findUnique({
                                where: { id: id },
                                include: { assignees: true },
                            })];
                        case 1:
                            ticket = _b.sent();
                            if (!ticket)
                                throw new common_1.NotFoundException();
                            return [4 /*yield*/, this.prisma.ticket.update({
                                    where: { id: id },
                                    data: { priority: priority },
                                })];
                        case 2:
                            updated = _b.sent();
                            // Audit
                            return [4 /*yield*/, this.auditService.log({
                                    actorUserId: user.id,
                                    actorRole: user.role,
                                    actorName: user.fullName,
                                    entityType: client_1.AuditEntityType.TICKET,
                                    entityId: id,
                                    action: client_1.AuditAction.TICKET_PRIORITY_CHANGED,
                                    message: 'Priority changed',
                                    before: { priority: ticket.priority },
                                    after: { priority: priority },
                                })];
                        case 3:
                            // Audit
                            _b.sent();
                            _i = 0, _a = ticket.assignees;
                            _b.label = 4;
                        case 4:
                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                            assignee = _a[_i];
                            return [4 /*yield*/, this.notificationsService.create({
                                    userId: assignee.userId,
                                    type: client_1.NotificationType.TICKET_PRIORITY_CHANGED,
                                    title: 'Změna priority',
                                    body: "Priorita ticketu \"".concat(ticket.title, "\" zm\u011Bn\u011Bna na ").concat(priority, "."),
                                    linkUrl: "/tickets/".concat(id),
                                    metadata: { ticketId: id },
                                })];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7: return [2 /*return*/, updated];
                    }
                });
            });
        };
        TicketsService_1.prototype.manageAssignees = function (ticketId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var ticket, actionLogged, notificationUserId, notificationType, maxOrder, assignee, remaining;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.ticket.findUnique({
                                            where: { id: ticketId },
                                            include: { assignees: true },
                                        })];
                                    case 1:
                                        ticket = _a.sent();
                                        if (!ticket)
                                            throw new common_1.NotFoundException('Ticket not found');
                                        actionLogged = null;
                                        notificationUserId = null;
                                        notificationType = null;
                                        if (!(dto.action === ticket_actions_dto_1.AssigneeAction.ADD)) return [3 /*break*/, 5];
                                        if (ticket.assignees.some(function (a) { return a.userId === dto.userId; }))
                                            throw new common_1.BadRequestException('User already assigned');
                                        maxOrder = ticket.assignees.reduce(function (max, a) { return Math.max(max, a.orderIndex); }, 0);
                                        return [4 /*yield*/, tx.ticketAssignee.create({
                                                data: { ticketId: ticketId, userId: dto.userId, orderIndex: maxOrder + 1 },
                                            })];
                                    case 2:
                                        _a.sent();
                                        if (!(ticket.status === client_1.TicketStatus.UNASSIGNED)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, tx.ticket.update({
                                                where: { id: ticketId },
                                                data: { status: client_1.TicketStatus.IN_PROGRESS },
                                            })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        actionLogged = client_1.AuditAction.TICKET_ASSIGNEE_ADDED;
                                        notificationUserId = dto.userId;
                                        notificationType = client_1.NotificationType.TICKET_ASSIGNED;
                                        return [3 /*break*/, 9];
                                    case 5:
                                        if (!(dto.action === ticket_actions_dto_1.AssigneeAction.REMOVE)) return [3 /*break*/, 9];
                                        assignee = ticket.assignees.find(function (a) { return a.userId === dto.userId; });
                                        if (!assignee)
                                            throw new common_1.BadRequestException('User not assigned');
                                        return [4 /*yield*/, tx.ticketAssignee.delete({
                                                where: { ticketId_userId: { ticketId: ticketId, userId: dto.userId } },
                                            })];
                                    case 6:
                                        _a.sent();
                                        remaining = ticket.assignees.filter(function (a) { return a.userId !== dto.userId; });
                                        if (!(remaining.length === 0)) return [3 /*break*/, 8];
                                        return [4 /*yield*/, tx.ticket.update({
                                                where: { id: ticketId },
                                                data: { status: client_1.TicketStatus.UNASSIGNED },
                                            })];
                                    case 7:
                                        _a.sent();
                                        return [3 /*break*/, 8];
                                    case 8:
                                        actionLogged = client_1.AuditAction.TICKET_ASSIGNEE_REMOVED;
                                        notificationUserId = dto.userId;
                                        notificationType = client_1.NotificationType.TICKET_UNASSIGNED;
                                        _a.label = 9;
                                    case 9:
                                        if (!actionLogged) return [3 /*break*/, 11];
                                        return [4 /*yield*/, this.auditService.log({
                                                actorUserId: user.id,
                                                actorRole: user.role,
                                                actorName: user.fullName,
                                                entityType: client_1.AuditEntityType.TICKET,
                                                entityId: ticketId,
                                                action: actionLogged,
                                                message: "Admin managed assignees: ".concat(dto.action),
                                                after: { userId: dto.userId },
                                            })];
                                    case 10:
                                        _a.sent();
                                        _a.label = 11;
                                    case 11:
                                        if (!(notificationUserId && notificationType)) return [3 /*break*/, 13];
                                        return [4 /*yield*/, this.notificationsService.create({
                                                userId: notificationUserId,
                                                type: notificationType,
                                                title: notificationType === client_1.NotificationType.TICKET_ASSIGNED
                                                    ? 'Nový úkol'
                                                    : 'Odebrán z úkolu',
                                                body: notificationType === client_1.NotificationType.TICKET_ASSIGNED
                                                    ? "Byl jsi p\u0159id\u00E1n k ticketu \"".concat(ticket.title, "\".")
                                                    : "Byl jsi odebr\u00E1n z ticketu \"".concat(ticket.title, "\"."),
                                                linkUrl: "/dashboard/tickets/".concat(ticketId),
                                                metadata: { ticketId: ticketId },
                                            })];
                                    case 12:
                                        _a.sent();
                                        _a.label = 13;
                                    case 13: return [2 /*return*/, this.findOne(ticketId, user)];
                                }
                            });
                        }); })];
                });
            });
        };
        TicketsService_1.prototype.getAttachmentStream = function (ticketId, attachmentId, user) {
            return __awaiter(this, void 0, void 0, function () {
                var ticket, hasAccess, attachment, filePath, stream;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.ticket.findUnique({
                                where: { id: ticketId },
                                include: { assignees: true },
                            })];
                        case 1:
                            ticket = _a.sent();
                            if (!ticket)
                                throw new common_1.NotFoundException('Ticket not found');
                            hasAccess = false;
                            if (user.role === client_1.Role.ADMIN)
                                hasAccess = true;
                            else if (user.role === client_1.Role.TEACHER && ticket.createdById === user.id)
                                hasAccess = true;
                            else if (user.role === client_1.Role.STUDENT) {
                                if (ticket.status === client_1.TicketStatus.UNASSIGNED ||
                                    ticket.assignees.some(function (a) { return a.userId === user.id; }))
                                    hasAccess = true;
                            }
                            if (!hasAccess)
                                throw new common_1.ForbiddenException('You do not have permission to download this file');
                            return [4 /*yield*/, this.prisma.ticketAttachment.findUnique({
                                    where: { id: attachmentId, ticketId: ticketId },
                                })];
                        case 2:
                            attachment = _a.sent();
                            if (!attachment)
                                throw new common_1.NotFoundException('Attachment not found');
                            filePath = (0, path_1.resolve)(process.cwd(), attachment.path);
                            if (!(0, fs_1.existsSync)(filePath)) {
                                console.error("File not found at: ".concat(filePath));
                                throw new common_1.NotFoundException('File on disk not found');
                            }
                            stream = (0, fs_1.createReadStream)(filePath);
                            return [2 /*return*/, {
                                    stream: stream,
                                    mimeType: attachment.mimeType,
                                    fileName: attachment.originalName,
                                }];
                    }
                });
            });
        };
        TicketsService_1.prototype.addComment = function (id, user, message) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (user.role === client_1.Role.TEACHER) {
                                throw new common_1.ForbiddenException('Teachers cannot comment');
                            }
                            return [4 /*yield*/, this.prisma.ticketComment.create({
                                    data: {
                                        ticketId: id,
                                        authorId: user.id,
                                        message: message,
                                    },
                                })];
                        case 1:
                            result = _a.sent();
                            // Notify others? (Optional / Nice to have, not in minimum set but good for collaboration)
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        TicketsService_1.prototype.schedule = function (id, user, plannedAt, dueAt) {
            return __awaiter(this, void 0, void 0, function () {
                var ticket, updateData, auditAfter, notificationType, due, updated, _i, _a, assignee;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (user.role !== client_1.Role.ADMIN) {
                                throw new common_1.ForbiddenException('Only admins can schedule tickets');
                            }
                            return [4 /*yield*/, this.prisma.ticket.findUnique({
                                    where: { id: id },
                                    include: { assignees: true },
                                })];
                        case 1:
                            ticket = _b.sent();
                            console.log('Schedule User:', user);
                            if (!ticket)
                                throw new common_1.NotFoundException('Ticket not found');
                            updateData = {};
                            auditAfter = {};
                            notificationType = null;
                            if (plannedAt !== undefined) {
                                updateData.plannedAt = plannedAt ? new Date(plannedAt) : null;
                                auditAfter.plannedAt = updateData.plannedAt;
                            }
                            if (dueAt) {
                                due = new Date(dueAt);
                                if (due.getTime() < new Date(ticket.createdAt).getTime()) {
                                    throw new common_1.BadRequestException('Due date cannot be earlier than creation date');
                                }
                                updateData.dueAt = due;
                                auditAfter.dueAt = due;
                                // Notify change
                                if (ticket.dueAt && ticket.dueAt.getTime() !== due.getTime()) {
                                    notificationType = client_1.NotificationType.TICKET_DUE_DATE_CHANGED;
                                }
                            }
                            return [4 /*yield*/, this.prisma.ticket.update({
                                    where: { id: id },
                                    data: updateData,
                                    include: { classroom: true, assignees: { include: { user: true } } },
                                })];
                        case 2:
                            updated = _b.sent();
                            // Audit
                            return [4 /*yield*/, this.auditService.log({
                                    actorUserId: user.id,
                                    actorRole: user.role,
                                    actorName: user.fullName,
                                    entityType: client_1.AuditEntityType.TICKET,
                                    entityId: id,
                                    action: client_1.AuditAction.TICKET_DUE_DATE_CHANGED, // Or Generic Update
                                    message: 'Admin updated schedule/deadline',
                                    before: { plannedAt: ticket.plannedAt, dueAt: ticket.dueAt },
                                    after: auditAfter,
                                })];
                        case 3:
                            // Audit
                            _b.sent();
                            if (!notificationType) return [3 /*break*/, 7];
                            _i = 0, _a = ticket.assignees;
                            _b.label = 4;
                        case 4:
                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                            assignee = _a[_i];
                            return [4 /*yield*/, this.notificationsService.create({
                                    userId: assignee.userId,
                                    type: notificationType,
                                    title: 'Změna termínu',
                                    body: "Term\u00EDn odevzd\u00E1n\u00ED ticketu \"".concat(ticket.title, "\" byl zm\u011Bn\u011Bn."),
                                    linkUrl: "/tickets/".concat(id),
                                    metadata: { ticketId: id },
                                })];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7: return [2 /*return*/, updated];
                    }
                });
            });
        };
        TicketsService_1.prototype.remove = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var ticket;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (user.role !== client_1.Role.ADMIN) {
                                throw new common_1.ForbiddenException('Only admins can delete tickets');
                            }
                            return [4 /*yield*/, this.prisma.ticket.findUnique({ where: { id: id } })];
                        case 1:
                            ticket = _a.sent();
                            if (!ticket)
                                throw new common_1.NotFoundException('Ticket not found');
                            // Audit key info before deletion
                            return [4 /*yield*/, this.auditService.log({
                                    actorUserId: user.id,
                                    actorRole: user.role,
                                    actorName: user.fullName,
                                    entityType: client_1.AuditEntityType.TICKET,
                                    entityId: id,
                                    action: client_1.AuditAction.TICKET_DELETED,
                                    message: "Ticket deleted by admin",
                                    before: { title: ticket.title, status: ticket.status },
                                })];
                        case 2:
                            // Audit key info before deletion
                            _a.sent();
                            return [2 /*return*/, this.prisma.ticket.delete({ where: { id: id } })];
                    }
                });
            });
        };
        TicketsService_1.prototype.rework = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (user.role !== client_1.Role.STUDENT)
                        throw new common_1.ForbiddenException('Only students can rework tickets');
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var ticket, archiveMessage, updateData;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.ticket.findUnique({
                                            where: { id: id },
                                            include: { assignees: true },
                                        })];
                                    case 1:
                                        ticket = _a.sent();
                                        if (!ticket)
                                            throw new common_1.NotFoundException('Ticket not found');
                                        // Strict status check: Only REJECTED tickets can be reworked.
                                        if (ticket.status !== client_1.TicketStatus.REJECTED) {
                                            throw new common_1.BadRequestException('Ticket must be REJECTED to rework');
                                        }
                                        if (!(ticket.studentWorkNote || ticket.adminApprovalNote)) return [3 /*break*/, 3];
                                        archiveMessage = "[HISTORIE] Ticket vr\u00E1cen k dopracov\u00E1n\u00ED.\n----------------------------------------\n\u0158e\u0161en\u00ED studenta: \"".concat(ticket.studentWorkNote || 'Neuvedeno', "\"\nVyj\u00E1d\u0159en\u00ED admina: \"").concat(ticket.adminApprovalNote || 'Neuvedeno', "\"\n----------------------------------------");
                                        return [4 /*yield*/, tx.ticketComment.create({
                                                data: {
                                                    ticketId: id,
                                                    authorId: user.id, // Or maybe null for system/bot? using user for now as they triggered rework
                                                    message: archiveMessage,
                                                },
                                            })];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        updateData = {
                                            status: client_1.TicketStatus.IN_PROGRESS,
                                            studentWorkNote: null,
                                            adminApprovalNote: null,
                                            difficultyPoints: null, // Reset potential points if any (though unlikely on reject)
                                        };
                                        // Assignee Logic:
                                        // Remove ALL existing assignees.
                                        // The user initiating rework becomes the ONLY assignee.
                                        return [4 /*yield*/, tx.ticketAssignee.deleteMany({ where: { ticketId: id } })];
                                    case 4:
                                        // Assignee Logic:
                                        // Remove ALL existing assignees.
                                        // The user initiating rework becomes the ONLY assignee.
                                        _a.sent();
                                        return [4 /*yield*/, tx.ticketAssignee.create({
                                                data: {
                                                    ticketId: id,
                                                    userId: user.id,
                                                    orderIndex: 1,
                                                },
                                            })];
                                    case 5:
                                        _a.sent();
                                        return [4 /*yield*/, tx.ticket.update({ where: { id: id }, data: updateData })];
                                    case 6:
                                        _a.sent();
                                        // Audit
                                        return [4 /*yield*/, this.auditService.log({
                                                actorUserId: user.id,
                                                actorRole: user.role,
                                                actorName: user.fullName,
                                                entityType: client_1.AuditEntityType.TICKET,
                                                entityId: id,
                                                action: client_1.AuditAction.TICKET_STATUS_CHANGED,
                                                message: 'Student started rework',
                                                before: { status: ticket.status },
                                                after: { status: client_1.TicketStatus.IN_PROGRESS, assignee: user.fullName },
                                            })];
                                    case 7:
                                        // Audit
                                        _a.sent();
                                        return [2 /*return*/, this.findOne(id, user)];
                                }
                            });
                        }); })];
                });
            });
        };
        return TicketsService_1;
    }());
    __setFunctionName(_classThis, "TicketsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TicketsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TicketsService = _classThis;
}();
exports.TicketsService = TicketsService;
