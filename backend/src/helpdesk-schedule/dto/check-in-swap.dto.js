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
exports.SwapCreateDto = exports.CheckInEndDto = exports.CheckInStartDto = void 0;
var class_validator_1 = require("class-validator");
var CheckInStartDto = function () {
    var _a;
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _lesson_decorators;
    var _lesson_initializers = [];
    var _lesson_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CheckInStartDto() {
                this.date = __runInitializers(this, _date_initializers, void 0);
                this.lesson = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _lesson_initializers, void 0));
                __runInitializers(this, _lesson_extraInitializers);
            }
            return CheckInStartDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _date_decorators = [(0, class_validator_1.IsISO8601)()];
            _lesson_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(12)];
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _lesson_decorators, { kind: "field", name: "lesson", static: false, private: false, access: { has: function (obj) { return "lesson" in obj; }, get: function (obj) { return obj.lesson; }, set: function (obj, value) { obj.lesson = value; } }, metadata: _metadata }, _lesson_initializers, _lesson_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CheckInStartDto = CheckInStartDto;
var CheckInEndDto = function () {
    var _a;
    var _shiftId_decorators;
    var _shiftId_initializers = [];
    var _shiftId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CheckInEndDto() {
                this.shiftId = __runInitializers(this, _shiftId_initializers, void 0);
                __runInitializers(this, _shiftId_extraInitializers);
            }
            return CheckInEndDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _shiftId_decorators = [(0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _shiftId_decorators, { kind: "field", name: "shiftId", static: false, private: false, access: { has: function (obj) { return "shiftId" in obj; }, get: function (obj) { return obj.shiftId; }, set: function (obj, value) { obj.shiftId = value; } }, metadata: _metadata }, _shiftId_initializers, _shiftId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CheckInEndDto = CheckInEndDto;
var SwapCreateDto = function () {
    var _a;
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _lesson_decorators;
    var _lesson_initializers = [];
    var _lesson_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SwapCreateDto() {
                this.date = __runInitializers(this, _date_initializers, void 0); // YYYY-MM-DD
                this.lesson = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _lesson_initializers, void 0));
                __runInitializers(this, _lesson_extraInitializers);
            }
            return SwapCreateDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _date_decorators = [(0, class_validator_1.IsISO8601)()];
            _lesson_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(12)];
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _lesson_decorators, { kind: "field", name: "lesson", static: false, private: false, access: { has: function (obj) { return "lesson" in obj; }, get: function (obj) { return obj.lesson; }, set: function (obj, value) { obj.lesson = value; } }, metadata: _metadata }, _lesson_initializers, _lesson_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SwapCreateDto = SwapCreateDto;
