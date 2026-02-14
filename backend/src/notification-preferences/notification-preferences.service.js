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
exports.NotificationPreferencesService = void 0;
var common_1 = require("@nestjs/common");
var constants_1 = require("./constants");
var NotificationPreferencesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var NotificationPreferencesService = _classThis = /** @class */ (function () {
        function NotificationPreferencesService_1(prisma) {
            this.prisma = prisma;
        }
        /**
         * Returns generic preferences filtered by USER ROLE.
         * If a setting is missing in DB, it defaults to TRUE (enabled).
         */
        NotificationPreferencesService_1.prototype.getPreferences = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var pref, allowedTypes, settings, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.notificationPreference.findUnique({
                                where: { userId: user.id },
                            })];
                        case 1:
                            pref = _a.sent();
                            allowedTypes = constants_1.ROLE_NOTIFICATIONS[user.role] || [];
                            settings = (pref === null || pref === void 0 ? void 0 : pref.settings) || {};
                            result = allowedTypes.map(function (type) { return ({
                                type: type,
                                enabled: settings[type] !== false, // Default true
                            }); });
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        NotificationPreferencesService_1.prototype.updatePreferences = function (user, updates) {
            return __awaiter(this, void 0, void 0, function () {
                var allowedTypes, newSettings, _i, updates_1, update, existing, currentSettings, mergedSettings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            allowedTypes = constants_1.ROLE_NOTIFICATIONS[user.role] || [];
                            newSettings = {};
                            // Validate payloads
                            for (_i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
                                update = updates_1[_i];
                                if (!allowedTypes.includes(update.type)) {
                                    throw new common_1.ForbiddenException("Notification type ".concat(update.type, " is not allowed for role ").concat(user.role));
                                }
                                newSettings[update.type] = update.enabled;
                            }
                            return [4 /*yield*/, this.prisma.notificationPreference.findUnique({
                                    where: { userId: user.id },
                                })];
                        case 1:
                            existing = _a.sent();
                            currentSettings = (existing === null || existing === void 0 ? void 0 : existing.settings) || {};
                            mergedSettings = __assign(__assign({}, currentSettings), newSettings);
                            return [2 /*return*/, this.prisma.notificationPreference.upsert({
                                    where: { userId: user.id },
                                    update: { settings: mergedSettings },
                                    create: {
                                        userId: user.id,
                                        settings: mergedSettings,
                                    },
                                })];
                    }
                });
            });
        };
        /**
         * GUARD: Check if a notification should be sent based on user ROLE and PREFERENCES.
         */
        NotificationPreferencesService_1.prototype.shouldSend = function (user, type) {
            return __awaiter(this, void 0, void 0, function () {
                var allowedTypes, pref, settings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            allowedTypes = constants_1.ROLE_NOTIFICATIONS[user.role];
                            if (!allowedTypes || !allowedTypes.includes(type)) {
                                console.warn("Attempted to send notification ".concat(type, " to user ").concat(user.id, " (Role: ").concat(user.role, ") but it is not allowed for this role."));
                                return [2 /*return*/, false];
                            }
                            return [4 /*yield*/, this.prisma.notificationPreference.findUnique({
                                    where: { userId: user.id },
                                })];
                        case 1:
                            pref = _a.sent();
                            if (!pref || !pref.settings)
                                return [2 /*return*/, true]; // Default true
                            settings = pref.settings;
                            if (settings[type] === false)
                                return [2 /*return*/, false];
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * Bulk check for multiple users.
         * Returns list of userIds that SHOULD receive the notification.
         */
        NotificationPreferencesService_1.prototype.filterRecipients = function (users, type) {
            return __awaiter(this, void 0, void 0, function () {
                var userIds, prefs, settingsMap, _i, prefs_1, p, eligibleUserIds, _a, users_1, user, allowedTypes, userSettings;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (users.length === 0)
                                return [2 /*return*/, []];
                            userIds = users.map(function (u) { return u.id; });
                            return [4 /*yield*/, this.prisma.notificationPreference.findMany({
                                    where: {
                                        userId: { in: userIds },
                                    },
                                })];
                        case 1:
                            prefs = _b.sent();
                            settingsMap = new Map();
                            for (_i = 0, prefs_1 = prefs; _i < prefs_1.length; _i++) {
                                p = prefs_1[_i];
                                settingsMap.set(p.userId, p.settings);
                            }
                            eligibleUserIds = [];
                            for (_a = 0, users_1 = users; _a < users_1.length; _a++) {
                                user = users_1[_a];
                                allowedTypes = constants_1.ROLE_NOTIFICATIONS[user.role];
                                if (!allowedTypes || !allowedTypes.includes(type)) {
                                    continue; // Skip ineligible role
                                }
                                userSettings = settingsMap.get(user.id);
                                if (userSettings && userSettings[type] === false) {
                                    continue; // Explicitly disabled
                                }
                                eligibleUserIds.push(user.id);
                            }
                            return [2 /*return*/, eligibleUserIds];
                    }
                });
            });
        };
        return NotificationPreferencesService_1;
    }());
    __setFunctionName(_classThis, "NotificationPreferencesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationPreferencesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationPreferencesService = _classThis;
}();
exports.NotificationPreferencesService = NotificationPreferencesService;
