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
exports.PacienteController = void 0;
const common_1 = require("@nestjs/common");
const paciente_service_1 = require("./paciente.service");
const solicitud_cita_dto_1 = require("./dto/solicitud-cita.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let PacienteController = class PacienteController {
    constructor(pacienteService) {
        this.pacienteService = pacienteService;
    }
    getDashboard(req) {
        return this.pacienteService.getDashboardStats(req.user.idPaciente);
    }
    solicitarCita(req, solicitudDto) {
        return this.pacienteService.solicitarCita(req.user.idPaciente, solicitudDto);
    }
    getMisCitas(req) {
        return this.pacienteService.getMisCitas(req.user.idPaciente);
    }
    getMisChequeos(req) {
        return this.pacienteService.getMisChequeos(req.user.idPaciente);
    }
    getMisExamenes(req) {
        return this.pacienteService.getMisExamenes(req.user.idPaciente);
    }
    getMisVacunas(req) {
        return this.pacienteService.getMisVacunas(req.user.idPaciente);
    }
    crearChequeo(req, data) {
        return this.pacienteService.crearChequeo(req.user.idPaciente, data);
    }
};
exports.PacienteController = PacienteController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener KPIs del dashboard de paciente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PacienteController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('solicitar-cita'),
    (0, swagger_1.ApiOperation)({ summary: 'Solicitar una cita (Wizard)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, solicitud_cita_dto_1.SolicitudCitaDto]),
    __metadata("design:returntype", void 0)
], PacienteController.prototype, "solicitarCita", null);
__decorate([
    (0, common_1.Get)('mis-citas'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial de citas' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PacienteController.prototype, "getMisCitas", null);
__decorate([
    (0, common_1.Get)('mis-chequeos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial de chequeos' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PacienteController.prototype, "getMisChequeos", null);
__decorate([
    (0, common_1.Get)('mis-examenes'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial de exámenes' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PacienteController.prototype, "getMisExamenes", null);
__decorate([
    (0, common_1.Get)('mis-vacunas'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial de vacunas' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PacienteController.prototype, "getMisVacunas", null);
__decorate([
    (0, common_1.Post)('chequeo'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo chequeo de bienestar' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PacienteController.prototype, "crearChequeo", null);
exports.PacienteController = PacienteController = __decorate([
    (0, swagger_1.ApiTags)('paciente'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PACIENTE'),
    (0, common_1.Controller)('paciente'),
    __metadata("design:paramtypes", [paciente_service_1.PacienteService])
], PacienteController);
//# sourceMappingURL=paciente.controller.js.map