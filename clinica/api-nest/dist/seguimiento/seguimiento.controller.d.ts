import { SeguimientoService } from './seguimiento.service';
export declare class SeguimientoController {
    private readonly seguimientoService;
    constructor(seguimientoService: SeguimientoService);
    create(createSeguimientoDto: any): Promise<any>;
    findAll(req: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateSeguimientoDto: any): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
