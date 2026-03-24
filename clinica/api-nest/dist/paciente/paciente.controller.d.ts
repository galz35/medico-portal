import { PacienteService } from './paciente.service';
import { SolicitudCitaDto } from './dto/solicitud-cita.dto';
export declare class PacienteController {
    private readonly pacienteService;
    constructor(pacienteService: PacienteService);
    getDashboard(req: any): Promise<{
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
    solicitarCita(req: any, solicitudDto: SolicitudCitaDto): Promise<any>;
    getMisCitas(req: any): Promise<any[]>;
    getMisChequeos(req: any): Promise<any[]>;
    getMisExamenes(req: any): Promise<any[]>;
    getMisVacunas(req: any): Promise<any[]>;
    crearChequeo(req: any, data: any): Promise<any>;
}
