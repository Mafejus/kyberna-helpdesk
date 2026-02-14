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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageAssigneesDto = exports.AssigneeAction = exports.AssignTicketDto = exports.RejectTicketDto = exports.ApproveTicketDto = exports.TicketActionDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var TicketActionDto = function () {
    var _a;
    var _note_decorators;
    var _note_initializers = [];
    var _note_extraInitializers = [];
    return _a = /** @class */ (function () {
            function TicketActionDto() {
                this.note = __runInitializers(this, _note_initializers, void 0); // studentWorkNote or adminApprovalNote
                __runInitializers(this, _note_extraInitializers);
            }
            return TicketActionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _note_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _note_decorators, { kind: "field", name: "note", static: false, private: false, access: { has: function (obj) { return "note" in obj; }, get: function (obj) { return obj.note; }, set: function (obj, value) { obj.note = value; } }, metadata: _metadata }, _note_initializers, _note_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.TicketActionDto = TicketActionDto;
var ApproveTicketDto = function () {
    var _a;
    var _difficultyPoints_decorators;
    var _difficultyPoints_initializers = [];
    var _difficultyPoints_extraInitializers = [];
    var _adminApprovalNote_decorators;
    var _adminApprovalNote_initializers = [];
    var _adminApprovalNote_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ApproveTicketDto() {
                this.difficultyPoints = __runInitializers(this, _difficultyPoints_initializers, void 0);
                this.adminApprovalNote = (__runInitializers(this, _difficultyPoints_extraInitializers), __runInitializers(this, _adminApprovalNote_initializers, void 0));
                __runInitializers(this, _adminApprovalNote_extraInitializers);
            }
            return ApproveTicketDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _difficultyPoints_decorators = [(0, swagger_1.ApiProperty)({ enum: [1, 3, 5] }), (0, class_validator_1.IsIn)([1, 3, 5])];
            _adminApprovalNote_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _difficultyPoints_decorators, { kind: "field", name: "difficultyPoints", static: false, private: false, access: { has: function (obj) { return "difficultyPoints" in obj; }, get: function (obj) { return obj.difficultyPoints; }, set: function (obj, value) { obj.difficultyPoints = value; } }, metadata: _metadata }, _difficultyPoints_initializers, _difficultyPoints_extraInitializers);
            __esDecorate(null, null, _adminApprovalNote_decorators, { kind: "field", name: "adminApprovalNote", static: false, private: false, access: { has: function (obj) { return "adminApprovalNote" in obj; }, get: function (obj) { return obj.adminApprovalNote; }, set: function (obj, value) { obj.adminApprovalNote = value; } }, metadata: _metadata }, _adminApprovalNote_initializers, _adminApprovalNote_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ApproveTicketDto = ApproveTicketDto;
var RejectTicketDto = function () {
    var _a;
    var _adminApprovalNote_decorators;
    var _adminApprovalNote_initializers = [];
    var _adminApprovalNote_extraInitializers = [];
    var _penaltyPoints_decorators;
    var _penaltyPoints_initializers = [];
    var _penaltyPoints_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RejectTicketDto() {
                this.adminApprovalNote = __runInitializers(this, _adminApprovalNote_initializers, void 0);
                this.penaltyPoints = (__runInitializers(this, _adminApprovalNote_extraInitializers), __runInitializers(this, _penaltyPoints_initializers, void 0));
                __runInitializers(this, _penaltyPoints_extraInitializers);
            }
            return RejectTicketDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _adminApprovalNote_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _penaltyPoints_decorators = [(0, swagger_1.ApiProperty)({ enum: [1, 3, 5], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)([1, 3, 5])];
            __esDecorate(null, null, _adminApprovalNote_decorators, { kind: "field", name: "adminApprovalNote", static: false, private: false, access: { has: function (obj) { return "adminApprovalNote" in obj; }, get: function (obj) { return obj.adminApprovalNote; }, set: function (obj, value) { obj.adminApprovalNote = value; } }, metadata: _metadata }, _adminApprovalNote_initializers, _adminApprovalNote_extraInitializers);
            __esDecorate(null, null, _penaltyPoints_decorators, { kind: "field", name: "penaltyPoints", static: false, private: false, access: { has: function (obj) { return "penaltyPoints" in obj; }, get: function (obj) { return obj.penaltyPoints; }, set: function (obj, value) { obj.penaltyPoints = value; } }, metadata: _metadata }, _penaltyPoints_initializers, _penaltyPoints_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RejectTicketDto = RejectTicketDto;
var AssignTicketDto = function () {
    var _a;
    var _studentIds_decorators;
    var _studentIds_initializers = [];
    var _studentIds_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AssignTicketDto() {
                this.studentIds = __runInitializers(this, _studentIds_initializers, void 0);
                __runInitializers(this, _studentIds_extraInitializers);
            }
            return AssignTicketDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentIds_decorators = [(0, swagger_1.ApiProperty)({ type: [String] }), (0, class_validator_1.IsUUID)('4', { each: true })];
            __esDecorate(null, null, _studentIds_decorators, { kind: "field", name: "studentIds", static: false, private: false, access: { has: function (obj) { return "studentIds" in obj; }, get: function (obj) { return obj.studentIds; }, set: function (obj, value) { obj.studentIds = value; } }, metadata: _metadata }, _studentIds_initializers, _studentIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AssignTicketDto = AssignTicketDto;
var AssigneeAction;
(function (AssigneeAction) {
    AssigneeAction["ADD"] = "ADD";
    AssigneeAction["REMOVE"] = "REMOVE";
    AssigneeAction["SET_FIRST"] = "SET_FIRST";
})(AssigneeAction || (exports.AssigneeAction = AssigneeAction = {}));
var ManageAssigneesDto = function () {
    var _a;
    var _action_decorators;
    var _action_initializers = [];
    var _action_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ManageAssigneesDto() {
                this.action = __runInitializers(this, _action_initializers, void 0);
                this.userId = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                __runInitializers(this, _userId_extraInitializers);
            }
            return ManageAssigneesDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _action_decorators = [(0, swagger_1.ApiProperty)({ enum: AssigneeAction }), (0, class_validator_1.IsEnum)(AssigneeAction)];
            _userId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: function (obj) { return "action" in obj; }, get: function (obj) { return obj.action; }, set: function (obj, value) { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ManageAssigneesDto = ManageAssigneesDto;
