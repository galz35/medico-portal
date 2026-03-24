export declare enum Rol {
    PACIENTE = "PACIENTE",
    MEDICO = "MEDICO",
    ADMIN = "ADMIN"
}
export declare enum Pais {
    NI = "NI",
    CR = "CR",
    HN = "HN"
}
export declare class CrearUsuarioDto {
    carnet: string;
    nombreCompleto: string;
    correo?: string;
    rol: Rol;
    pais: Pais;
    password: string;
}
