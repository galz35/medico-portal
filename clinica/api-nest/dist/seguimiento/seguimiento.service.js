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
exports.SeguimientoService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../database/db.service");
let SeguimientoService = class SeguimientoService {
    constructor(db) {
        this.db = db;
    }
    async create(createSeguimientoDto) {
        return this.db.executeOne('sp_Seguimiento_Crear', {
            IdCaso: createSeguimientoDto.idCaso || null,
            IdAtencion: createSeguimientoDto.idAtencion || null,
            IdPaciente: createSeguimientoDto.idPaciente,
            IdUsuarioResp: createSeguimientoDto.idUsuarioResp || null,
            FechaProg: createSeguimientoDto.fechaProgramada,
            Tipo: createSeguimientoDto.tipoSeguimiento || 'PRESENCIAL',
            Estado: createSeguimientoDto.estadoSeguimiento || 'PENDIENTE',
            Semaforo: createSeguimientoDto.nivelSemaforo || 'V',
            Notas: createSeguimientoDto.notasSeguimiento || null,
            Motivo: createSeguimientoDto.motivo || null,
        });
    }
    async findAll(pais) {
        return this.db.execute('sp_Seguimiento_GetAll', { Pais: pais || null });
    }
    async findOne(id) {
        const rows = await this.db.execute('sp_Seguimiento_GetById', { Id: id });
        if (rows.length === 0)
            throw new common_1.NotFoundException('Seguimiento no encontrado');
        return rows[0];
    }
    async update(id, updateSeguimientoDto) {
        const result = await this.db.executeOne('sp_Seguimiento_Update', {
            Id: id,
            Estado: updateSeguimientoDto.estadoSeguimiento || null,
            Notas: updateSeguimientoDto.notasSeguimiento || null,
            FechaReal: updateSeguimientoDto.fechaReal || null,
            Semaforo: updateSeguimientoDto.nivelSemaforo || null,
        });
        if (!result)
            throw new common_1.NotFoundException('Seguimiento no encontrado');
        return result;
    }
    async remove(id) {
        await this.db.executeNonQuery('sp_Seguimiento_Delete', { Id: id });
        return { message: 'Seguimiento eliminado' };
    }
};
exports.SeguimientoService = SeguimientoService;
exports.SeguimientoService = SeguimientoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], SeguimientoService);
//# sourceMappingURL=seguimiento.service.js.map