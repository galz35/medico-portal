-- PostgreSQL Schema for "Claro Mi Salud"
-- Version 2.1

-- Extensión para autogenerar UUIDs si se prefiere sobre SERIAL
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla central de usuarios para autenticación y roles
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    carnet VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    correo VARCHAR(100) UNIQUE,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('PACIENTE', 'MEDICO', 'ADMIN')),
    pais VARCHAR(2) NOT NULL CHECK (pais IN ('NI', 'CR', 'HN')),
    estado CHAR(1) NOT NULL DEFAULT 'A' CHECK (estado IN ('A', 'I')),
    ultimo_acceso TIMESTAMPTZ,
    -- Foreign keys a perfiles se añaden después de crear las tablas de perfiles
    id_paciente INTEGER,
    id_medico INTEGER
);

-- Tabla de Pacientes
CREATE TABLE pacientes (
    id_paciente SERIAL PRIMARY KEY,
    carnet VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    sexo VARCHAR(50),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    gerencia VARCHAR(100),
    area VARCHAR(100),
    estado_paciente CHAR(1) NOT NULL DEFAULT 'A' CHECK (estado_paciente IN ('A', 'I')),
    nivel_semaforo CHAR(1) CHECK (nivel_semaforo IN ('V', 'A', 'R'))
);

-- Tabla de Médicos
CREATE TABLE medicos (
    id_medico SERIAL PRIMARY KEY,
    carnet VARCHAR(50) UNIQUE, -- Opcional para médicos externos
    nombre_completo VARCHAR(255) NOT NULL,
    especialidad VARCHAR(100),
    tipo_medico VARCHAR(20) NOT NULL CHECK (tipo_medico IN ('INTERNO', 'EXTERNO')),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    estado_medico CHAR(1) NOT NULL DEFAULT 'A' CHECK (estado_medico IN ('A', 'I'))
);

-- Añadir las restricciones de clave foránea a la tabla de usuarios
ALTER TABLE usuarios
ADD CONSTRAINT fk_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE SET NULL,
ADD CONSTRAINT fk_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE SET NULL;

-- Tabla de Casos Clínicos
CREATE TABLE casos_clinicos (
    id_caso SERIAL PRIMARY KEY,
    codigo_caso VARCHAR(20) UNIQUE NOT NULL,
    id_paciente INTEGER NOT NULL,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_caso VARCHAR(50) NOT NULL, -- 'Abierto', 'Agendado', 'Cerrado', 'Cancelado'
    nivel_semaforo CHAR(1) NOT NULL CHECK (nivel_semaforo IN ('V', 'A', 'R')),
    motivo_consulta TEXT NOT NULL,
    resumen_clinico_usuario TEXT,
    id_cita_principal INTEGER, -- Se añadirá FK después de crear citas_medicas
    
    CONSTRAINT fk_paciente_caso FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
);
CREATE INDEX idx_casos_clinicos_paciente ON casos_clinicos(id_paciente);
CREATE INDEX idx_casos_clinicos_estado ON casos_clinicos(estado_caso);

-- Tabla de Citas Médicas
CREATE TABLE citas_medicas (
    id_cita SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    id_caso_clinico INTEGER UNIQUE, -- Una cita principal por caso
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    canal_origen VARCHAR(100) NOT NULL,
    estado_cita VARCHAR(50) NOT NULL, -- 'PROGRAMADA', 'CONFIRMADA', 'FINALIZADA', 'CANCELADA'
    motivo_resumen TEXT,
    nivel_semaforo_paciente CHAR(1),
    
    CONSTRAINT fk_paciente_cita FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    CONSTRAINT fk_medico_cita FOREIGN KEY (id_medico) REFERENCES medicos(id_medico),
    CONSTRAINT fk_caso_clinico_cita FOREIGN KEY (id_caso_clinico) REFERENCES casos_clinicos(id_caso)
);
CREATE INDEX idx_citas_medicas_fecha ON citas_medicas(fecha_cita);
CREATE INDEX idx_citas_medicas_medico_fecha ON citas_medicas(id_medico, fecha_cita);

-- Añadir la FK que faltaba en casos_clinicos
ALTER TABLE casos_clinicos
ADD CONSTRAINT fk_cita_principal FOREIGN KEY (id_cita_principal) REFERENCES citas_medicas(id_cita) ON DELETE SET NULL;


-- Tabla de Atenciones Médicas
CREATE TABLE atenciones_medicas (
    id_atencion SERIAL PRIMARY KEY,
    id_cita INTEGER UNIQUE NOT NULL,
    id_medico INTEGER NOT NULL,
    fecha_atencion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diagnostico_principal TEXT NOT NULL,
    plan_tratamiento TEXT,
    recomendaciones TEXT,
    requiere_seguimiento BOOLEAN DEFAULT FALSE,
    fecha_siguiente_cita DATE,
    -- Campos de signos vitales
    peso_kg DECIMAL(5, 2),
    altura_m DECIMAL(3, 2),
    presion_arterial VARCHAR(10),
    
    CONSTRAINT fk_cita_atencion FOREIGN KEY (id_cita) REFERENCES citas_medicas(id_cita),
    CONSTRAINT fk_medico_atencion FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)
);

-- Tabla de Chequeos de Bienestar
CREATE TABLE chequeos_bienestar (
    id_chequeo SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nivel_semaforo CHAR(1) NOT NULL,
    datos_completos JSONB NOT NULL, -- Almacena toda la data del wizard en formato JSON
    
    CONSTRAINT fk_paciente_chequeo FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
);
CREATE INDEX idx_chequeos_paciente_fecha ON chequeos_bienestar(id_paciente, fecha_registro DESC);

-- Tabla de Registros Psicosociales
CREATE TABLE registros_psicosociales (
    id_registro SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nivel_estres VARCHAR(20),
    sintomas_referidos JSONB,
    narrativa_paciente TEXT,
    analisis_sentimiento_ia VARCHAR(20),
    riesgo_suicida BOOLEAN DEFAULT FALSE,
    derivar_a_psicologia BOOLEAN DEFAULT FALSE,
    notas_profesional TEXT,
    
    CONSTRAINT fk_paciente_psico FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    CONSTRAINT fk_medico_psico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)
);
CREATE INDEX idx_psico_paciente ON registros_psicosociales(id_paciente);


-- Comentarios para explicar la estructura:
COMMENT ON TABLE usuarios IS 'Tabla central para la gestión de acceso. El rol y país son claves para la autorización y el filtrado de datos.';
COMMENT ON TABLE pacientes IS 'Almacena la información demográfica y de la empresa de los empleados que son pacientes.';
COMMENT ON TABLE medicos IS 'Contiene la información de los profesionales de la salud, tanto internos (empleados) como externos.';
COMMENT ON TABLE casos_clinicos IS 'Agrupa una condición médica desde la solicitud inicial del paciente hasta su cierre, vinculando citas y atenciones.';
COMMENT ON TABLE citas_medicas IS 'Registra cada cita programada en el calendario. Es el eje para las atenciones.';
COMMENT ON TABLE atenciones_medicas IS 'El registro clínico detallado de lo que ocurrió en una cita. Contiene el diagnóstico y plan del médico.';
COMMENT ON TABLE chequeos_bienestar IS 'Almacena los auto-reportes de bienestar que los pacientes completan. El campo JSONB ofrece flexibilidad para futuros cambios en el wizard.';
COMMENT ON TABLE registros_psicosociales IS 'Guarda las evaluaciones de bienestar emocional y mental, realizadas por el personal médico.';
