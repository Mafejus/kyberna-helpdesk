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
exports.StatsService = void 0;
var common_1 = require("@nestjs/common");
var StatsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StatsService = _classThis = /** @class */ (function () {
        function StatsService_1(prisma) {
            this.prisma = prisma;
        }
        StatsService_1.prototype.getMyStats = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var completedServices, recentHistory;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.helpdeskCheckIn.count({
                                where: {
                                    userId: userId,
                                    endedAt: { not: null },
                                },
                            })];
                        case 1:
                            completedServices = _a.sent();
                            return [4 /*yield*/, this.prisma.helpdeskCheckIn.findMany({
                                    where: {
                                        userId: userId,
                                        endedAt: { not: null },
                                    },
                                    orderBy: { startedAt: 'desc' },
                                    take: 5,
                                })];
                        case 2:
                            recentHistory = _a.sent();
                            return [2 /*return*/, {
                                    completedServices: completedServices,
                                    recentHistory: recentHistory,
                                }];
                    }
                });
            });
        };
        StatsService_1.prototype.getTicketStats = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var stats, approvedCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.userScore.aggregate({
                                where: { userId: userId },
                                _sum: { points: true },
                            })];
                        case 1:
                            stats = _a.sent();
                            return [4 /*yield*/, this.prisma.userScore.count({
                                    where: { userId: userId, points: { gt: 0 } },
                                })];
                        case 2:
                            approvedCount = _a.sent();
                            return [2 /*return*/, {
                                    totalPoints: stats._sum.points || 0,
                                    approvedCount: approvedCount,
                                }];
                    }
                });
            });
        };
        StatsService_1.prototype.getAdminOverview = function () {
            return __awaiter(this, void 0, void 0, function () {
                var totalTickets, unassigned, inProgress, waiting, approved, rejected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.ticket.count()];
                        case 1:
                            totalTickets = _a.sent();
                            return [4 /*yield*/, this.prisma.ticket.count({
                                    where: { status: 'UNASSIGNED' },
                                })];
                        case 2:
                            unassigned = _a.sent();
                            return [4 /*yield*/, this.prisma.ticket.count({
                                    where: { status: 'IN_PROGRESS' },
                                })];
                        case 3:
                            inProgress = _a.sent();
                            return [4 /*yield*/, this.prisma.ticket.count({
                                    where: { status: 'DONE_WAITING_APPROVAL' },
                                })];
                        case 4:
                            waiting = _a.sent();
                            return [4 /*yield*/, this.prisma.ticket.count({
                                    where: { status: 'APPROVED' },
                                })];
                        case 5:
                            approved = _a.sent();
                            return [4 /*yield*/, this.prisma.ticket.count({
                                    where: { status: 'REJECTED' },
                                })];
                        case 6:
                            rejected = _a.sent();
                            return [2 /*return*/, {
                                    totalTickets: totalTickets,
                                    unassigned: unassigned,
                                    inProgress: inProgress,
                                    waiting: waiting,
                                    approved: approved,
                                    rejected: rejected,
                                }];
                    }
                });
            });
        };
        StatsService_1.prototype.getServiceLeaderboard = function () {
            return __awaiter(this, void 0, void 0, function () {
                var leaderboard, userIds, users;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.helpdeskCheckIn.groupBy({
                                by: ['userId'],
                                where: {
                                    endedAt: { not: null },
                                },
                                _count: {
                                    id: true,
                                },
                                orderBy: {
                                    _count: {
                                        id: 'desc',
                                    },
                                },
                                take: 10,
                            })];
                        case 1:
                            leaderboard = _a.sent();
                            userIds = leaderboard.map(function (item) { return item.userId; });
                            return [4 /*yield*/, this.prisma.user.findMany({
                                    where: { id: { in: userIds } },
                                    select: { id: true, fullName: true, email: true },
                                })];
                        case 2:
                            users = _a.sent();
                            return [2 /*return*/, leaderboard.map(function (item) {
                                    var user = users.find(function (u) { return u.id === item.userId; });
                                    return {
                                        user: user,
                                        completedServices: item._count.id,
                                    };
                                })];
                    }
                });
            });
        };
        StatsService_1.prototype.getAdminLeaderboard = function () {
            return __awaiter(this, void 0, void 0, function () {
                var students, leaderboard, _i, students_1, student, scoreStats, solvedCount, totalPoints;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findMany({
                                where: { role: 'STUDENT', isActive: true },
                                select: { id: true, fullName: true },
                            })];
                        case 1:
                            students = _a.sent();
                            leaderboard = [];
                            _i = 0, students_1 = students;
                            _a.label = 2;
                        case 2:
                            if (!(_i < students_1.length)) return [3 /*break*/, 6];
                            student = students_1[_i];
                            return [4 /*yield*/, this.prisma.userScore.aggregate({
                                    where: { userId: student.id },
                                    _sum: { points: true },
                                    _count: { _all: true },
                                })];
                        case 3:
                            scoreStats = _a.sent();
                            return [4 /*yield*/, this.prisma.userScore.count({
                                    where: { userId: student.id, points: { gt: 0 } },
                                })];
                        case 4:
                            solvedCount = _a.sent();
                            totalPoints = scoreStats._sum.points || 0;
                            if (scoreStats._count._all > 0) {
                                leaderboard.push({
                                    userId: student.id,
                                    fullName: student.fullName,
                                    points: totalPoints,
                                    approvedCount: solvedCount,
                                });
                            }
                            _a.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 2];
                        case 6: return [2 /*return*/, leaderboard.sort(function (a, b) { return b.points - a.points; }).slice(0, 50)];
                    }
                });
            });
        };
        return StatsService_1;
    }());
    __setFunctionName(_classThis, "StatsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StatsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StatsService = _classThis;
}();
exports.StatsService = StatsService;
