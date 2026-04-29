export type RutaMotivo = 'bien' | 'sintomas' | 'rutina' | 'accidente' | 'consulta';
export type TriageNivel = 'VERDE' | 'AMARILLO' | 'ROJO' | 'NEGRO';
export type ModalidadTrabajo = 'presencial' | 'remoto' | 'mixto' | 'Oficina' | 'Remoto' | 'Vacaciones';

export interface DatosExtraJSON {
    Ruta: RutaMotivo | null;
    Modalidad: ModalidadTrabajo | null;
    Categorias: string[];
    Sintomas: string[];
    SintomasKeys: string[];
    Detalles: Record<string, any>;
    Alergia: {
        activa: boolean | null;
        descripcion?: string;
    };
    Habitos: {
        sueno: string | null;
        hidratacion: string | null;
    };
    Psicosocial: {
        estres: string | null;
        animo: string | null;
    };
    Insumos: any[];
}

export interface DetalleSintoma {
    Intensidad?: number;
    Frecuencia?: string;
    Duracion?: string;
    Desencadenantes?: string;
    Notas?: string;
}

export interface SolicitudCitaPayload {
    Ruta: RutaMotivo | null;
    Modalidad: ModalidadTrabajo | null;
    AptoLaboral: boolean | null;
    MotivoNoApto: string | null;
    AlergiasActivas: boolean | null;
    AlergiasDescripcion: string | null;
    Triage: TriageNivel;
    Comentario: string | null;
    DatosExtraJSON: DatosExtraJSON;
}
