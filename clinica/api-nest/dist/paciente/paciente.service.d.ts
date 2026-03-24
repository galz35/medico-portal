import { DbService } from '../database/db.service';
import { SolicitudCitaDto } from './dto/solicitud-cita.dto';
export declare class PacienteService {
    private db;
    constructor(db: DbService);
    getMisChequeos(idPaciente: number): Promise<any[]>;
    getMisExamenes(idPaciente: number): Promise<any[]>;
    getMisVacunas(idPaciente: number): Promise<any[]>;
    getDashboardStats(idPaciente: number): Promise<{
        kpis: {
            estadoActual: any;
            ultimoChequeo: any;
            proximaCita: string | null;
            seguimientosActivos: any;
        };
        ultimoChequeoData: {
            id_chequeo: any;
            fecha_registro: any;
            nivel_semaforo: any;
            datos_completos: any;
        } | null;
        timeline: any[];
    }>;
    solicitarCita(idPaciente: number, solicitudDto: SolicitudCitaDto): Promise<any>;
    getMisCitas(idPaciente: number): Promise<any[]>;
    crearChequeo(idPaciente: number, data: any): Promise<any>;
}
