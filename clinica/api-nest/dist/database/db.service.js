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
var DbService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sql = __importStar(require("mssql"));
let DbService = DbService_1 = class DbService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(DbService_1.name);
    }
    async onApplicationBootstrap() {
        try {
            this.pool = await new sql.ConnectionPool({
                user: this.configService.get('MSSQL_USER'),
                password: this.configService.get('MSSQL_PASSWORD'),
                server: this.configService.get('MSSQL_HOST') || '',
                port: parseInt(this.configService.get('MSSQL_PORT') || '1433', 10),
                database: this.configService.get('MSSQL_DATABASE'),
                options: {
                    encrypt: this.configService.get('MSSQL_ENCRYPT') === 'true',
                    trustServerCertificate: this.configService.get('MSSQL_TRUST_CERT') === 'true',
                },
            }).connect();
            this.logger.log('✅ SQL Server pool conectado exitosamente a ' + this.configService.get('MSSQL_DATABASE'));
        }
        catch (err) {
            this.logger.error('❌ Error al conectar al pool de SQL Server:', err);
            throw err;
        }
    }
    async onApplicationShutdown() {
        if (this.pool) {
            await this.pool.close();
            this.logger.log('✅ SQL Server pool cerrado');
        }
    }
    async execute(procedure, params = {}) {
        try {
            const request = this.pool.request();
            for (const [key, value] of Object.entries(params)) {
                request.input(key, value);
            }
            const result = await request.execute(procedure);
            return result.recordset;
        }
        catch (err) {
            this.logger.error(`Error ejecutando SP ${procedure}:`, err);
            throw err;
        }
    }
    async executeOne(procedure, params = {}) {
        const rows = await this.execute(procedure, params);
        return rows.length > 0 ? rows[0] : null;
    }
    async executeNonQuery(procedure, params = {}) {
        try {
            const request = this.pool.request();
            for (const [key, value] of Object.entries(params)) {
                request.input(key, value);
            }
            await request.execute(procedure);
        }
        catch (err) {
            this.logger.error(`Error ejecutando SP (NonQuery) ${procedure}:`, err);
            throw err;
        }
    }
    async query(sqlString, params = {}) {
        try {
            const request = this.pool.request();
            for (const [key, value] of Object.entries(params)) {
                request.input(key, value);
            }
            const result = await request.query(sqlString);
            return result.recordset;
        }
        catch (err) {
            this.logger.error(`Error ejecutando Query:`, err);
            throw err;
        }
    }
};
exports.DbService = DbService;
exports.DbService = DbService = DbService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DbService);
//# sourceMappingURL=db.service.js.map