import { MedicoService } from './medico.service';
import { AgendarCitaDto } from './dto/agendar-cita.dto';
import { CrearAtencionDto } from './dto/crear-atencion.dto';
export declare class MedicoController {
    private readonly medicoService;
    constructor(medicoService: MedicoService);
    getDashboard(req: any): Promise<{
        citasHoyCount: number;
        citasHoy: any[];
        pacientesEnRojoCount: number;
        pacientesEnRojo: any[];
        casosAbiertos: any;
    }>;
    getAgendaCitas(req: any): Promise<any[]>;
    agendarCita(agendarCitaDto: AgendarCitaDto): Promise<any>;
    crearAtencion(crearAtencionDto: CrearAtencionDto): Promise<any>;
    getPacientes(req: any): Promise<any[]>;
    getChequeosPorPaciente(id: string): Promise<any[]>;
    getCitasPorPaciente(id: string): Promise<any[]>;
    getExamenesPorPaciente(id: string): Promise<any[]>;
    getVacunasPorPaciente(id: string): Promise<any[]>;
    getCasosClinicos(req: any, estado?: string): Promise<any[]>;
    getCasoById(id: string): Promise<any>;
    updateCaso(id: string, data: any): Promise<any>;
    getCitaById(id: string): Promise<any>;
    getExamenes(req: any): Promise<any[]>;
    getSeguimientos(req: any): Promise<any[]>;
    updateSeguimiento(id: string, data: any): Promise<any>;
    getCitasPorMedico(req: any): Promise<any[]>;
    registrarVacuna(data: any): Promise<any>;
    updateExamen(id: string, data: any): Promise<any>;
    crearCasoClinico(data: any): Promise<any>;
    getReporteAtencion(idAtencion: string): Promise<any>;
    getReportePaciente(idPaciente: string): Promise<any>;
    getRegistrosPsicosociales(req: any): Promise<any[]>;
    crearRegistroPsicosocial(data: any): Promise<any>;
}
