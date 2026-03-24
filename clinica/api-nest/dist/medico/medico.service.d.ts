import { DbService } from '../database/db.service';
import { AgendarCitaDto } from './dto/agendar-cita.dto';
import { CrearAtencionDto } from './dto/crear-atencion.dto';
export declare class MedicoService {
    private db;
    constructor(db: DbService);
    getPacientes(pais: string): Promise<any[]>;
    getChequeosPorPaciente(idPaciente: number): Promise<any[]>;
    getCitasPorPaciente(idPaciente: number): Promise<any[]>;
    getExamenesPorPaciente(idPaciente: number): Promise<any[]>;
    getVacunasPorPaciente(idPaciente: number): Promise<any[]>;
    getDashboardStats(idMedico: number, pais: string): Promise<{
        citasHoyCount: number;
        citasHoy: any[];
        pacientesEnRojoCount: number;
        pacientesEnRojo: any[];
        casosAbiertos: any;
    }>;
    getAgendaCitas(pais: string): Promise<any[]>;
    getCasosClinicos(pais: string, estado?: string): Promise<any[]>;
    getCasoById(id: number): Promise<any>;
    updateCaso(id: number, data: any): Promise<any>;
    getCitaById(id: number): Promise<any>;
    agendarCita(agendarCitaDto: AgendarCitaDto): Promise<any>;
    crearAtencion(crearAtencionDto: CrearAtencionDto): Promise<any>;
    getExamenes(pais: string): Promise<any[]>;
    updateExamen(id: number, data: any): Promise<any>;
    getSeguimientos(pais: string): Promise<any[]>;
    updateSeguimiento(id: number, data: any): Promise<any>;
    getCitasPorMedico(idMedico: number, pais: string): Promise<any[]>;
    registrarVacuna(data: any): Promise<any>;
    crearCasoClinico(data: any): Promise<any>;
    getReporteAtencion(idAtencion: number): Promise<any>;
    getReportePaciente(idPaciente: number): Promise<any>;
    getRegistrosPsicosociales(pais: string): Promise<any[]>;
    crearRegistroPsicosocial(data: any): Promise<any>;
}
