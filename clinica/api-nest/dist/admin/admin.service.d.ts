import { DbService } from '../database/db.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
export declare class AdminService {
    private db;
    constructor(db: DbService);
    getDashboardStats(pais: string): Promise<any>;
    crearUsuario(crearUsuarioDto: CrearUsuarioDto): Promise<{
        message: string;
        user: any;
    }>;
    getUsuarios(pais: string): Promise<any[]>;
    updateUsuario(id: number, data: any, adminPais: string): Promise<any>;
    getMedicos(pais: string): Promise<any[]>;
    crearMedico(data: any): Promise<any>;
    getEmpleados(pais: string, carnet?: string): Promise<any[]>;
    getReportesAtenciones(pais: string, filters?: any): Promise<any[]>;
    getRolesPermisos(): Promise<{
        roles: any[];
        relaciones: any[];
        catalogoPermisos: any[];
    }>;
}
