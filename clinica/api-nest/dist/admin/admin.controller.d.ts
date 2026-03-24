import { AdminService } from './admin.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(req: any): Promise<any>;
    crearUsuario(req: any, crearUsuarioDto: CrearUsuarioDto): Promise<{
        message: string;
        user: any;
    }>;
    getUsuarios(req: any): Promise<any[]>;
    updateUsuario(req: any, id: string, data: any): Promise<any>;
    getMedicos(req: any): Promise<any[]>;
    crearMedico(req: any, data: any): Promise<any>;
    getEmpleados(req: any, carnet?: string): Promise<any[]>;
    getRolesPermisos(): Promise<{
        roles: any[];
        relaciones: any[];
        catalogoPermisos: any[];
    }>;
    getReportesAtenciones(req: any, filters: any): Promise<any[]>;
}
