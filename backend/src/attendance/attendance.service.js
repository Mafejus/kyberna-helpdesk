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
exports.AttendanceService = void 0;
var common_1 = require("@nestjs/common");
var constants_1 = require("../common/constants");
var client_1 = require("@prisma/client");
var AttendanceService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AttendanceService = _classThis = /** @class */ (function () {
        function AttendanceService_1(prisma) {
            this.prisma = prisma;
        }
        AttendanceService_1.prototype.getPragueDate = function (date) {
            if (date === void 0) { date = new Date(); }
            // Current time in Prague
            // We want a Date object that represents the same "wall clock" time as in Prague
            // but in local system time (for comparisons).
            // Actually, best to just use timestamps and proper TZ conversions.
            // But for date string comparisons (YYYY-MM-DD), we need Prague date.
            var timeZone = 'Europe/Prague';
            var formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timeZone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });
            // Format: MM/DD/YYYY, HH:mm:ss
            var parts = formatter.formatToParts(date);
            var getPart = function (type) { var _a; return (_a = parts.find(function (p) { return p.type === type; })) === null || _a === void 0 ? void 0 : _a.value; };
            var year = parseInt(getPart('year'));
            var month = parseInt(getPart('month')) - 1;
            var day = parseInt(getPart('day'));
            var hour = parseInt(getPart('hour'));
            var minute = parseInt(getPart('minute'));
            var second = parseInt(getPart('second'));
            // Attempt to construct a Date object that LOOKS like Prague time (even if stored as local/UTC)
            // This is useful for "is it 8:00 AM yet" logic where 8:00 AM is Prague time.
            return new Date(year, month, day, hour, minute, second);
        };
        AttendanceService_1.prototype.getLessonTimes = function (dateStr, lesson) {
            var times = constants_1.LESSON_TIMES[lesson];
            if (!times)
                return null;
            // dateStr is YYYY-MM-DD
            // Times are HH:mm
            // We need to construct Date objects for Start and End in Prague TZ context
            // Ideally we want to compare UNIX timestamps.
            // dateStr + times.start -> ISO string in Prague Offset?
            // Let's assume input dateStr is Prague-based date.
            // Helper to create Date from strings assuming Prague Time
            // We can't easily do "new Date('2026-02-05T07:50:00+01:00')" without knowing offset (DST?)
            // But generally Javascript handles local.
            // We should rely on libraries but raw JS:
            // Create UTC date then shift? No.
            // Let's simplify: Compare string-based times if in same day, or relative timestamps.
            // Or simpler: Construct string "YYYY-MM-DDTHH:mm:00" and append a known offset or use generic if server is UTC.
            // Server might be UTC.
            // "2026-02-05T07:50:00" as a string.
            // If we parse this as UTC, we get a timestamp.
            // If we parse current 'now' as UTC-equivalent of Prague time, we can compare.
            // Strategy: Convert EVERYTHING to "Prague Wall Clock Time" (as basic numbers/dates) and compare there.
            // 1. Get NOW in Prague (GetPragueDate returns a Date object where .getHours() is Prague hour).
            // 2. Parse Shift Start/End into Date objects (Year/Month/Day from shift.date, H/M from LESSON_TIMES)
            // 3. Compare.
            return { startStr: times.start, endStr: times.end };
        };
        // Reusable Status Logic
        AttendanceService_1.prototype.calculateStatus = function (shiftDate, // YYYY-MM-DD
        lesson, checkIn, now) {
            var _this = this;
            var times = constants_1.LESSON_TIMES[lesson];
            if (!times)
                return { status: 'UPCOMING', minutesWorked: 0, lateByMinutes: 0 };
            // Parse Shift Start/End (Prague Wall Clock)
            var _a = shiftDate.split('-').map(Number), sy = _a[0], sm = _a[1], sd = _a[2];
            var _b = times.start.split(':').map(Number), sh = _b[0], smin = _b[1];
            var _c = times.end.split(':').map(Number), eh = _c[0], emin = _c[1];
            // Create Date objects treating the inputs as local time components = Prague components
            var shiftStart = new Date(sy, sm - 1, sd, sh, smin, 0);
            var shiftEnd = new Date(sy, sm - 1, sd, eh, emin, 0);
            // Tolerance
            var lateThreshold = new Date(shiftStart.getTime() + constants_1.ATTENDANCE_TOLERANCE.LATE_MINUTES * 60000);
            var noShowThreshold = new Date(shiftStart.getTime() + constants_1.ATTENDANCE_TOLERANCE.NO_SHOW_MINUTES * 60000);
            // Check-in times need to be converted to Prague Wall Clock too?
            // "startedAt" from Prisma is a Date object (UTC usually).
            // We need to convert that UTC timestamp to Prague Wall Clock Date.
            var toPrague = function (d) { return _this.getPragueDate(d); };
            var checkInStart = checkIn ? toPrague(checkIn.startedAt) : null;
            var checkInEnd = (checkIn === null || checkIn === void 0 ? void 0 : checkIn.endedAt) ? toPrague(checkIn.endedAt) : null;
            // 1. Upcoming
            if (now < shiftStart && !checkInStart) {
                return { status: 'UPCOMING', minutesWorked: 0, lateByMinutes: 0 };
            }
            // 2. No Show
            // If now is past NoShow threshold AND (no checkin OR checkin started AFTER threshold)
            // Actually if checkin exists but is super late, is it No Show or Late?
            // Request says: "No-show = nemá start do 10 minut po začátku." -> implying if they come after 10m it is still No Show?
            // Usually systems mark as No Show then.
            // And "Late = start po začátku + 5 minut".
            // So if start at +8 mins -> Late.
            // If start at +12 mins -> No Show (technically). Or just Very Late?
            // Definition: "No-show = je naplánovaný ... ale nemá check-in start do určité tolerance."
            // So if checkin exists later, maybe we count it?
            // But let's stick to strict definition: "Has start < 10m".
            // If they arrive after 20 mins, they technically have a start time.
            // But the system might have already flagged them No Show.
            // We prioritize actual data: If they HAVE a checkin, they are NOT No-Show (unless rule says otherwise).
            // Let's assume: If CheckIn exists:
            //    If Start > ShiftStart + 5 -> Late
            //    Else -> Worked/In Progress
            // If No CheckIn:
            //    If Now > ShiftStart + 10 -> No Show
            //    Else -> Upcoming/In Progress waiting
            if (checkInStart) {
                // Calculate lateness
                var diffMs = checkInStart.getTime() - shiftStart.getTime();
                var lateMins = Math.max(0, Math.floor(diffMs / 60000));
                var isLate = lateMins > constants_1.ATTENDANCE_TOLERANCE.LATE_MINUTES;
                // Worked Minutes
                // If ended: End - Start (clamped to lesson duration?)
                // Request: "diff(checkout - checkin) clamp do [0, lessonDuration]"
                // Lesson Duration
                var lessonDurationMs = shiftEnd.getTime() - shiftStart.getTime();
                var lessonDurationMins = Math.floor(lessonDurationMs / 60000);
                var workedMs = 0;
                if (checkInEnd) {
                    workedMs = checkInEnd.getTime() - checkInStart.getTime();
                }
                else {
                    // Still running or missing checkout
                    if (now > shiftEnd) {
                        // shift ended
                        // "pokud chybí checkout a shift skončil: počítej do plannedEnd"
                        // Wait, request said: "počítaj do plannedEnd" but also "označ MISSING_CHECKOUT"
                        // So we assume they worked until the end.
                        // Ideally: Worked = shiftEnd - checkInStart
                        // But wait, if they arrived late?
                        // shiftEnd - checkInStart is correct "available time".
                        workedMs = shiftEnd.getTime() - checkInStart.getTime();
                    }
                    else {
                        // Shift is running
                        workedMs = now.getTime() - checkInStart.getTime();
                    }
                }
                // Clamp
                if (workedMs < 0)
                    workedMs = 0;
                if (workedMs > lessonDurationMs)
                    workedMs = lessonDurationMs; // Clamp max to lesson duration
                var minutesWorked = Math.floor(workedMs / 60000);
                if (checkInEnd) {
                    return {
                        status: isLate ? 'LATE' : 'WORKED',
                        minutesWorked: minutesWorked,
                        lateByMinutes: isLate ? lateMins : 0,
                    };
                }
                else {
                    // No End Checkin
                    if (now > shiftEnd) {
                        return {
                            status: 'MISSING_CHECKOUT',
                            minutesWorked: minutesWorked, // Calculated as if they stayed till end
                            lateByMinutes: isLate ? lateMins : 0,
                        };
                    }
                    else {
                        return {
                            status: 'IN_PROGRESS',
                            minutesWorked: minutesWorked, // Until now
                            lateByMinutes: isLate ? lateMins : 0,
                        };
                    }
                }
            }
            else {
                // No Checkin
                if (now > noShowThreshold) {
                    return { status: 'NO_SHOW', minutesWorked: 0, lateByMinutes: 0 };
                }
                else {
                    return { status: 'UPCOMING', minutesWorked: 0, lateByMinutes: 0 };
                }
            }
        };
        // --- Endpoints ---
        AttendanceService_1.prototype.getAttendanceSummary = function (from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var students, now, summary;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findMany({
                                where: { role: client_1.Role.STUDENT },
                                include: {
                                    helpdeskShifts: {
                                        where: {
                                            shift: {
                                                date: { gte: from, lte: to },
                                            },
                                        },
                                        include: {
                                            shift: {
                                                include: {
                                                    checkIns: true, // We need to match checkin to user
                                                },
                                            },
                                        },
                                    },
                                    // We can also just query ShiftAssignees directly for better perf?
                                    // But iterating students ensures we list students with 0 shifts too?
                                    // "Vrátí list studentů s metrikami" -> probably all students.
                                },
                            })];
                        case 1:
                            students = _a.sent();
                            now = this.getPragueDate();
                            summary = students.map(function (student) {
                                var totalShifts = 0;
                                var workedShifts = 0;
                                var lateShifts = 0;
                                var noShowShifts = 0;
                                var missingCheckoutShifts = 0;
                                var totalMinutesWorked = 0;
                                // Process shifts
                                for (var _i = 0, _a = student.helpdeskShifts; _i < _a.length; _i++) {
                                    var assignment = _a[_i];
                                    var shift = assignment.shift;
                                    // Find checkin for this user and this shift
                                    var checkIn = shift.checkIns.find(function (c) { return c.userId === student.id; });
                                    var _b = _this.calculateStatus(shift.date, shift.lesson, checkIn, now), status_1 = _b.status, minutesWorked = _b.minutesWorked;
                                    totalShifts++;
                                    totalMinutesWorked += minutesWorked;
                                    switch (status_1) {
                                        case 'WORKED':
                                            workedShifts++;
                                            break;
                                        case 'LATE':
                                            lateShifts++;
                                            break; // "LATE" usually counts as worked too? Or separate?
                                        // Request says: "workedShifts", "lateShifts". Usually disjoint or overlapping?
                                        // "Odpracováno dnes" vs "Pozdní dnes".
                                        // Logic: If LATE, is it WORKED? Usually yes but flagged.
                                        // Let's count specific buckets.
                                        // "totalWorked" usually implies they showed up.
                                        // Let's assume "workedShifts" = WORKED + LATE + MISSING_CHECKOUT (they were there).
                                        // But strictly the prompt asks for specific fields.
                                        // Let's separate them:
                                        // workedShifts (Pure worked?)
                                        // lateShifts
                                        // noShowShifts
                                        // missingCheckoutShifts
                                        // But wait: "Admin musí vidět ... kolik odpracoval".
                                        // I will make "workedShifts" be the count of non-NoShow?
                                        // Or strict status === WORKED?
                                        // Let's stick to status counts for the grid, but "totalWorked" metric might combine.
                                        // In the summary object I will return strict counts per status.
                                        // And user can sum them up if needed.
                                        case 'NO_SHOW':
                                            noShowShifts++;
                                            break;
                                        case 'MISSING_CHECKOUT':
                                            missingCheckoutShifts++;
                                            break;
                                        case 'IN_PROGRESS':
                                            break; // Don't count as worked yet? Or do?
                                    }
                                }
                                var realWorkedCount = workedShifts + lateShifts + missingCheckoutShifts; // They attended
                                return {
                                    id: student.id,
                                    fullName: student.fullName,
                                    email: student.email,
                                    totalShifts: totalShifts,
                                    workedShifts: realWorkedCount, // "worked" generally means attended
                                    stats: {
                                        cleanWorked: workedShifts,
                                        late: lateShifts,
                                        noShow: noShowShifts,
                                        missingCheckout: missingCheckoutShifts,
                                    },
                                    totalMinutesWorked: totalMinutesWorked,
                                    reliability: totalShifts > 0
                                        ? Math.round((realWorkedCount / totalShifts) * 100)
                                        : 100,
                                };
                            });
                            return [2 /*return*/, summary];
                    }
                });
            });
        };
        AttendanceService_1.prototype.getStudentAttendance = function (userId, from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var now, whereClause, assignments;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = this.getPragueDate();
                            whereClause = { userId: userId };
                            if (from || to) {
                                whereClause.shift = {
                                    date: {
                                        gte: from,
                                        lte: to,
                                    },
                                };
                            }
                            return [4 /*yield*/, this.prisma.helpdeskShiftAssignee.findMany({
                                    where: whereClause,
                                    include: {
                                        shift: {
                                            include: { checkIns: { where: { userId: userId } } },
                                        },
                                    },
                                    orderBy: [{ shift: { date: 'desc' } }, { shift: { lesson: 'desc' } }], // Newest date first, then highest lesson (evening) first
                                })];
                        case 1:
                            assignments = _a.sent();
                            return [2 /*return*/, assignments.map(function (a) {
                                    var shift = a.shift;
                                    var checkIn = shift.checkIns[0];
                                    var calc = _this.calculateStatus(shift.date, shift.lesson, checkIn, now);
                                    var times = constants_1.LESSON_TIMES[shift.lesson];
                                    return {
                                        id: shift.id,
                                        date: shift.date,
                                        lesson: shift.lesson,
                                        plannedStart: times === null || times === void 0 ? void 0 : times.start,
                                        plannedEnd: times === null || times === void 0 ? void 0 : times.end,
                                        checkInAt: (checkIn === null || checkIn === void 0 ? void 0 : checkIn.startedAt) || null,
                                        checkOutAt: (checkIn === null || checkIn === void 0 ? void 0 : checkIn.endedAt) || null,
                                        status: calc.status,
                                        minutesWorked: calc.minutesWorked,
                                        lateByMinutes: calc.lateByMinutes,
                                    };
                                })];
                    }
                });
            });
        };
        AttendanceService_1.prototype.getWeekCalendar = function (start) {
            return __awaiter(this, void 0, void 0, function () {
                var dates, d, i, dateStr, shifts, now, result, _loop_1, _i, dates_1, date;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dates = [];
                            d = new Date(start);
                            for (i = 0; i < 5; i++) {
                                dateStr = new Date(d.getTime() + i * 86400000)
                                    .toISOString()
                                    .split('T')[0];
                                dates.push(dateStr);
                            }
                            return [4 /*yield*/, this.prisma.helpdeskShift.findMany({
                                    where: { date: { in: dates } },
                                    include: {
                                        assignees: { include: { user: true } },
                                        checkIns: true,
                                    },
                                })];
                        case 1:
                            shifts = _a.sent();
                            now = this.getPragueDate();
                            result = {};
                            _loop_1 = function (date) {
                                result[date] = {};
                                var _loop_2 = function (lesson) {
                                    var shift = shifts.find(function (s) { return s.date === date && s.lesson === lesson; });
                                    if (shift) {
                                        var assignees = shift.assignees.map(function (a) {
                                            var checkIn = shift.checkIns.find(function (c) { return c.userId === a.userId; });
                                            var calc = _this.calculateStatus(shift.date, shift.lesson, checkIn, now);
                                            return {
                                                user: { id: a.user.id, fullName: a.user.fullName },
                                                status: calc.status,
                                            };
                                        });
                                        result[date][lesson] = { assignees: assignees };
                                    }
                                    else {
                                        result[date][lesson] = { assignees: [] };
                                    }
                                };
                                for (var lesson = 1; lesson <= 12; lesson++) {
                                    _loop_2(lesson);
                                }
                            };
                            for (_i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
                                date = dates_1[_i];
                                _loop_1(date);
                            }
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        AttendanceService_1.prototype.getCurrentStatus = function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, dateStr, nowMinutes, currentLesson, _i, _a, _b, l, times, _c, sh, sm, _d, eh, em, startM, endM, currentSlot, shift_1;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            now = this.getPragueDate();
                            dateStr = now.toISOString().split('T')[0];
                            nowMinutes = now.getHours() * 60 + now.getMinutes();
                            currentLesson = -1;
                            for (_i = 0, _a = Object.entries(constants_1.LESSON_TIMES); _i < _a.length; _i++) {
                                _b = _a[_i], l = _b[0], times = _b[1];
                                _c = times.start.split(':').map(Number), sh = _c[0], sm = _c[1];
                                _d = times.end.split(':').map(Number), eh = _d[0], em = _d[1];
                                startM = sh * 60 + sm;
                                endM = eh * 60 + em;
                                if (nowMinutes >= startM && nowMinutes <= endM) {
                                    currentLesson = parseInt(l);
                                    break;
                                }
                            }
                            currentSlot = null;
                            if (!(currentLesson !== -1)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.helpdeskShift.findUnique({
                                    where: { date_lesson: { date: dateStr, lesson: currentLesson } },
                                    include: { assignees: { include: { user: true } }, checkIns: true },
                                })];
                        case 1:
                            shift_1 = _e.sent();
                            if (shift_1) {
                                currentSlot = {
                                    lesson: currentLesson,
                                    date: dateStr,
                                    users: shift_1.assignees.map(function (a) {
                                        var checkIn = shift_1.checkIns.find(function (c) { return c.userId === a.userId; });
                                        return {
                                            fullName: a.user.fullName,
                                            hasCheckIn: !!checkIn,
                                            checkInStart: checkIn === null || checkIn === void 0 ? void 0 : checkIn.startedAt,
                                        };
                                    }),
                                };
                            }
                            _e.label = 2;
                        case 2: return [2 /*return*/, { currentSlot: currentSlot }];
                    }
                });
            });
        };
        AttendanceService_1.prototype.exportCsv = function (from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var data, header, rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getAttendanceSummary(from, to)];
                        case 1:
                            data = _a.sent();
                            header = 'Student,Email,Total Shifts,Worked Shifts,Late,No-Show,Missing Checkout,Total Minutes\n';
                            rows = data
                                .map(function (d) {
                                return "\"".concat(d.fullName, "\",\"").concat(d.email, "\",").concat(d.totalShifts, ",").concat(d.workedShifts, ",").concat(d.stats.late, ",").concat(d.stats.noShow, ",").concat(d.stats.missingCheckout, ",").concat(d.totalMinutesWorked);
                            })
                                .join('\n');
                            return [2 /*return*/, header + rows];
                    }
                });
            });
        };
        return AttendanceService_1;
    }());
    __setFunctionName(_classThis, "AttendanceService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AttendanceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AttendanceService = _classThis;
}();
exports.AttendanceService = AttendanceService;
