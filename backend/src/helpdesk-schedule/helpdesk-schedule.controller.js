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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.HelpdeskScheduleController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var client_1 = require("@prisma/client");
var HelpdeskScheduleController = function () {
    var _classDecorators = [(0, common_1.Controller)('schedule'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getWeek_decorators;
    var _getCurrentStatus_decorators;
    var _startCheckIn_decorators;
    var _getMyCheckIn_decorators;
    var _endCheckIn_decorators;
    var _listSwaps_decorators;
    var _createSwap_decorators;
    var _acceptSwap_decorators;
    var _cancelSwap_decorators;
    var _claim_decorators;
    var _unclaim_decorators;
    var _adminSet_decorators;
    var _adminRemove_decorators;
    var HelpdeskScheduleController = _classThis = /** @class */ (function () {
        function HelpdeskScheduleController_1(scheduleService, checkInService, swapService) {
            this.scheduleService = (__runInitializers(this, _instanceExtraInitializers), scheduleService);
            this.checkInService = checkInService;
            this.swapService = swapService;
        }
        HelpdeskScheduleController_1.prototype.getWeek = function (start) {
            return this.scheduleService.getWeekSlots(start);
        };
        HelpdeskScheduleController_1.prototype.getCurrentStatus = function () {
            return __awaiter(this, void 0, void 0, function () {
                var planned, active;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.scheduleService.getCurrentStatus()];
                        case 1:
                            planned = _a.sent();
                            return [4 /*yield*/, this.checkInService.getActiveCheckIns()];
                        case 2:
                            active = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, planned), { activeCheckIns: active })];
                    }
                });
            });
        };
        // --- CHECK-IN ---
        HelpdeskScheduleController_1.prototype.startCheckIn = function (req, dto) {
            return this.checkInService.startCheckIn(req.user, dto.date, dto.lesson);
        };
        HelpdeskScheduleController_1.prototype.getMyCheckIn = function (req) {
            return this.checkInService.getUserActiveCheckIn(req.user.id);
        };
        HelpdeskScheduleController_1.prototype.endCheckIn = function (req, dto) {
            return this.checkInService.endCheckIn(req.user, dto.shiftId);
        };
        // --- SWAPS ---
        HelpdeskScheduleController_1.prototype.listSwaps = function (week) {
            return this.swapService.listOffers(week);
        };
        HelpdeskScheduleController_1.prototype.createSwap = function (req, dto) {
            return this.swapService.createOffer(req.user, dto.date, dto.lesson);
        };
        HelpdeskScheduleController_1.prototype.acceptSwap = function (req, id) {
            return this.swapService.acceptOffer(req.user, id);
        };
        HelpdeskScheduleController_1.prototype.cancelSwap = function (req, id) {
            return this.swapService.cancelOffer(req.user, id);
        };
        // --- EXISTING ---
        HelpdeskScheduleController_1.prototype.claim = function (req, dto) {
            return this.scheduleService.claimSlot(req.user, dto.date, dto.lesson);
        };
        HelpdeskScheduleController_1.prototype.unclaim = function (req, dto) {
            return this.scheduleService.unclaimSlot(req.user, dto.date, dto.lesson);
        };
        HelpdeskScheduleController_1.prototype.adminSet = function (dto) {
            // Missing user for audit? Should add req.user
            // Fix: Pass undefined user for now or update service signature later
            return this.scheduleService.adminSetSlot(dto.date, dto.lesson, dto.studentIds);
        };
        HelpdeskScheduleController_1.prototype.adminRemove = function (dto) {
            return this.scheduleService.adminRemoveSlot(dto.date, dto.lesson, dto.studentId);
        };
        return HelpdeskScheduleController_1;
    }());
    __setFunctionName(_classThis, "HelpdeskScheduleController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getWeek_decorators = [(0, common_1.Get)('week')];
        _getCurrentStatus_decorators = [(0, common_1.Get)('now')];
        _startCheckIn_decorators = [(0, common_1.Post)('checkin/start'), (0, roles_decorator_1.Roles)(client_1.Role.STUDENT)];
        _getMyCheckIn_decorators = [(0, common_1.Get)('checkin/me'), (0, roles_decorator_1.Roles)(client_1.Role.STUDENT)];
        _endCheckIn_decorators = [(0, common_1.Post)('checkin/end'), (0, roles_decorator_1.Roles)(client_1.Role.STUDENT, client_1.Role.ADMIN)];
        _listSwaps_decorators = [(0, common_1.Get)('swaps')];
        _createSwap_decorators = [(0, common_1.Post)('swaps'), (0, roles_decorator_1.Roles)(client_1.Role.STUDENT)];
        _acceptSwap_decorators = [(0, common_1.Post)('swaps/:id/accept'), (0, roles_decorator_1.Roles)(client_1.Role.STUDENT)];
        _cancelSwap_decorators = [(0, common_1.Post)('swaps/:id/cancel'), (0, roles_decorator_1.Roles)(client_1.Role.STUDENT, client_1.Role.ADMIN)];
        _claim_decorators = [(0, common_1.Post)('claim'), (0, roles_decorator_1.Roles)(client_1.Role.STUDENT)];
        _unclaim_decorators = [(0, common_1.Post)('unclaim'), (0, roles_decorator_1.Roles)(client_1.Role.STUDENT)];
        _adminSet_decorators = [(0, common_1.Post)('admin/set'), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN)];
        _adminRemove_decorators = [(0, common_1.Post)('admin/remove'), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN)];
        __esDecorate(_classThis, null, _getWeek_decorators, { kind: "method", name: "getWeek", static: false, private: false, access: { has: function (obj) { return "getWeek" in obj; }, get: function (obj) { return obj.getWeek; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCurrentStatus_decorators, { kind: "method", name: "getCurrentStatus", static: false, private: false, access: { has: function (obj) { return "getCurrentStatus" in obj; }, get: function (obj) { return obj.getCurrentStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _startCheckIn_decorators, { kind: "method", name: "startCheckIn", static: false, private: false, access: { has: function (obj) { return "startCheckIn" in obj; }, get: function (obj) { return obj.startCheckIn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyCheckIn_decorators, { kind: "method", name: "getMyCheckIn", static: false, private: false, access: { has: function (obj) { return "getMyCheckIn" in obj; }, get: function (obj) { return obj.getMyCheckIn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _endCheckIn_decorators, { kind: "method", name: "endCheckIn", static: false, private: false, access: { has: function (obj) { return "endCheckIn" in obj; }, get: function (obj) { return obj.endCheckIn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listSwaps_decorators, { kind: "method", name: "listSwaps", static: false, private: false, access: { has: function (obj) { return "listSwaps" in obj; }, get: function (obj) { return obj.listSwaps; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSwap_decorators, { kind: "method", name: "createSwap", static: false, private: false, access: { has: function (obj) { return "createSwap" in obj; }, get: function (obj) { return obj.createSwap; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _acceptSwap_decorators, { kind: "method", name: "acceptSwap", static: false, private: false, access: { has: function (obj) { return "acceptSwap" in obj; }, get: function (obj) { return obj.acceptSwap; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelSwap_decorators, { kind: "method", name: "cancelSwap", static: false, private: false, access: { has: function (obj) { return "cancelSwap" in obj; }, get: function (obj) { return obj.cancelSwap; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _claim_decorators, { kind: "method", name: "claim", static: false, private: false, access: { has: function (obj) { return "claim" in obj; }, get: function (obj) { return obj.claim; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unclaim_decorators, { kind: "method", name: "unclaim", static: false, private: false, access: { has: function (obj) { return "unclaim" in obj; }, get: function (obj) { return obj.unclaim; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _adminSet_decorators, { kind: "method", name: "adminSet", static: false, private: false, access: { has: function (obj) { return "adminSet" in obj; }, get: function (obj) { return obj.adminSet; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _adminRemove_decorators, { kind: "method", name: "adminRemove", static: false, private: false, access: { has: function (obj) { return "adminRemove" in obj; }, get: function (obj) { return obj.adminRemove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HelpdeskScheduleController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HelpdeskScheduleController = _classThis;
}();
exports.HelpdeskScheduleController = HelpdeskScheduleController;
