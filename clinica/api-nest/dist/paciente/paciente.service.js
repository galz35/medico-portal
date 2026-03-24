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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../database/db.service");
let PacienteService = class PacienteService {
    constructor(db) {
        this.db = db;
    }
    async getMisChequeos(idPaciente) {
        return this.db.execute('sp_Paciente_GetMisChequeos', { IdPaciente: idPaciente });
    }
    async getMisExamenes(idPaciente) {
        return this.db.execute('sp_Paciente_GetMisExamenes', { IdPaciente: idPaciente });
    }
    async getMisVacunas(idPaciente) {
        return this.db.execute('sp_Paciente_GetMisVacunas', { IdPaciente: idPaciente });
    }
    async getDashboardStats(idPaciente) {
        const rows = await this.db.execute('sp_Paciente_GetDashboard', { IdPaciente: idPaciente });
        const data = rows[0] || {};
        const timeline = await this.db.execute('sp_Paciente_GetTimeline', { IdPaciente: idPaciente });
        return {
            kpis: {
                estadoActual: data.nivel_semaforo || 'V',
                ultimoChequeo: data.ultimo_chequeo_fecha || null,
                proximaCita: data.proxima_cita_fecha ? `${data.proxima_cita_fecha} ${data.proxima_cita_hora || ''}`.trim() : null,
                seguimientosActivos: data.seguimientos_activos || 0
            },
            ultimoChequeoData: data.ultimo_chequeo_id ? {
                id_chequeo: data.ultimo_chequeo_id,
                fecha_registro: data.ultimo_chequeo_fecha,
                nivel_semaforo: data.ultimo_chequeo_semaforo,
                datos_completos: data.ultimo_chequeo_datos,
            } : null,
            timeline
        };
    }
    async solicitarCita(idPaciente, solicitudDto) {
        try {
            const result = await this.db.executeOne('sp_Paciente_SolicitarCita', {
                IdPaciente: idPaciente,
                Ruta: solicitudDto.ruta || 'consulta',
                ComentarioGeneral: solicitudDto.comentarioGeneral || 'Solicitud de consulta',
                DatosCompletos: typeof solicitudDto.datosCompletos === 'string'
                    ? solicitudDto.datosCompletos
                    : JSON.stringify(solicitudDto.datosCompletos),
            });
            return result || { message: 'Solicitud procesada con éxito' };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Error al procesar solicitud: ' + err.message);
        }
    }
    async getMisCitas(idPaciente) {
        return this.db.execute('sp_Paciente_GetMisCitas', { IdPaciente: idPaciente });
    }
    async crearChequeo(idPaciente, data) {
        try {
            const result = await this.db.executeOne('sp_Paciente_CrearChequeo', {
                IdPaciente: idPaciente,
                NivelRiesgo: data.nivelRiesgo || data.nivelSemaforo || 'V',
                DatosCompletos: typeof data === 'string' ? data : JSON.stringify(data),
            });
            return result;
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Error al crear chequeo: ' + err.message);
        }
    }
};
exports.PacienteService = PacienteService;
exports.PacienteService = PacienteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], PacienteService);
//# sourceMappingURL=paciente.service.js.map