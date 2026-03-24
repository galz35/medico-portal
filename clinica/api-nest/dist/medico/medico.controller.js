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
exports.MedicoController = void 0;
const common_1 = require("@nestjs/common");
const medico_service_1 = require("./medico.service");
const agendar_cita_dto_1 = require("./dto/agendar-cita.dto");
const crear_atencion_dto_1 = require("./dto/crear-atencion.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let MedicoController = class MedicoController {
    constructor(medicoService) {
        this.medicoService = medicoService;
    }
    getDashboard(req) {
        return this.medicoService.getDashboardStats(req.user.idMedico, req.user.pais);
    }
    getAgendaCitas(req) {
        return this.medicoService.getAgendaCitas(req.user.pais);
    }
    agendarCita(agendarCitaDto) {
        return this.medicoService.agendarCita(agendarCitaDto);
    }
    crearAtencion(crearAtencionDto) {
        return this.medicoService.crearAtencion(crearAtencionDto);
    }
    getPacientes(req) {
        return this.medicoService.getPacientes(req.user.pais);
    }
    getChequeosPorPaciente(id) {
        return this.medicoService.getChequeosPorPaciente(+id);
    }
    getCitasPorPaciente(id) {
        return this.medicoService.getCitasPorPaciente(+id);
    }
    getExamenesPorPaciente(id) {
        return this.medicoService.getExamenesPorPaciente(+id);
    }
    getVacunasPorPaciente(id) {
        return this.medicoService.getVacunasPorPaciente(+id);
    }
    getCasosClinicos(req, estado) {
        return this.medicoService.getCasosClinicos(req.user.pais, estado);
    }
    getCasoById(id) {
        return this.medicoService.getCasoById(+id);
    }
    updateCaso(id, data) {
        return this.medicoService.updateCaso(+id, data);
    }
    getCitaById(id) {
        return this.medicoService.getCitaById(+id);
    }
    getExamenes(req) {
        return this.medicoService.getExamenes(req.user.pais);
    }
    getSeguimientos(req) {
        return this.medicoService.getSeguimientos(req.user.pais);
    }
    updateSeguimiento(id, data) {
        return this.medicoService.updateSeguimiento(+id, data);
    }
    getCitasPorMedico(req) {
        return this.medicoService.getCitasPorMedico(req.user.idMedico, req.user.pais);
    }
    registrarVacuna(data) {
        return this.medicoService.registrarVacuna(data);
    }
    updateExamen(id, data) {
        return this.medicoService.updateExamen(+id, data);
    }
    crearCasoClinico(data) {
        return this.medicoService.crearCasoClinico(data);
    }
    getReporteAtencion(idAtencion) {
        return this.medicoService.getReporteAtencion(+idAtencion);
    }
    getReportePaciente(idPaciente) {
        return this.medicoService.getReportePaciente(+idPaciente);
    }
    getRegistrosPsicosociales(req) {
        return this.medicoService.getRegistrosPsicosociales(req.user.pais);
    }
    crearRegistroPsicosocial(data) {
        return this.medicoService.crearRegistroPsicosocial(data);
    }
};
exports.MedicoController = MedicoController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener KPIs del dashboard de médico' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('agenda-citas'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener casos abiertos para agendar' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getAgendaCitas", null);
__decorate([
    (0, common_1.Post)('agenda-citas/agendar'),
    (0, swagger_1.ApiOperation)({ summary: 'Agendar una cita para un caso clínico' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agendar_cita_dto_1.AgendarCitaDto]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "agendarCita", null);
__decorate([
    (0, common_1.Post)('atencion'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar atención médica' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_atencion_dto_1.CrearAtencionDto]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "crearAtencion", null);
__decorate([
    (0, common_1.Get)('pacientes'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de pacientes del país' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getPacientes", null);
__decorate([
    (0, common_1.Get)('pacientes/:id/chequeos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener chequeos de un paciente' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getChequeosPorPaciente", null);
__decorate([
    (0, common_1.Get)('pacientes/:id/citas'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener citas de un paciente' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getCitasPorPaciente", null);
__decorate([
    (0, common_1.Get)('pacientes/:id/examenes'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener exámenes de un paciente' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getExamenesPorPaciente", null);
__decorate([
    (0, common_1.Get)('pacientes/:id/vacunas'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener vacunas de un paciente' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getVacunasPorPaciente", null);
__decorate([
    (0, common_1.Get)('casos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener casos clínicos' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getCasosClinicos", null);
__decorate([
    (0, common_1.Get)('casos/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener caso clínico por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getCasoById", null);
__decorate([
    (0, common_1.Patch)('casos/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar caso clínico' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "updateCaso", null);
__decorate([
    (0, common_1.Get)('citas/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener cita por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getCitaById", null);
__decorate([
    (0, common_1.Get)('examenes'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los exámenes' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getExamenes", null);
__decorate([
    (0, common_1.Get)('seguimientos'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los seguimientos' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getSeguimientos", null);
__decorate([
    (0, common_1.Patch)('seguimientos/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar seguimiento' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "updateSeguimiento", null);
__decorate([
    (0, common_1.Get)('citas'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener citas del médico (calendario)' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getCitasPorMedico", null);
__decorate([
    (0, common_1.Post)('vacunas'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar vacuna' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "registrarVacuna", null);
__decorate([
    (0, common_1.Patch)('examenes/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar resultado de examen médico' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "updateExamen", null);
__decorate([
    (0, common_1.Post)('casos'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un caso clínico nuevo' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "crearCasoClinico", null);
__decorate([
    (0, common_1.Get)('reporte-atencion/:idAtencion'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener datos completos para reporte imprimible de atención médica' }),
    __param(0, (0, common_1.Param)('idAtencion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getReporteAtencion", null);
__decorate([
    (0, common_1.Get)('reporte-paciente/:idPaciente'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial completo del paciente para reporte' }),
    __param(0, (0, common_1.Param)('idPaciente')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getReportePaciente", null);
__decorate([
    (0, common_1.Get)('psicosocial'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros psicosociales del país' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getRegistrosPsicosociales", null);
__decorate([
    (0, common_1.Post)('psicosocial'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo registro psicosocial' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "crearRegistroPsicosocial", null);
exports.MedicoController = MedicoController = __decorate([
    (0, swagger_1.ApiTags)('medico'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('MEDICO'),
    (0, common_1.Controller)('medico'),
    __metadata("design:paramtypes", [medico_service_1.MedicoService])
], MedicoController);
//# sourceMappingURL=medico.controller.js.map