"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const crear_usuario_dto_1 = require("./dto/crear-usuario.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboard(req) {
        return this.adminService.getDashboardStats(req.user.pais);
    }
    crearUsuario(req, crearUsuarioDto) {
        crearUsuarioDto.pais = req.user.pais;
        return this.adminService.crearUsuario(crearUsuarioDto);
    }
    getUsuarios(req) {
        return this.adminService.getUsuarios(req.user.pais);
    }
    updateUsuario(req, id, data) {
        return this.adminService.updateUsuario(+id, data, req.user.pais);
    }
    getMedicos(req) {
        return this.adminService.getMedicos(req.user.pais);
    }
    crearMedico(req, data) {
        data.pais = req.user.pais;
        return this.adminService.crearMedico(data);
    }
    getEmpleados(req, carnet) {
        return this.adminService.getEmpleados(req.user.pais, carnet);
    }
    getRolesPermisos() {
        return this.adminService.getRolesPermisos();
    }
    getReportesAtenciones(req, filters) {
        return this.adminService.getReportesAtenciones(req.user.pais, filters);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener KPIs del dashboard de admin' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('usuarios'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo usuario' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, crear_usuario_dto_1.CrearUsuarioDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "crearUsuario", null);
__decorate([
    (0, common_1.Get)('usuarios'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar usuarios del país' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUsuarios", null);
__decorate([
    (0, common_1.Patch)('usuarios/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar usuario' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUsuario", null);
__decorate([
    (0, common_1.Get)('medicos'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar médicos del país' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMedicos", null);
__decorate([
    (0, common_1.Post)('medicos'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo médico' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "crearMedico", null);
__decorate([
    (0, common_1.Get)('empleados'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar empleados' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('carnet')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getEmpleados", null);
__decorate([
    (0, common_1.Get)('roles-permisos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener catálogo de roles y permisos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRolesPermisos", null);
__decorate([
    (0, common_1.Get)('reportes/atenciones'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener reporte de atenciones' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getReportesAtenciones", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map