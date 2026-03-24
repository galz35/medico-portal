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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const db_service_1 = require("../database/db.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(db, jwtService) {
        this.db = db;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async validateUser(carnet, pass) {
        const user = await this.db.executeOne('sp_Login', { Carnet: carnet });
        if (user && user.estado === 'A' && (await bcrypt.compare(pass, user.password_hash))) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.carnet, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        await this.db.executeNonQuery('sp_UpdateUltimoAcceso', { IdUsuario: user.id_usuario });
        const payload = {
            sub: user.id_usuario,
            carnet: user.carnet,
            rol: user.rol,
            pais: user.pais,
            idPaciente: user.id_paciente,
            idMedico: user.id_medico
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }
    async createInitialAdmin() {
        return { message: 'Por favor, utiliza el Stored Procedure sp_SeedData directamente en SQL Server para evitar duplicados.' };
    }
    async getProfile(userId) {
        const users = await this.db.execute('sp_Auth_GetProfile', { IdUsuario: userId });
        if (users.length === 0) {
            throw new common_1.UnauthorizedException('Usuario no encontrado o inactivo');
        }
        const { password_hash, ...result } = users[0];
        return result;
    }
    async resetPassword(carnet, newPass) {
        const user = await this.db.executeOne('sp_Login', { Carnet: carnet });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(newPass, salt);
        await this.db.executeNonQuery('sp_Auth_HashPassword', {
            IdUsuario: user.id_usuario,
            NewHash: hash
        });
        return { message: 'Contraseña actualizada con éxito' };
    }
    async validatePortalSession(sid) {
        if (!sid)
            return null;
        try {
            const portalUrl = process.env.PORTAL_API_URL || 'http://localhost:3110';
            const response = await axios_1.default.post(`${portalUrl}/api/auth/introspect`, {}, {
                headers: {
                    Cookie: `portal_sid=${sid}`
                }
            });
            if (response.data?.authenticated && response.data?.identity) {
                const portalUser = response.data.identity;
                const carnetStr = String(portalUser.carnet || '').trim();
                const rows = await this.db.query(`SELECT u.*, r.nombre as rol 
                     FROM Usuarios u 
                     JOIN Roles r ON u.id_rol = r.id_rol 
                     WHERE u.carnet = @Carnet`, { Carnet: carnetStr });
                let user = rows.length > 0 ? rows[0] : null;
                if (!user) {
                    try {
                        this.logger.log(`[PortalSSO] Provisionando JIT: ${carnetStr}`);
                        await this.db.query(`INSERT INTO Usuarios (carnet, password_hash, nombre_completo, correo, id_rol, pais, estado, fecha_creacion) 
                             VALUES (@Carnet, 'PORTAL_SSO', @Nombre, @Correo, 3, @Pais, 'A', GETDATE())`, {
                            Carnet: carnetStr,
                            Nombre: portalUser.nombre || portalUser.usuario,
                            Correo: portalUser.correo || '',
                            Pais: portalUser.esInterno ? 'NI' : 'OT'
                        });
                        const retryRows = await this.db.query(`SELECT u.*, r.nombre as rol 
                             FROM Usuarios u 
                             JOIN Roles r ON u.id_rol = r.id_rol 
                             WHERE u.carnet = @Carnet`, { Carnet: carnetStr });
                        return retryRows.length > 0 ? retryRows[0] : null;
                    }
                    catch (dbErr) {
                        this.logger.error('[PortalSSO] Error JIT:', dbErr.message);
                        return null;
                    }
                }
                return user;
            }
        }
        catch (err) {
            this.logger.warn('[PortalSSO] Error introspect:', err.message);
        }
        return null;
    }
    async createTokenForUser(user) {
        if (!user)
            return null;
        const payload = {
            sub: user.id_usuario,
            carnet: user.carnet,
            rol: user.rol,
            pais: user.pais,
            idPaciente: user.id_paciente,
            idMedico: user.id_medico
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: user
        };
    }
    async validateSSOToken(token) {
        try {
            const secret = 'ClaroSSO_Shared_Secret_2026_!#';
            this.logger.log(`[SSO] Validando ticket con secreto maestro...`);
            let payload;
            try {
                payload = await this.jwtService.verifyAsync(token, {
                    secret,
                    clockTolerance: 15
                });
            }
            catch (err) {
                this.logger.error(`[SSO] Fallo en firma/tiempo del ticket: ${err.message}`);
                return null;
            }
            if (!payload || !payload.carnet) {
                this.logger.warn('[SSO] Ticket válido pero sin carnet en el payload');
                return null;
            }
            const carnetStr = String(payload.carnet).trim();
            console.log(`[SSO-DEBUG] Ticket válido detectado para carnet: ${carnetStr}`);
            this.logger.log(`[SSO] Ticket válido. Payload: ${JSON.stringify(payload)}`);
            this.logger.log(`[SSO] Procesando carnet: ${carnetStr}`);
            const queryUser = `SELECT u.*, r.nombre as rol 
                 FROM Usuarios u 
                 JOIN Roles r ON u.id_rol = r.id_rol 
                 WHERE u.carnet = @Carnet`;
            console.log(`[SSO-DEBUG] Consultando BD para carnet: ${carnetStr}`);
            const rows = await this.db.query(queryUser, { Carnet: carnetStr });
            let user = rows.length > 0 ? rows[0] : null;
            if (!user) {
                console.log(`[SSO-DEBUG] Usuario NO encontrado en BD Clinica. Iniciando auto-registro (JIT)...`);
                this.logger.log(`[SSO] Usuario no encontrado, iniciando JIT para carnet: ${carnetStr}`);
                try {
                    await this.db.query(`INSERT INTO Usuarios (carnet, password_hash, nombre_completo, correo, id_rol, pais, estado, fecha_creacion) 
                         VALUES (@Carnet, 'PORTAL_SSO', @Nombre, @Correo, 3, @Pais, 'A', GETDATE())`, {
                        Carnet: carnetStr,
                        Nombre: payload.name || payload.username || 'Usuario Portal',
                        Correo: payload.correo || `${carnetStr}@claro.com.ni`,
                        Pais: 'NI'
                    });
                    console.log(`[SSO-DEBUG] Registro JIT exitoso para: ${carnetStr}. Re-consultando...`);
                    const retryRows = await this.db.query(queryUser, { Carnet: carnetStr });
                    user = retryRows.length > 0 ? retryRows[0] : null;
                }
                catch (dbErr) {
                    console.error(`[SSO-DEBUG] ERROR CRITICO en INSERT JIT:`, dbErr);
                    this.logger.error(`[SSO] Error crítico JIT DB para ${carnetStr}: ${dbErr.message}`);
                    return null;
                }
            }
            console.log(`[SSO-DEBUG] Usuario listo para Login: ${user?.carnet} (ID: ${user?.id_usuario})`);
            return user;
        }
        catch (e) {
            console.error(`[SSO-DEBUG] FALLO TOTAL EN VALIDACION SSO:`, e);
            this.logger.error(`[SSO] Error CRÍTICO validación ticket: ${e.message}`, e.stack);
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map