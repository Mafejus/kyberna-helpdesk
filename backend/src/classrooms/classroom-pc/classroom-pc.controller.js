"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomPcController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../../auth/guards/roles.guard");
var roles_decorator_1 = require("../../auth/decorators/roles.decorator");
var client_1 = require("@prisma/client");
var ClassroomPcController = function () {
    var _classDecorators = [(0, common_1.Controller)('classrooms/:classroomId'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getProperties_decorators;
    var _createProperty_decorators;
    var _deleteProperty_decorators;
    var _reorderProperties_decorators;
    var _findAll_decorators;
    var _create_decorators;
    var _generate_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _updateValues_decorators;
    var ClassroomPcController = _classThis = /** @class */ (function () {
        function ClassroomPcController_1(classroomPcService) {
            this.classroomPcService = (__runInitializers(this, _instanceExtraInitializers), classroomPcService);
        }
        // --- PROPERTIES (Admin/Teacher only) ---
        ClassroomPcController_1.prototype.getProperties = function (classroomId) {
            return this.classroomPcService.getProperties(classroomId);
        };
        ClassroomPcController_1.prototype.createProperty = function (classroomId, body) {
            return this.classroomPcService.createProperty(classroomId, body);
        };
        ClassroomPcController_1.prototype.deleteProperty = function (id) {
            return this.classroomPcService.deleteProperty(id);
        };
        ClassroomPcController_1.prototype.reorderProperties = function (body) {
            return this.classroomPcService.reorderProperties(body);
        };
        // --- PCs (Admin/Teacher/Student) ---
        ClassroomPcController_1.prototype.findAll = function (classroomId) {
            return this.classroomPcService.findAll(classroomId);
        };
        // Student CAN create PC now
        ClassroomPcController_1.prototype.create = function (classroomId, createDto) {
            return this.classroomPcService.create(classroomId, createDto);
        };
        ClassroomPcController_1.prototype.generate = function (classroomId) {
            return this.classroomPcService.generatePcs(classroomId);
        };
        // Student CAN update PC (label/note)
        ClassroomPcController_1.prototype.update = function (id, updateDto) {
            return this.classroomPcService.update(id, updateDto);
        };
        // Student CAN delete PC
        ClassroomPcController_1.prototype.remove = function (id) {
            return this.classroomPcService.remove(id);
        };
        // Student CAN update values
        ClassroomPcController_1.prototype.updateValues = function (id, body) {
            return this.classroomPcService.updateValues(id, body.values);
        };
        return ClassroomPcController_1;
    }());
    __setFunctionName(_classThis, "ClassroomPcController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getProperties_decorators = [(0, common_1.Get)('pc-properties')];
        _createProperty_decorators = [(0, common_1.Post)('pc-properties'), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT)];
        _deleteProperty_decorators = [(0, common_1.Delete)('pc-properties/:id'), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT)];
        _reorderProperties_decorators = [(0, common_1.Patch)('pc-properties/reorder'), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT)];
        _findAll_decorators = [(0, common_1.Get)('pcs')];
        _create_decorators = [(0, common_1.Post)('pcs'), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT)];
        _generate_decorators = [(0, common_1.Post)('pcs/generate'), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT)];
        _update_decorators = [(0, common_1.Patch)('pcs/:id'), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT)];
        _remove_decorators = [(0, common_1.Delete)('pcs/:id'), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT)];
        _updateValues_decorators = [(0, common_1.Patch)('pcs/:id/values'), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.TEACHER, client_1.Role.STUDENT)];
        __esDecorate(_classThis, null, _getProperties_decorators, { kind: "method", name: "getProperties", static: false, private: false, access: { has: function (obj) { return "getProperties" in obj; }, get: function (obj) { return obj.getProperties; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createProperty_decorators, { kind: "method", name: "createProperty", static: false, private: false, access: { has: function (obj) { return "createProperty" in obj; }, get: function (obj) { return obj.createProperty; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteProperty_decorators, { kind: "method", name: "deleteProperty", static: false, private: false, access: { has: function (obj) { return "deleteProperty" in obj; }, get: function (obj) { return obj.deleteProperty; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reorderProperties_decorators, { kind: "method", name: "reorderProperties", static: false, private: false, access: { has: function (obj) { return "reorderProperties" in obj; }, get: function (obj) { return obj.reorderProperties; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generate_decorators, { kind: "method", name: "generate", static: false, private: false, access: { has: function (obj) { return "generate" in obj; }, get: function (obj) { return obj.generate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateValues_decorators, { kind: "method", name: "updateValues", static: false, private: false, access: { has: function (obj) { return "updateValues" in obj; }, get: function (obj) { return obj.updateValues; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClassroomPcController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClassroomPcController = _classThis;
}();
exports.ClassroomPcController = ClassroomPcController;
