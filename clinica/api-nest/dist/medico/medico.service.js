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
exports.MedicoService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../database/db.service");
let MedicoService = class MedicoService {
    constructor(db) {
        this.db = db;
    }
    async getPacientes(pais) {
        return this.db.execute('sp_Medico_GetPacientes', { Pais: pais });
    }
    async getChequeosPorPaciente(idPaciente) {
        return this.db.execute('sp_Medico_GetChequeosPorPaciente', { IdPaciente: idPaciente });
    }
    async getCitasPorPaciente(idPaciente) {
        return this.db.execute('sp_Medico_GetCitasPorPaciente', { IdPaciente: idPaciente });
    }
    async getExamenesPorPaciente(idPaciente) {
        return this.db.execute('sp_Medico_GetExamenesPorPaciente', { IdPaciente: idPaciente });
    }
    async getVacunasPorPaciente(idPaciente) {
        return this.db.execute('sp_Medico_GetVacunasPorPaciente', { IdPaciente: idPaciente });
    }
    async getDashboardStats(idMedico, pais) {
        const citasHoy = await this.db.execute('sp_Medico_GetCitasHoy', { IdMedico: idMedico });
        const pacientesEnRojo = await this.db.execute('sp_Medico_GetPacientesRojo', { Pais: pais });
        const casosAbiertosResult = await this.db.execute('sp_Medico_CountCasosAbiertos', { Pais: pais });
        return {
            citasHoyCount: citasHoy.length,
            citasHoy,
            pacientesEnRojoCount: pacientesEnRojo.length,
            pacientesEnRojo,
            casosAbiertos: casosAbiertosResult[0]?.total || 0
        };
    }
    async getAgendaCitas(pais) {
        return this.db.execute('sp_Medico_GetAgendaCitas', { Pais: pais });
    }
    async getCasosClinicos(pais, estado) {
        return this.db.execute('sp_Medico_GetCasosClinicos', {
            Pais: pais,
            Estado: estado || null
        });
    }
    async getCasoById(id) {
        const rows = await this.db.execute('sp_Medico_GetCasoById', { Id: id });
        if (rows.length === 0)
            throw new common_1.NotFoundException('Caso clínico no encontrado');
        return rows[0];
    }
    async updateCaso(id, data) {
        const result = await this.db.executeOne('sp_Medico_UpdateCaso', {
            Id: id,
            EstadoCaso: data.estado_caso || null,
            Semaforo: data.nivel_semaforo || null,
            Motivo: data.motivo_consulta || null,
        });
        if (!result)
            throw new common_1.NotFoundException('Caso clínico no encontrado');
        return result;
    }
    async getCitaById(id) {
        const rows = await this.db.execute('sp_Medico_GetCitaById', { Id: id });
        if (rows.length === 0)
            throw new common_1.NotFoundException('Cita no encontrada');
        return rows[0];
    }
    async agendarCita(agendarCitaDto) {
        try {
            const result = await this.db.executeOne('sp_Medico_AgendarCita', {
                IdCaso: agendarCitaDto.idCaso,
                IdMedico: agendarCitaDto.idMedico,
                FechaCita: agendarCitaDto.fechaCita,
                HoraCita: agendarCitaDto.horaCita,
            });
            return result;
        }
        catch (err) {
            if (err.message?.includes('no encontrado'))
                throw new common_1.NotFoundException(err.message);
            throw new common_1.InternalServerErrorException('Error al agendar cita: ' + err.message);
        }
    }
    async crearAtencion(crearAtencionDto) {
        try {
            const result = await this.db.executeOne('sp_Medico_CrearAtencion', {
                IdCita: crearAtencionDto.idCita,
                IdMedico: crearAtencionDto.idMedico,
                Diagnostico: crearAtencionDto.diagnosticoPrincipal,
                Plan: crearAtencionDto.planTratamiento || null,
                Recomendaciones: crearAtencionDto.recomendaciones || null,
                RequiereSeg: crearAtencionDto.requiereSeguimiento ?? false,
                FechaSig: crearAtencionDto.fechaSiguienteCita || null,
                Peso: crearAtencionDto.pesoKg || null,
                Altura: crearAtencionDto.alturaM || null,
                Presion: crearAtencionDto.presionArterial || null,
                FC: crearAtencionDto.frecuenciaCardiaca || null,
                Temp: crearAtencionDto.temperaturaC || null
            });
            return result;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException)
                throw err;
            throw new common_1.InternalServerErrorException('Error al crear atención: ' + err.message);
        }
    }
    async getExamenes(pais) {
        return this.db.execute('sp_Medico_GetExamenes', { Pais: pais });
    }
    async updateExamen(id, data) {
        const result = await this.db.executeOne('sp_Medico_UpdateExamen', {
            Id: id,
            ResultadoResumen: data.resultadoResumen || null,
            EstadoExamen: data.estadoExamen || 'ENTREGADO',
            FechaResultado: data.fechaResultado || new Date().toISOString(),
        });
        if (!result)
            throw new common_1.NotFoundException('Examen no encontrado');
        return result;
    }
    async getSeguimientos(pais) {
        return this.db.execute('sp_Medico_GetSeguimientos', { Pais: pais });
    }
    async updateSeguimiento(id, data) {
        const result = await this.db.executeOne('sp_Medico_UpdateSeguimiento', {
            Id: id,
            Estado: data.estado_seguimiento || null,
            Notas: data.notas_seguimiento || null,
            FechaReal: data.fecha_real || null,
            Semaforo: data.nivel_semaforo || null,
        });
        if (!result)
            throw new common_1.NotFoundException('Seguimiento no encontrado');
        return result;
    }
    async getCitasPorMedico(idMedico, pais) {
        return this.db.execute('sp_Medico_GetCitasPorMedico', { IdMedico: idMedico, Pais: pais });
    }
    async registrarVacuna(data) {
        return this.db.executeOne('sp_Medico_RegistrarVacuna', {
            IdPaciente: +data.idPaciente,
            IdMedico: +data.idMedico,
            Tipo: data.tipoVacuna,
            Dosis: data.dosis,
            Fecha: data.fechaAplicacion,
            Obs: data.observaciones || null
        });
    }
    async crearCasoClinico(data) {
        return this.db.executeOne('sp_Medico_CrearCaso', {
            IdPaciente: data.idPaciente,
            Semaforo: data.nivelSemaforo || 'V',
            Motivo: data.motivoConsulta,
            ResumenClinico: data.resumenClinicoUsuario || null,
            DiagnosticoUsuario: data.diagnosticoUsuario || null,
        });
    }
    async getReporteAtencion(idAtencion) {
        const rows = await this.db.execute('sp_Medico_GetReporteAtencion', { Id: idAtencion });
        if (rows.length === 0)
            throw new common_1.NotFoundException('Atención no encontrada');
        return { ...rows[0], fechaGeneracion: new Date().toISOString() };
    }
    async getReportePaciente(idPaciente) {
        const rows = await this.db.execute('sp_Medico_GetReportePaciente', { Id: idPaciente });
        if (rows.length === 0)
            throw new common_1.NotFoundException('Paciente no encontrado');
        return { ...rows[0], fechaGeneracion: new Date().toISOString() };
    }
    async getRegistrosPsicosociales(pais) {
        return this.db.execute('sp_Medico_GetRegistrosPsicosociales', { Pais: pais });
    }
    async crearRegistroPsicosocial(data) {
        return this.db.executeOne('sp_Medico_CrearRegistroPsicosocial', {
            IdPaciente: data.idPaciente,
            IdMedico: data.idMedico,
            IdAtencion: data.idAtencion || null,
            Confidencial: data.confidencial ? 1 : 0,
            NivelEstres: data.nivelEstres || null,
            SintomasPsico: data.sintomasPsico ? JSON.stringify(data.sintomasPsico) : null,
            EstadoAnimoGral: data.estadoAnimoGeneral || null,
            AnalisisSentiment: data.analisisSentimiento || null,
            RiesgoSuicida: data.riesgoSuicida ? 1 : 0,
            DerivarAPsico: data.derivarAPsico ? 1 : 0,
            NotasPsico: data.notasPsico || null,
        });
    }
};
exports.MedicoService = MedicoService;
exports.MedicoService = MedicoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], MedicoService);
//# sourceMappingURL=medico.service.js.map