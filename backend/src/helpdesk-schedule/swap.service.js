"use strict";
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
exports.SwapService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var constants_1 = require("../common/constants");
var SwapService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SwapService = _classThis = /** @class */ (function () {
        function SwapService_1(prisma, auditService, notificationsService, preferencesService) {
            this.prisma = prisma;
            this.auditService = auditService;
            this.notificationsService = notificationsService;
            this.preferencesService = preferencesService;
        }
        SwapService_1.prototype.createOffer = function (user, date, lesson) {
            return __awaiter(this, void 0, void 0, function () {
                var shift, existing, times, shiftEnd, now, swap, otherStudents, filteredIds, _i, filteredIds_1, studentId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (user.role !== client_1.Role.STUDENT)
                                throw new common_1.ForbiddenException();
                            return [4 /*yield*/, this.prisma.helpdeskShift.findUnique({
                                    where: { date_lesson: { date: date, lesson: lesson } },
                                    include: { assignees: true },
                                })];
                        case 1:
                            shift = _a.sent();
                            if (!shift)
                                throw new common_1.NotFoundException('Shift not found');
                            // 2. Verify assignee
                            if (!shift.assignees.some(function (a) { return a.userId === user.id; })) {
                                throw new common_1.BadRequestException('You are not assigned to this shift');
                            }
                            return [4 /*yield*/, this.prisma.helpdeskSwap.findFirst({
                                    where: {
                                        shiftId: shift.id,
                                        offeredByUserId: user.id,
                                        status: client_1.SwapStatus.OPEN,
                                    },
                                })];
                        case 2:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.BadRequestException('Swap already received/offered');
                            }
                            times = constants_1.LESSON_TIMES[lesson];
                            if (!times) {
                                throw new common_1.BadRequestException('Invalid lesson time config');
                            }
                            shiftEnd = new Date(new Date("".concat(date, "T").concat(times.end, ":00")));
                            now = new Date();
                            console.log("[SwapService] Swap offer: User=".concat(user.id, " Date=").concat(date, " Lesson=").concat(lesson, " ShiftEnd=").concat(shiftEnd.toISOString()));
                            if (shiftEnd < now) {
                                throw new common_1.BadRequestException('Cannot swap past shifts');
                            }
                            return [4 /*yield*/, this.prisma.helpdeskSwap.create({
                                    data: {
                                        shiftId: shift.id,
                                        offeredByUserId: user.id,
                                        status: client_1.SwapStatus.OPEN,
                                    },
                                })];
                        case 3:
                            swap = _a.sent();
                            return [4 /*yield*/, this.prisma.user.findMany({
                                    where: {
                                        role: client_1.Role.STUDENT,
                                        id: { not: user.id },
                                    },
                                    // Fetch full user object strictly for ROLE check in filterRecipients
                                })];
                        case 4:
                            otherStudents = _a.sent();
                            return [4 /*yield*/, this.preferencesService.filterRecipients(otherStudents, client_1.NotificationType.SWAP_OFFER_CREATED)];
                        case 5:
                            filteredIds = _a.sent();
                            _i = 0, filteredIds_1 = filteredIds;
                            _a.label = 6;
                        case 6:
                            if (!(_i < filteredIds_1.length)) return [3 /*break*/, 9];
                            studentId = filteredIds_1[_i];
                            return [4 /*yield*/, this.notificationsService.create({
                                    userId: studentId,
                                    type: client_1.NotificationType.SWAP_OFFER_CREATED,
                                    title: 'Nová nabídka výměny služby',
                                    body: "Student ".concat(user.fullName, " nab\u00EDz\u00ED v\u00FDm\u011Bnu slu\u017Eby: ").concat(date, " \u2013 ").concat(lesson, ". hod. Otev\u0159i pl\u00E1nov\u00E1n\u00ED a p\u0159ijmi nab\u00EDdku."),
                                    linkUrl: '/dashboard/planning',
                                    metadata: { swapId: swap.id },
                                    skipPreferenceCheck: true, // Skip redundant check (User fetched, Role Checked, Prefs Checked)
                                })];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 6];
                        case 9: 
                        // Audit
                        return [4 /*yield*/, this.auditService.log({
                                actorUserId: user.id,
                                actorRole: user.role,
                                actorName: user.fullName,
                                entityType: client_1.AuditEntityType.SWAP,
                                entityId: swap.id,
                                action: client_1.AuditAction.SWAP_REQUESTED,
                                message: 'Swap offer created',
                            })];
                        case 10:
                            // Audit
                            _a.sent();
                            return [2 /*return*/, swap];
                    }
                });
            });
        };
        SwapService_1.prototype.acceptOffer = function (user, swapId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (user.role !== client_1.Role.STUDENT)
                        throw new common_1.ForbiddenException();
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var swap, updatedSwap, admins, _i, admins_1, admin;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.helpdeskSwap.findUnique({
                                            where: { id: swapId },
                                            include: { shift: { include: { assignees: true } }, offeredBy: true },
                                        })];
                                    case 1:
                                        swap = _a.sent();
                                        if (!swap)
                                            throw new common_1.NotFoundException('Swap offer not found');
                                        if (swap.status !== client_1.SwapStatus.OPEN)
                                            throw new common_1.BadRequestException('Swap offer not available');
                                        if (swap.offeredByUserId === user.id)
                                            throw new common_1.BadRequestException('Cannot accept own offer');
                                        // Logic: Replace logic (Swap only happens if strict capacity of 2? Prompt "Když slot už má 2, swap jen jako výměna (replace)". If < 2, technically could be add, but swap implies replace).
                                        // The prompt says "po accept se přepíše obsazení slotu (původní student odebrán, nový přidán)". This means ALWAYS REPLACE.
                                        // 1. Remove Offerer
                                        return [4 /*yield*/, tx.helpdeskShiftAssignee.delete({
                                                where: {
                                                    shiftId_userId: {
                                                        shiftId: swap.shiftId,
                                                        userId: swap.offeredByUserId,
                                                    },
                                                },
                                            })];
                                    case 2:
                                        // Logic: Replace logic (Swap only happens if strict capacity of 2? Prompt "Když slot už má 2, swap jen jako výměna (replace)". If < 2, technically could be add, but swap implies replace).
                                        // The prompt says "po accept se přepíše obsazení slotu (původní student odebrán, nový přidán)". This means ALWAYS REPLACE.
                                        // 1. Remove Offerer
                                        _a.sent();
                                        // 2. Add Accepter (User)
                                        // Ensure user not already assigned?
                                        if (swap.shift.assignees.some(function (a) { return a.userId === user.id; })) {
                                            throw new common_1.BadRequestException('You are already assigned to this shift');
                                        }
                                        return [4 /*yield*/, tx.helpdeskShiftAssignee.create({
                                                data: {
                                                    shiftId: swap.shiftId,
                                                    userId: user.id,
                                                },
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, tx.helpdeskSwap.update({
                                                where: { id: swapId },
                                                data: {
                                                    status: client_1.SwapStatus.ACCEPTED,
                                                    acceptedByUserId: user.id,
                                                    decidedAt: new Date(),
                                                },
                                            })];
                                    case 4:
                                        updatedSwap = _a.sent();
                                        // 4. Notifications
                                        // A) Notify Offerer (Author)
                                        return [4 /*yield*/, this.notificationsService.create({
                                                userId: swap.offeredByUserId,
                                                type: client_1.NotificationType.SWAP_OFFER_ACCEPTED,
                                                title: 'Tvoje nabídka výměny byla přijata!',
                                                body: "Tvou nab\u00EDdku na ".concat(swap.shift.date, " p\u0159ijal(a) ").concat(user.fullName, "."),
                                                linkUrl: '/dashboard/planning',
                                                metadata: { swapId: swapId },
                                            })];
                                    case 5:
                                        // 4. Notifications
                                        // A) Notify Offerer (Author)
                                        _a.sent();
                                        // B) Notify Accepter (User)
                                        return [4 /*yield*/, this.notificationsService.create({
                                                userId: user.id,
                                                type: client_1.NotificationType.SWAP_OFFER_ACCEPTED, // Or distinct type
                                                title: 'Výměna potvrzena',
                                                body: "\u00DAsp\u011B\u0161n\u011B jsi p\u0159ijal(a) v\u00FDm\u011Bnu slu\u017Eby na ".concat(swap.shift.date, "."),
                                                linkUrl: '/dashboard/planning',
                                                metadata: { swapId: swapId },
                                            })];
                                    case 6:
                                        // B) Notify Accepter (User)
                                        _a.sent();
                                        return [4 /*yield*/, this.prisma.user.findMany({
                                                where: { role: client_1.Role.ADMIN },
                                            })];
                                    case 7:
                                        admins = _a.sent();
                                        _i = 0, admins_1 = admins;
                                        _a.label = 8;
                                    case 8:
                                        if (!(_i < admins_1.length)) return [3 /*break*/, 11];
                                        admin = admins_1[_i];
                                        return [4 /*yield*/, this.notificationsService.create({
                                                userId: admin.id,
                                                type: client_1.NotificationType.SWAP_OFFER_ACCEPTED, // Or SWAP_COMPLETED_ADMIN
                                                title: 'Proběhla výměna služby',
                                                body: "".concat(swap.offeredBy.fullName, " \u2194 ").concat(user.fullName, ", ").concat(swap.shift.date, " \u2013 ").concat(swap.shift.lesson, ". hod"),
                                                linkUrl: '/dashboard/admin/audit', // Or planning
                                                metadata: { swapId: swapId },
                                            })];
                                    case 9:
                                        _a.sent();
                                        _a.label = 10;
                                    case 10:
                                        _i++;
                                        return [3 /*break*/, 8];
                                    case 11: 
                                    // 5. Audit
                                    return [4 /*yield*/, this.auditService.log({
                                            actorUserId: user.id,
                                            actorRole: user.role,
                                            actorName: user.fullName,
                                            entityType: client_1.AuditEntityType.SWAP,
                                            entityId: swapId,
                                            action: client_1.AuditAction.SWAP_ACCEPTED,
                                            message: "Swap accepted by ".concat(user.fullName),
                                            after: { acceptedBy: user.id },
                                        })];
                                    case 12:
                                        // 5. Audit
                                        _a.sent();
                                        return [2 /*return*/, updatedSwap];
                                }
                            });
                        }); })];
                });
            });
        };
        SwapService_1.prototype.cancelOffer = function (user, swapId) {
            return __awaiter(this, void 0, void 0, function () {
                var swap, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.helpdeskSwap.findUnique({
                                where: { id: swapId },
                            })];
                        case 1:
                            swap = _a.sent();
                            if (!swap)
                                throw new common_1.NotFoundException();
                            // Owner or Admin
                            if (user.role !== client_1.Role.ADMIN && swap.offeredByUserId !== user.id) {
                                throw new common_1.ForbiddenException();
                            }
                            if (swap.status !== client_1.SwapStatus.OPEN)
                                throw new common_1.BadRequestException('Can only cancel OPEN offers');
                            return [4 /*yield*/, this.prisma.helpdeskSwap.update({
                                    where: { id: swapId },
                                    data: { status: client_1.SwapStatus.CANCELLED, decidedAt: new Date() },
                                })];
                        case 2:
                            updated = _a.sent();
                            // Notify Owner (Author) about cancellation
                            // "Pokud zrušil autor: notify jen autor (info „nabídka zrušena“)"
                            // "Pokud zrušil admin: notify jen autor"
                            // So always notify the original offeredByUserId.
                            return [4 /*yield*/, this.notificationsService.create({
                                    userId: swap.offeredByUserId,
                                    type: client_1.NotificationType.SWAP_OFFER_CANCELLED, // Or generic
                                    title: 'Nabídka výměny zrušena',
                                    body: 'Tvoje nabídka na výměnu služby byla zrušena.',
                                    linkUrl: '/dashboard/planning',
                                    metadata: { swapId: swapId },
                                })];
                        case 3:
                            // Notify Owner (Author) about cancellation
                            // "Pokud zrušil autor: notify jen autor (info „nabídka zrušena“)"
                            // "Pokud zrušil admin: notify jen autor"
                            // So always notify the original offeredByUserId.
                            _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    actorUserId: user.id,
                                    actorRole: user.role,
                                    actorName: user.fullName,
                                    entityType: client_1.AuditEntityType.SWAP,
                                    entityId: swapId,
                                    action: client_1.AuditAction.SWAP_CANCELLED,
                                    message: 'Swap offer cancelled',
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        SwapService_1.prototype.listOffers = function (weekStart) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Logic to filter by week if needed, or return all OPEN
                    // For now returning all OPEN future offers
                    return [2 /*return*/, this.prisma.helpdeskSwap.findMany({
                            where: {
                                status: client_1.SwapStatus.OPEN,
                                shift: {
                                    date: { gte: new Date().toISOString().split('T')[0] }, // Future only
                                },
                            },
                            include: {
                                shift: true,
                                offeredBy: { select: { fullName: true, id: true } },
                            },
                            orderBy: { shift: { date: 'asc' } },
                        })];
                });
            });
        };
        return SwapService_1;
    }());
    __setFunctionName(_classThis, "SwapService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SwapService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SwapService = _classThis;
}();
exports.SwapService = SwapService;
