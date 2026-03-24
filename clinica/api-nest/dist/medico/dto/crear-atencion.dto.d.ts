export declare class CrearAtencionDto {
    idCita: number;
    idMedico: number;
    diagnosticoPrincipal: string;
    planTratamiento?: string;
    recomendaciones?: string;
    requiereSeguimiento?: boolean;
    fechaSiguienteCita?: string;
    pesoKg?: number;
    alturaM?: number;
    presionArterial?: string;
    frecuenciaCardiaca?: number;
    temperaturaC?: number;
}
