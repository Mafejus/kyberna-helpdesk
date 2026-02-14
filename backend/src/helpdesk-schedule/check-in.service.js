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
exports.CheckInService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var constants_1 = require("../common/constants");
var CheckInService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CheckInService = _classThis = /** @class */ (function () {
        function CheckInService_1(prisma, auditService) {
            this.prisma = prisma;
            this.auditService = auditService;
        }
        CheckInService_1.prototype.startCheckIn = function (user, date, lesson) {
            return __awaiter(this, void 0, void 0, function () {
                var shift, times, parsePragueTime, _a, nowPragueVal, lessonStartVal, _b, eH, eM, _c, lY, lM, lD, lessonEndVal, allowStartVal, diffM, active, checkIn;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (user.role !== client_1.Role.STUDENT) {
                                throw new common_1.ForbiddenException('Only students can check-in');
                            }
                            return [4 /*yield*/, this.prisma.helpdeskShift.findUnique({
                                    where: { date_lesson: { date: date, lesson: lesson } },
                                    include: { assignees: true },
                                })];
                        case 1:
                            shift = _d.sent();
                            if (!shift)
                                throw new common_1.NotFoundException('Shift not found');
                            // 2. Verify assignment
                            if (!shift.assignees.some(function (a) { return a.userId === user.id; })) {
                                throw new common_1.ForbiddenException('You are not assigned to this shift');
                            }
                            times = constants_1.LESSON_TIMES[lesson];
                            if (!times)
                                throw new common_1.BadRequestException('Invalid lesson');
                            parsePragueTime = function (dateStr, timeStr) {
                                // Create an ISO string with Prague offset lookup?
                                // Or cleaner: use Intl to find the offset for that date, or easier: assume server is UTC and shift?
                                // Let's use a robust method: Construct a string that `new Date()` parses as Local, but we want Prague.
                                // Actually, we can use a library if available, but let's stick to native JS.
                                // Hack: Create a date as UTC, then adjust by the difference between UTC-wallclock and Prague-wallclock?
                                // Better: Use Intl to format a reference date to parts in Prague, compare, and adjust.
                                // BUT simplest for now without libraries:
                                // Use 'Europe/Prague' formatter.
                                // We need to compare 'now' (Server Time) with 'Lesson Start' (Prague Time).
                                // Let's convert 'now' to Prague Wall Clock Time for comparison logic (e.g. 12:48),
                                // and compare it to Lesson Start Wall Clock (12:35).
                                // If we do strictly relative minute comparison it's safest.
                                var now = new Date();
                                var pragueNowStr = new Intl.DateTimeFormat('en-CA', {
                                    // YYYY-MM-DD ...
                                    timeZone: 'Europe/Prague',
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false,
                                }).format(now);
                                // pragueNowStr is like "2026-02-05, 12:48:30" (depending on locale, en-CA gives ISO-ish)
                                // Let's parse parts manually to be safe across node versions
                                var f = new Intl.DateTimeFormat('en-US', {
                                    timeZone: 'Europe/Prague',
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                    hour12: false,
                                });
                                var parts = f.formatToParts(now);
                                var get = function (t) { var _a; return parseInt(((_a = parts.find(function (p) { return p.type === t; })) === null || _a === void 0 ? void 0 : _a.value) || '0'); };
                                // Current Prague Wall Clock
                                var pYear = get('year');
                                var pMonth = get('month'); // 1-12
                                var pDay = get('day');
                                var pHour = get('hour');
                                var pMinute = get('minute');
                                // Lesson Target (from input date + constant time)
                                var _a = dateStr.split('-').map(Number), lYear = _a[0], lMonth = _a[1], lDay = _a[2];
                                var _b = timeStr.split(':').map(Number), lStartH = _b[0], lStartM = _b[1];
                                // Check if Date matches (if student tries to check in for different day)
                                if (pYear !== lYear || pMonth !== lMonth || pDay !== lDay) {
                                    // It's a different day. Block?
                                    // "date" param is the shift date.
                                    // If today is 5th, shift is 5th -> OK.
                                    // If today is 6th, shift is 5th -> Late/Past.
                                    // We should compare full timestamps.
                                }
                                // Convert both to rough "Prague Minutes from Epoch" or just comparison?
                                // Create UTC dates from the definition values to compare numbers.
                                var nowPragueVal = new Date(Date.UTC(pYear, pMonth - 1, pDay, pHour, pMinute)).getTime();
                                var lessonStartVal = new Date(Date.UTC(lYear, lMonth - 1, lDay, lStartH, lStartM)).getTime();
                                return { nowPragueVal: nowPragueVal, lessonStartVal: lessonStartVal };
                            };
                            _a = parsePragueTime(date, times.start), nowPragueVal = _a.nowPragueVal, lessonStartVal = _a.lessonStartVal;
                            _b = times.end.split(':').map(Number), eH = _b[0], eM = _b[1];
                            _c = date.split('-').map(Number), lY = _c[0], lM = _c[1], lD = _c[2];
                            lessonEndVal = new Date(Date.UTC(lY, lM - 1, lD, eH, eM)).getTime();
                            allowStartVal = lessonStartVal - 15 * 60000;
                            console.log("[CheckIn Debug] Now: ".concat(new Date(nowPragueVal).toISOString(), " (Val: ").concat(nowPragueVal, "), Start: ").concat(times.start, " (Val: ").concat(lessonStartVal, "), Allow: ").concat(new Date(allowStartVal).toISOString()));
                            if (nowPragueVal < allowStartVal) {
                                diffM = Math.ceil((allowStartVal - nowPragueVal) / 60000);
                                throw new common_1.BadRequestException("Check-in mo\u017En\u00FD nejd\u0159\u00EDve 15 minut p\u0159ed za\u010D\u00E1tkem. (Za ".concat(diffM, " min)"));
                            }
                            if (nowPragueVal > lessonEndVal) {
                                throw new common_1.BadRequestException("Slu\u017Eba ji\u017E skon\u010Dila. (Konec: ".concat(times.end, ")"));
                            }
                            return [4 /*yield*/, this.prisma.helpdeskCheckIn.findFirst({
                                    where: { userId: user.id, shiftId: shift.id, endedAt: null },
                                })];
                        case 2:
                            active = _d.sent();
                            if (active)
                                throw new common_1.BadRequestException('Already checked in');
                            return [4 /*yield*/, this.prisma.helpdeskCheckIn.create({
                                    data: {
                                        shiftId: shift.id,
                                        userId: user.id,
                                        startedAt: new Date(), // ensure logged time is accurate
                                    },
                                })];
                        case 3:
                            checkIn = _d.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    actorUserId: user.id,
                                    actorRole: user.role,
                                    actorName: user.fullName,
                                    entityType: client_1.AuditEntityType.SCHEDULE_SLOT,
                                    entityId: shift.id,
                                    action: client_1.AuditAction.CHECK_IN_STARTED,
                                    message: 'Student check-in started',
                                    after: { checkInId: checkIn.id },
                                })];
                        case 4:
                            _d.sent();
                            return [2 /*return*/, checkIn];
                    }
                });
            });
        };
        CheckInService_1.prototype.endCheckIn = function (user, shiftId) {
            return __awaiter(this, void 0, void 0, function () {
                var active, endedCheckIn;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.helpdeskCheckIn.findFirst({
                                where: {
                                    shiftId: shiftId,
                                    endedAt: null,
                                    // If student, must be their own
                                    userId: user.role === client_1.Role.STUDENT ? user.id : undefined,
                                },
                                include: { user: true }, // to get name for audit if admin ends
                            })];
                        case 1:
                            active = _a.sent();
                            if (!active)
                                throw new common_1.NotFoundException('No active check-in found');
                            return [4 /*yield*/, this.prisma.helpdeskCheckIn.update({
                                    where: { id: active.id },
                                    data: {
                                        endedAt: new Date(),
                                        endedByUserId: user.id,
                                    },
                                })];
                        case 2:
                            endedCheckIn = _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    actorUserId: user.id,
                                    actorRole: user.role,
                                    actorName: user.fullName,
                                    entityType: client_1.AuditEntityType.SCHEDULE_SLOT,
                                    entityId: shiftId,
                                    action: client_1.AuditAction.CHECK_IN_ENDED,
                                    message: user.id === active.userId
                                        ? 'Student ended check-in'
                                        : 'Admin forced check-in end',
                                    after: {
                                        endedAt: endedCheckIn.endedAt,
                                        targetUser: active.user.fullName,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, endedCheckIn];
                    }
                });
            });
        };
        CheckInService_1.prototype.getActiveCheckIns = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.helpdeskCheckIn.findMany({
                            where: { endedAt: null },
                            include: { user: { select: { id: true, fullName: true } } },
                        })];
                });
            });
        };
        CheckInService_1.prototype.getUserActiveCheckIn = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.helpdeskCheckIn.findFirst({
                            where: { userId: userId, endedAt: null },
                            include: {
                                shift: true,
                            },
                        })];
                });
            });
        };
        return CheckInService_1;
    }());
    __setFunctionName(_classThis, "CheckInService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CheckInService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CheckInService = _classThis;
}();
exports.CheckInService = CheckInService;
