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
exports.CreateTicketDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var AttachmentMetadataDto = function () {
    var _a;
    var _originalName_decorators;
    var _originalName_initializers = [];
    var _originalName_extraInitializers = [];
    var _fileName_decorators;
    var _fileName_initializers = [];
    var _fileName_extraInitializers = [];
    var _mimeType_decorators;
    var _mimeType_initializers = [];
    var _mimeType_extraInitializers = [];
    var _size_decorators;
    var _size_initializers = [];
    var _size_extraInitializers = [];
    var _path_decorators;
    var _path_initializers = [];
    var _path_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AttachmentMetadataDto() {
                this.originalName = __runInitializers(this, _originalName_initializers, void 0);
                this.fileName = (__runInitializers(this, _originalName_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
                this.mimeType = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _mimeType_initializers, void 0));
                this.size = (__runInitializers(this, _mimeType_extraInitializers), __runInitializers(this, _size_initializers, void 0));
                this.path = (__runInitializers(this, _size_extraInitializers), __runInitializers(this, _path_initializers, void 0));
                __runInitializers(this, _path_extraInitializers);
            }
            return AttachmentMetadataDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _originalName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _fileName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _mimeType_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _size_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)()];
            _path_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _originalName_decorators, { kind: "field", name: "originalName", static: false, private: false, access: { has: function (obj) { return "originalName" in obj; }, get: function (obj) { return obj.originalName; }, set: function (obj, value) { obj.originalName = value; } }, metadata: _metadata }, _originalName_initializers, _originalName_extraInitializers);
            __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: function (obj) { return "fileName" in obj; }, get: function (obj) { return obj.fileName; }, set: function (obj, value) { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
            __esDecorate(null, null, _mimeType_decorators, { kind: "field", name: "mimeType", static: false, private: false, access: { has: function (obj) { return "mimeType" in obj; }, get: function (obj) { return obj.mimeType; }, set: function (obj, value) { obj.mimeType = value; } }, metadata: _metadata }, _mimeType_initializers, _mimeType_extraInitializers);
            __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: function (obj) { return "size" in obj; }, get: function (obj) { return obj.size; }, set: function (obj, value) { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
            __esDecorate(null, null, _path_decorators, { kind: "field", name: "path", static: false, private: false, access: { has: function (obj) { return "path" in obj; }, get: function (obj) { return obj.path; }, set: function (obj, value) { obj.path = value; } }, metadata: _metadata }, _path_initializers, _path_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var CreateTicketDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _classroomId_decorators;
    var _classroomId_initializers = [];
    var _classroomId_extraInitializers = [];
    var _attachments_decorators;
    var _attachments_initializers = [];
    var _attachments_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateTicketDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.classroomId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _classroomId_initializers, void 0));
                this.attachments = (__runInitializers(this, _classroomId_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                __runInitializers(this, _attachments_extraInitializers);
            }
            return CreateTicketDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _classroomId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _attachments_decorators = [(0, swagger_1.ApiProperty)({ type: [AttachmentMetadataDto], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return AttachmentMetadataDto; })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _classroomId_decorators, { kind: "field", name: "classroomId", static: false, private: false, access: { has: function (obj) { return "classroomId" in obj; }, get: function (obj) { return obj.classroomId; }, set: function (obj, value) { obj.classroomId = value; } }, metadata: _metadata }, _classroomId_initializers, _classroomId_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: function (obj) { return "attachments" in obj; }, get: function (obj) { return obj.attachments; }, set: function (obj, value) { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateTicketDto = CreateTicketDto;
