"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const db_service_1 = require("../database/db.service");
const USUARIO_UPDATE_WHITELIST = ['estado', 'correo', 'nombre_completo'];
let AdminService = class AdminService {
    constructor(db) {
        this.db = db;
    }
    async getDashboardStats(pais) {
        return this.db.executeOne('sp_Admin_GetDashboard', { Pais: pais });
    }
    async crearUsuario(crearUsuarioDto) {
        try {
            const { password, ...userData } = crearUsuarioDto;
            const passToHash = password || 'Temporal123!';
            const salt = await bcrypt.genSalt();
            const password_hash = await bcrypt.hash(passToHash, salt);
            const roles = await this.db.query('SELECT id_rol FROM roles WHERE nombre = @Nombre', { Nombre: userData.rol });
            if (roles.length === 0)
                throw new common_1.BadRequestException('El rol proporcionado no existe en la BD.');
            const idRol = roles[0].id_rol;
            const user = await this.db.executeOne('sp_Admin_CrearUsuario', {
                Carnet: userData.carnet,
                PasswordHash: password_hash,
                NombreCompleto: userData.nombreCompleto || 'Usuario Creado',
                Correo: userData.correo || null,
                IdRol: idRol,
                Pais: userData.pais
            });
            return { message: 'Usuario creado exitosamente', user: user };
        }
        catch (err) {
            console.error('Error al crear usuario:', err);
            if (err.message && err.message.includes('Violation of UNIQUE KEY constraint')) {
                throw new common_1.ConflictException('El carnet o correo ya existe en el sistema.');
            }
            if (err instanceof common_1.BadRequestException || err instanceof common_1.ConflictException)
                throw err;
            throw new common_1.InternalServerErrorException('Error al crear usuario: ' + err.message);
        }
    }
    async getUsuarios(pais) {
        return this.db.execute('sp_Admin_GetUsuarios', { Pais: pais });
    }
    async updateUsuario(id, data, adminPais) {
        const user = await this.db.executeOne('sp_Auth_GetProfile', { IdUsuario: id });
        if (!user || user.pais !== adminPais) {
            throw new common_1.ForbiddenException('No tiene permisos para modificar un usuario de otro país.');
        }
        return this.db.executeOne('sp_Admin_UpdateUsuario', {
            Id: id,
            Estado: data.estado || null,
            Rol: data.rol || null,
            Correo: data.correo || null,
            NombreCompleto: data.nombre_completo || null,
        });
    }
    async getMedicos(pais) {
        return this.db.execute('sp_Admin_GetMedicos', { Pais: pais });
    }
    async crearMedico(data) {
        return this.db.executeOne('sp_Admin_CrearMedico', {
            Carnet: data.carnet || null,
            Nombre: data.nombreCompleto,
            Especialidad: data.especialidad || null,
            Tipo: data.tipoMedico || 'EXTERNO',
            Correo: data.correo || null,
            Telefono: data.telefono || null,
            Estado: data.estadoMedico || 'A',
            Pais: data.pais || 'NI'
        });
    }
    async getEmpleados(pais, carnet) {
        return this.db.execute('sp_Admin_GetEmpleados', { Pais: pais, Carnet: carnet || null });
    }
    async getReportesAtenciones(pais, filters) {
        const rows = await this.db.execute('sp_Admin_GetReportesAtenciones', {
            Pais: pais,
            FechaDesde: filters?.fechaDesde || null,
            FechaHasta: filters?.fechaHasta || null,
        });
        return rows.map(row => ({
            ...row,
            paciente: {
                nombre_completo: row.paciente_nombre,
                carnet: row.paciente_carnet,
                sexo: row.paciente_sexo,
                fecha_nacimiento: row.paciente_nacimiento
            },
            medico: {
                nombre_completo: row.medico_nombre,
                especialidad: row.medico_especialidad
            },
            empleado: {
                gerencia: row.gerencia,
                area: row.area
            }
        }));
    }
    async getRolesPermisos() {
        const roles = await this.db.query('SELECT * FROM roles');
        const mapeos = await this.db.query('SELECT rp.id_rol, p.id_permiso, p.clave, p.modulo FROM roles_permisos rp JOIN permisos p ON rp.id_permiso = p.id_permiso');
        const permisosCat = await this.db.query('SELECT * FROM permisos');
        return { roles, relaciones: mapeos, catalogoPermisos: permisosCat };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], AdminService);
//# sourceMappingURL=admin.service.js.map