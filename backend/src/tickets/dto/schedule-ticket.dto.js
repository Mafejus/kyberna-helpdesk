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
exports.ScheduleTicketDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var ScheduleTicketDto = function () {
    var _a;
    var _plannedAt_decorators;
    var _plannedAt_initializers = [];
    var _plannedAt_extraInitializers = [];
    var _dueAt_decorators;
    var _dueAt_initializers = [];
    var _dueAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ScheduleTicketDto() {
                this.plannedAt = __runInitializers(this, _plannedAt_initializers, void 0);
                this.dueAt = (__runInitializers(this, _plannedAt_extraInitializers), __runInitializers(this, _dueAt_initializers, void 0));
                __runInitializers(this, _dueAt_extraInitializers);
            }
            return ScheduleTicketDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _plannedAt_decorators = [(0, swagger_1.ApiProperty)({ required: false, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _dueAt_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _plannedAt_decorators, { kind: "field", name: "plannedAt", static: false, private: false, access: { has: function (obj) { return "plannedAt" in obj; }, get: function (obj) { return obj.plannedAt; }, set: function (obj, value) { obj.plannedAt = value; } }, metadata: _metadata }, _plannedAt_initializers, _plannedAt_extraInitializers);
            __esDecorate(null, null, _dueAt_decorators, { kind: "field", name: "dueAt", static: false, private: false, access: { has: function (obj) { return "dueAt" in obj; }, get: function (obj) { return obj.dueAt; }, set: function (obj, value) { obj.dueAt = value; } }, metadata: _metadata }, _dueAt_initializers, _dueAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ScheduleTicketDto = ScheduleTicketDto;
