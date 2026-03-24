import { DbService } from '../database/db.service';
export declare class SeguimientoService {
    private db;
    constructor(db: DbService);
    create(createSeguimientoDto: any): Promise<any>;
    findAll(pais?: string): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, updateSeguimientoDto: any): Promise<any>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
