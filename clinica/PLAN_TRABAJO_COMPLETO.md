# 📋 PLAN DE TRABAJO COMPLETO — CLARO MI SALUD
**Fecha:** 2026-02-19  
**Autor:** Análisis automático del codebase  
**Stack destino:** NestJS + mssql nativo (estilo Dapper) + Next.js 15 + SQL Server

---

## 🔍 1. ESTADO ACTUAL DEL PROYECTO

### 1.1 Frontend (Next.js 15 — `d:/clinica/studio/`)
| Elemento | Estado |
|---|---|
| Framework | Next.js 15 + TailwindCSS + Radix UI |
| Rutas implementadas | ~30 páginas en `(main)` + `(auth)` |
| Auth client | localStorage token + axios interceptor |
| Conexión API | `src/lib/api.ts` → `http://localhost:3001` |
| Servicios frontend | admin.service, medico.service, paciente.service, citas.service |
| Tipos TypeScript | `src/lib/types/domain.ts` – bien definidos |
| Mocks | Muchas páginas aún usan mocks (`src/lib/mock/`) |
| Firebase | TODAVÍA tiene referencias a Firebase (FirebaseErrorListener, etc.) |
| IA | Genkit integrado para triaje IA |

**❌ Problemas detectados:**
- Varias páginas todavía consumen datos mock en lugar de la API real
- Referencias Firebase pendientes de eliminar (`FirebaseErrorListener.tsx`, `src/firebase/`)
- El `NEXT_PUBLIC_API_URL` apunta a puerto 3001 pero el backend está en 3000
- Los tipos en `domain.ts` tienen campos `id?: string` (Firebase IDs) mezclados con `idXxx?: number` (SQL IDs) — inconsistencia

### 1.2 Backend (NestJS — `d:/clinica/studio/api_server/`)
| Elemento | Estado |
|---|---|
| Framework | NestJS 11 |
| ORM actual | TypeORM 0.3.27 + PostgreSQL driver (`pg`) |
| BD actual | SQL Server (medicoBD) — incompatible con config actual |
| Auth | JWT + bcrypt + Guards (OK) |
| Módulos | admin, auth, medico, paciente, seguimiento |
| Entidades TypeORM | 10 entidades con decoradores PostgreSQL-specific |
| Swagger | Configurado |

**❌ Problemas CRÍTICOS detectados:**
- TypeORM configurado con tipos PostgreSQL (`timestamptz`, `jsonb`, `enum`) — ❌ incompatibles con SQL Server
- `medico.entity.ts`: usa `@Column({ type: 'enum' })` — SQL Server no soporta esto con TypeORM
- `caso-clinico.entity.ts`: usa `type: 'jsonb'` — no existe en SQL Server
- `usuario.entity.ts`: usa `type: 'timestamptz'` — no existe en SQL Server
- TypeORM con SQL Server tiene bugs conocidos en: relaciones lazy, synchronize=true con FK circulares
- Todo el código de servicio usa patrones TypeORM pesados con QueryRunner
- Hay archivos `.js` compilados mezclados con `.ts` fuente — el dist está contaminando src

---

## 🏗️ 2. DECISIONES DE ARQUITECTURA

### 2.1 Eliminar TypeORM → Reemplazar con `mssql` nativo (estilo Dapper .NET)

**¿Por qué?**
- TypeORM tiene soporte deficiente para SQL Server (bugs en sync, FK circulares, tipos incompatibles)
- SQL Server **brilla** con Stored Procedures: transacciones, lógica centralizada, performance superior
- El patrón mssql nativo + SPs es equivalente al Dapper de .NET: simple, rápido, predecible
- Eliminamos toda la complejidad de entidades, decoradores, QueryRunners, etc.

**Nuevo patrón (estilo Dapper):**
```typescript
// db.service.ts - UN solo servicio de BD
async query<T>(procedure: string, params: Record<string, any> = {}): Promise<T[]> {
  const request = this.pool.request();
  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }
  const result = await request.execute(procedure);
  return result.recordset as T[];
}
```

### 2.2 Base de Datos: Stored Procedures para TODO
- Cada operación = 1 Stored Procedure en SQL Server
- Los SPs manejan lógica de negocio, validaciones y transacciones
- El backend NestJS solo llama SPs y mapea resultados a DTOs
- Sin ORM, sin synchronize, sin migraciones automáticas

### 2.3 Frontend: Terminar de conectar a la API real
- Eliminar todos los mocks
- Eliminar referencias Firebase
- Unificar tipos (eliminar campos `id?: string` de Firebase)
- Conectar al puerto correcto (3000)

---

## 📦 3. ESTRUCTURA DE PROYECTO NUEVA

### 3.1 Backend Nuevo (`api_server/src/`)
```
api_server/src/
├── main.ts                         ✅ Mantener (ajustar puerto)
├── app.module.ts                   🔄 Simplificar (sin TypeORM)
│
├── database/
│   ├── database.module.ts          🔄 Reemplazar: mssql pool provider
│   └── db.service.ts               🆕 Servicio base Dapper-style
│
├── auth/
│   ├── auth.controller.ts          ✅ Mantener
│   ├── auth.service.ts             🔄 Reemplazar: usar db.service
│   ├── auth.module.ts              🔄 Simplificar
│   ├── jwt.strategy.ts             ✅ Mantener
│   ├── jwt-auth.guard.ts           ✅ Mantener
│   ├── roles.guard.ts              ✅ Mantener
│   ├── roles.decorator.ts          ✅ Mantener
│   └── dto/
│       └── login.dto.ts            ✅ Mantener
│
├── admin/
│   ├── admin.controller.ts         🔄 Ajustar (ya está bien)
│   ├── admin.service.ts            🔄 Reemplazar: usar db.service + SPs
│   ├── admin.module.ts             🔄 Simplificar
│   └── dto/                        🔄 Limpiar
│
├── medico/
│   ├── medico.controller.ts        ✅ Mantener (está bien)
│   ├── medico.service.ts           🔄 Reemplazar completo
│   ├── medico.module.ts            🔄 Simplificar
│   └── dto/                        ✅ Mantener
│
├── paciente/
│   ├── paciente.controller.ts      🔄 Ajustar
│   ├── paciente.service.ts         🔄 Reemplazar completo
│   ├── paciente.module.ts          🔄 Simplificar
│   └── dto/                        ✅ Mantener
│
└── seguimiento/
    ├── seguimiento.controller.ts   🔄 Ajustar
    ├── seguimiento.service.ts      🔄 Reemplazar
    └── seguimiento.module.ts       🔄 Simplificar

❌ ELIMINAR COMPLETAMENTE:
├── entities/                       ❌ Todo el directorio (10 entidades)
└── *.js (archivos compilados en src/) ❌ No deben estar en src/
```

### 3.2 SQL Server: Stored Procedures a crear
```sql
-- AUTENTICACIÓN
sp_Login                     -- Valida credenciales, regresa usuario
sp_UpdateUltimoAcceso        -- Actualiza último acceso

-- ADMIN
sp_Admin_GetDashboard        -- KPIs del dashboard
sp_Admin_GetUsuarios         -- Lista usuarios paginada
sp_Admin_CrearUsuario        -- Crea usuario + paciente/médico en TX
sp_Admin_UpdateUsuario       -- Actualiza usuario
sp_Admin_GetMedicos          -- Lista médicos
sp_Admin_CrearMedico         -- Crea médico
sp_Admin_GetEmpleados        -- Lista empleados
sp_Admin_GetReporteAtenciones-- Reporte de atenciones

-- MÉDICO
sp_Medico_GetDashboard       -- KPIs médico (citas hoy, alertas)
sp_Medico_GetAgendaCitas     -- Casos abiertos pendientes de agendar
sp_Medico_AgendarCita        -- Crea cita + actualiza caso (TX)
sp_Medico_CancelarCaso       -- Cancela caso
sp_Medico_GetCasosCliincos   -- Lista casos clínicos filtrado
sp_Medico_GetCasoById        -- Detalle caso con JOIN
sp_Medico_CrearAtencion      -- Crea atención + cierra cita+caso (TX)
sp_Medico_GetPacientes       -- Lista pacientes del país
sp_Medico_GetExamenes        -- Lista exámenes
sp_Medico_GetSeguimientos    -- Lista seguimientos
sp_Medico_UpdateSeguimiento  -- Actualiza seguimiento
sp_Medico_RegistrarVacuna    -- Registra vacuna
sp_Medico_GetCitasPorMedico  -- Citas asignadas al médico

-- PACIENTE
sp_Paciente_GetDashboard     -- KPIs paciente
sp_Paciente_SolicitarCita    -- Registra chequeo + crea caso (TX)
sp_Paciente_GetMisCitas      -- Historial de citas
sp_Paciente_GetMisChequeos   -- Historial de chequeos
sp_Paciente_GetMisExamenes   -- Exámenes del paciente
sp_Paciente_GetMisVacunas    -- Vacunas del paciente
sp_Paciente_CrearChequeo     -- Chequeo diario
```

---

## 🗃️ 4. ESQUEMA SQL SERVER (DDL completo)

```sql
-- Crear en medicoBD

-- TABLA: usuarios
CREATE TABLE usuarios (
    id_usuario      INT IDENTITY(1,1) PRIMARY KEY,
    carnet          VARCHAR(50) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    correo          VARCHAR(100) NULL,
    rol             VARCHAR(20) NOT NULL CHECK (rol IN ('PACIENTE','MEDICO','ADMIN')),
    pais            VARCHAR(2) NOT NULL CHECK (pais IN ('NI','CR','HN')),
    estado          CHAR(1) NOT NULL DEFAULT 'A' CHECK (estado IN ('A','I')),
    ultimo_acceso   DATETIME2 NULL,
    id_paciente     INT NULL,
    id_medico       INT NULL,
    fecha_creacion  DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- TABLA: pacientes
CREATE TABLE pacientes (
    id_paciente       INT IDENTITY(1,1) PRIMARY KEY,
    carnet            VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo   VARCHAR(255) NOT NULL,
    fecha_nacimiento  DATE NULL,
    sexo              VARCHAR(50) NULL,
    telefono          VARCHAR(20) NULL,
    correo            VARCHAR(100) NULL,
    gerencia          VARCHAR(100) NULL,
    area              VARCHAR(100) NULL,
    estado_paciente   CHAR(1) NOT NULL DEFAULT 'A',
    nivel_semaforo    CHAR(1) NULL CHECK (nivel_semaforo IN ('V','A','R'))
);

-- TABLA: medicos
CREATE TABLE medicos (
    id_medico       INT IDENTITY(1,1) PRIMARY KEY,
    carnet          VARCHAR(50) UNIQUE NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    especialidad    VARCHAR(100) NULL,
    tipo_medico     VARCHAR(20) NOT NULL CHECK (tipo_medico IN ('INTERNO','EXTERNO')),
    correo          VARCHAR(100) NULL,
    telefono        VARCHAR(20) NULL,
    estado_medico   CHAR(1) NOT NULL DEFAULT 'A'
);

-- TABLA: empleados (tabla maestra de RRHH)
CREATE TABLE empleados (
    id_empleado        INT IDENTITY(1,1) PRIMARY KEY,
    carnet             VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo    VARCHAR(255) NOT NULL,
    correo             VARCHAR(100) NULL,
    cargo              VARCHAR(100) NULL,
    gerencia           VARCHAR(100) NULL,
    subgerencia        VARCHAR(100) NULL,
    area               VARCHAR(100) NULL,
    telefono           VARCHAR(20) NULL,
    nom_jefe           VARCHAR(255) NULL,
    correo_jefe        VARCHAR(100) NULL,
    carnet_jefe        VARCHAR(50) NULL,
    pais               VARCHAR(2) NOT NULL,
    fecha_nacimiento   DATE NULL,
    fecha_contratacion DATE NULL,
    estado             VARCHAR(10) NOT NULL DEFAULT 'ACTIVO'
);

-- TABLA: casos_clinicos
CREATE TABLE casos_clinicos (
    id_caso                  INT IDENTITY(1,1) PRIMARY KEY,
    codigo_caso              VARCHAR(20) UNIQUE NOT NULL,
    id_paciente              INT NOT NULL FOREIGN KEY REFERENCES pacientes(id_paciente),
    fecha_creacion           DATETIME2 NOT NULL DEFAULT GETDATE(),
    estado_caso              VARCHAR(50) NOT NULL DEFAULT 'Abierto',
    nivel_semaforo           CHAR(1) NOT NULL CHECK (nivel_semaforo IN ('V','A','R')),
    motivo_consulta          NVARCHAR(MAX) NOT NULL,
    resumen_clinico_usuario  NVARCHAR(MAX) NULL,
    diagnostico_usuario      NVARCHAR(MAX) NULL,
    datos_extra              NVARCHAR(MAX) NULL,  -- JSON como texto en SQL Server
    id_cita_principal        INT NULL
);

-- TABLA: citas_medicas
CREATE TABLE citas_medicas (
    id_cita                  INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente              INT NOT NULL FOREIGN KEY REFERENCES pacientes(id_paciente),
    id_medico                INT NOT NULL FOREIGN KEY REFERENCES medicos(id_medico),
    id_caso                  INT NULL FOREIGN KEY REFERENCES casos_clinicos(id_caso),
    fecha_cita               DATE NOT NULL,
    hora_cita                VARCHAR(8) NOT NULL,
    canal_origen             VARCHAR(100) NOT NULL,
    estado_cita              VARCHAR(50) NOT NULL DEFAULT 'PROGRAMADA',
    motivo_resumen           NVARCHAR(MAX) NOT NULL,
    nivel_semaforo_paciente  CHAR(1) NOT NULL
);

-- TABLA: atenciones_medicas
CREATE TABLE atenciones_medicas (
    id_atencion              INT IDENTITY(1,1) PRIMARY KEY,
    id_cita                  INT NOT NULL UNIQUE FOREIGN KEY REFERENCES citas_medicas(id_cita),
    id_medico                INT NOT NULL FOREIGN KEY REFERENCES medicos(id_medico),
    fecha_atencion           DATETIME2 NOT NULL DEFAULT GETDATE(),
    diagnostico_principal    NVARCHAR(MAX) NOT NULL,
    plan_tratamiento         NVARCHAR(MAX) NULL,
    recomendaciones          NVARCHAR(MAX) NULL,
    requiere_seguimiento     BIT NOT NULL DEFAULT 0,
    fecha_siguiente_cita     DATE NULL,
    tipo_siguiente_cita      VARCHAR(50) NULL,
    notas_seguimiento_medico NVARCHAR(MAX) NULL,
    peso_kg                  DECIMAL(5,2) NULL,
    altura_m                 DECIMAL(3,2) NULL,
    presion_arterial         VARCHAR(10) NULL,
    frecuencia_cardiaca      INT NULL,
    temperatura_c            DECIMAL(4,1) NULL
);

-- TABLA: chequeos_bienestar
CREATE TABLE chequeos_bienestar (
    id_chequeo      INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente     INT NOT NULL FOREIGN KEY REFERENCES pacientes(id_paciente),
    fecha_registro  DATETIME2 NOT NULL DEFAULT GETDATE(),
    nivel_semaforo  CHAR(1) NOT NULL CHECK (nivel_semaforo IN ('V','A','R')),
    datos_completos NVARCHAR(MAX) NOT NULL  -- JSON serializado
);

-- TABLA: seguimientos
CREATE TABLE seguimientos (
    id_seguimiento      INT IDENTITY(1,1) PRIMARY KEY,
    id_caso             INT NULL FOREIGN KEY REFERENCES casos_clinicos(id_caso),
    id_atencion         INT NULL FOREIGN KEY REFERENCES atenciones_medicas(id_atencion),
    id_paciente         INT NOT NULL FOREIGN KEY REFERENCES pacientes(id_paciente),
    id_usuario_resp     INT NULL FOREIGN KEY REFERENCES usuarios(id_usuario),
    fecha_programada    DATE NOT NULL,
    fecha_real          DATE NULL,
    tipo_seguimiento    VARCHAR(20) NOT NULL DEFAULT 'PRESENCIAL',
    estado_seguimiento  VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    nivel_semaforo      CHAR(1) NOT NULL DEFAULT 'V',
    notas_seguimiento   NVARCHAR(MAX) NULL,
    motivo              NVARCHAR(MAX) NULL
);

-- TABLA: examenes_medicos
CREATE TABLE examenes_medicos (
    id_examen         INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente       INT NOT NULL FOREIGN KEY REFERENCES pacientes(id_paciente),
    id_caso           INT NULL FOREIGN KEY REFERENCES casos_clinicos(id_caso),
    id_atencion       INT NULL FOREIGN KEY REFERENCES atenciones_medicas(id_atencion),
    tipo_examen       VARCHAR(100) NOT NULL,
    fecha_solicitud   DATETIME2 NOT NULL DEFAULT GETDATE(),
    fecha_resultado   DATETIME2 NULL,
    laboratorio       VARCHAR(100) NULL,
    resultado_resumen NVARCHAR(MAX) NULL,
    estado_examen     VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
);

-- TABLA: vacunas_aplicadas
CREATE TABLE vacunas_aplicadas (
    id_vacuna_registro INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente        INT NOT NULL FOREIGN KEY REFERENCES pacientes(id_paciente),
    id_medico          INT NULL FOREIGN KEY REFERENCES medicos(id_medico),
    id_atencion        INT NULL FOREIGN KEY REFERENCES atenciones_medicas(id_atencion),
    tipo_vacuna        VARCHAR(100) NOT NULL,
    dosis              VARCHAR(50) NOT NULL,
    fecha_aplicacion   DATE NOT NULL,
    observaciones      NVARCHAR(MAX) NULL
);

-- TABLA: registros_psicosociales
CREATE TABLE registros_psicosociales (
    id_registro_psico  INT IDENTITY(1,1) PRIMARY KEY,
    id_paciente        INT NOT NULL FOREIGN KEY REFERENCES pacientes(id_paciente),
    id_medico          INT NULL FOREIGN KEY REFERENCES medicos(id_medico),
    id_atencion        INT NULL FOREIGN KEY REFERENCES atenciones_medicas(id_atencion),
    fecha_registro     DATETIME2 NOT NULL DEFAULT GETDATE(),
    confidencial       BIT NOT NULL DEFAULT 0,
    nivel_estres       VARCHAR(20) NULL,
    sintomas_psico     NVARCHAR(MAX) NULL, -- JSON array como texto
    estado_animo_gral  NVARCHAR(MAX) NULL,
    analisis_sentiment VARCHAR(20) NULL,
    riesgo_suicida     BIT NULL,
    derivar_a_psico    BIT NULL,
    notas_psico        NVARCHAR(MAX) NULL
);

-- FK adicional (después de crear tablas)
ALTER TABLE usuarios ADD CONSTRAINT FK_usuarios_pacientes 
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente);
ALTER TABLE usuarios ADD CONSTRAINT FK_usuarios_medicos 
    FOREIGN KEY (id_medico) REFERENCES medicos(id_medico);
ALTER TABLE casos_clinicos ADD CONSTRAINT FK_casos_cita_principal 
    FOREIGN KEY (id_cita_principal) REFERENCES citas_medicas(id_cita);
```

---

## 🔧 5. PLAN DE IMPLEMENTACIÓN DETALLADO

### FASE 1: Limpiar y preparar Backend (1 día) ⭐ PRIORITARIO

#### Tarea 1.1 — Eliminar TypeORM y dependencias relacionadas
```bash
npm uninstall typeorm @nestjs/typeorm pg
npm install mssql
npm install --save-dev @types/mssql
```
**Archivos a ELIMINAR:**
- `src/entities/` — todo el directorio (10 archivos .ts + 10 .js compilados)
- Todos los `.js` en `src/` que son compilados de TypeScript (no deben estar ahí)

#### Tarea 1.2 — Crear DbService (el "Dapper" del proyecto)
**Archivo:** `src/database/db.service.ts`
```typescript
import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

@Injectable()
export class DbService implements OnApplicationBootstrap, OnApplicationShutdown {
  private pool: sql.ConnectionPool;

  constructor(private configService: ConfigService) {}

  async onApplicationBootstrap() {
    this.pool = await new sql.ConnectionPool({
      user: this.configService.get<string>('MSSQL_USER'),
      password: this.configService.get<string>('MSSQL_PASSWORD'),
      server: this.configService.get<string>('MSSQL_HOST'),
      port: parseInt(this.configService.get<string>('MSSQL_PORT') || '1433', 10),
      database: this.configService.get<string>('MSSQL_DATABASE'),
      options: {
        encrypt: this.configService.get<string>('MSSQL_ENCRYPT') === 'true',
        trustServerCertificate: this.configService.get<string>('MSSQL_TRUST_CERT') === 'true',
      },
    }).connect();
    console.log('✅ SQL Server pool conectado');
  }

  async onApplicationShutdown() {
    await this.pool.close();
  }

  // Ejecutar Stored Procedure con parámetros
  async execute<T>(procedure: string, params: Record<string, any> = {}): Promise<T[]> {
    const request = this.pool.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    const result = await request.execute(procedure);
    return result.recordset as T[];
  }

  // Ejecutar SP y obtener solo el primer registro
  async executeOne<T>(procedure: string, params: Record<string, any> = {}): Promise<T | null> {
    const rows = await this.execute<T>(procedure, params);
    return rows.length > 0 ? rows[0] : null;
  }

  // Ejecutar SP que no regresa datos (INSERT/UPDATE/DELETE simples)
  async executeNonQuery(procedure: string, params: Record<string, any> = {}): Promise<void> {
    const request = this.pool.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    await request.execute(procedure);
  }
  
  // Raw query para casos especiales
  async query<T>(sql: string, params: Record<string, any> = {}): Promise<T[]> {
    const request = this.pool.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    const result = await request.query(sql);
    return result.recordset as T[];
  }
}
```

#### Tarea 1.3 — Crear DatabaseModule simplificado
```typescript
// database.module.ts
import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';

@Global()   // Global para que todos los módulos puedan inyectar DbService
@Module({
  providers: [DbService],
  exports: [DbService],
})
export class DatabaseModule {}
```

#### Tarea 1.4 — Limpiar app.module.ts
- Remover todos los imports de TypeORM
- Solo quedan: ConfigModule, DatabaseModule, AuthModule, AdminModule, MedicoModule, PacienteModule, SeguimientoModule

---

### FASE 2: Crear base de datos y Stored Procedures (1 día)

#### Tarea 2.1 — Ejecutar DDL en medicoBD
Crear script `scripts/01_create_tables.sql` con todo el DDL.
Ejecutar en SQL Server Management Studio o via script Node.js.

#### Tarea 2.2 — Crear todos los Stored Procedures
Crear `scripts/02_create_procedures.sql` con todos los SPs listados en la sección 3.2.

**Ejemplo de SP crítico:**
```sql
-- sp_Login
CREATE PROCEDURE sp_Login
    @Carnet VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        u.id_usuario,
        u.carnet,
        u.password_hash,
        u.nombre_completo,
        u.correo,
        u.rol,
        u.pais,
        u.estado,
        u.id_paciente,
        u.id_medico,
        p.nivel_semaforo
    FROM usuarios u
    LEFT JOIN pacientes p ON u.id_paciente = p.id_paciente
    WHERE u.carnet = @Carnet AND u.estado = 'A';
END;
```

#### Tarea 2.3 — Crear usuario admin inicial
```sql
-- Script para insertar admin inicial (contraseña: admin123)
INSERT INTO usuarios (carnet, password_hash, nombre_completo, correo, rol, pais, estado)
VALUES ('ADMIN001', '$2b$10$...hash...', 'Admin Sistema', 'admin@clinica.com', 'ADMIN', 'NI', 'A');
```

---

### FASE 3: Reescribir servicios backend (2 días)

#### Tarea 3.1 — auth.service.ts (con DbService)
```typescript
@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.db.executeOne<any>('sp_Login', { Carnet: loginDto.carnet });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    
    const passOk = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!passOk) throw new UnauthorizedException('Credenciales inválidas');

    await this.db.executeNonQuery('sp_UpdateUltimoAcceso', { IdUsuario: user.id_usuario });

    const payload = {
      sub: user.id_usuario,
      carnet: user.carnet,
      rol: user.rol,
      pais: user.pais,
      idPaciente: user.id_paciente,
      idMedico: user.id_medico,
    };

    return { access_token: this.jwtService.sign(payload), user };
  }
}
```

#### Tarea 3.2 — admin.service.ts
- `getDashboardStats(pais)` → `sp_Admin_GetDashboard`
- `crearUsuario(dto)` → `sp_Admin_CrearUsuario` (TX en el SP)
- `getUsuarios(pais)` → `sp_Admin_GetUsuarios`
- etc.

#### Tarea 3.3 — medico.service.ts
- `getDashboardStats(idMedico, pais)` → `sp_Medico_GetDashboard`
- `getAgendaCitas(pais)` → `sp_Medico_GetAgendaCitas`
- `agendarCita(dto)` → `sp_Medico_AgendarCita` (TX en SP)
- etc.

#### Tarea 3.4 — paciente.service.ts
- `getDashboardStats(idPaciente)` → `sp_Paciente_GetDashboard`
- `solicitarCita(idPaciente, dto)` → `sp_Paciente_SolicitarCita` (TX en SP)
- etc.

#### Tarea 3.5 — Actualizar todos los módulos
- Remover `TypeOrmModule.forFeature([...])` de todos los módulos
- Solo inyectar `DbService` via constructor

---

### FASE 4: Conectar Frontend a la API real (2 días)

#### Tarea 4.1 — Corregir URL de la API
```env
# Agregar en d:/clinica/studio/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Tarea 4.2 — Eliminar Firebase del frontend
**Archivos a eliminar o vaciar:**
- `src/components/FirebaseErrorListener.tsx`
- `src/firebase/` — todo el directorio
- Remover uso de Firebase de los layouts

#### Tarea 4.3 — Eliminar mocks y conectar a API real
**Páginas que aún usan mocks (verificar y actualizar):**
- `admin/gestion-empleados/page.tsx`
- `admin/gestion-usuarios/page.tsx`
- `admin/gestion-medicos/page.tsx`
- `medico/agenda-citas/page.tsx`
- `medico/seguimientos/page.tsx`
- `medico/examenes/page.tsx`
- `medico/registro-vacunas/page.tsx`
- `paciente/mis-examenes/page.tsx`
- `paciente/mis-vacunas/page.tsx`

#### Tarea 4.4 — Limpiar tipos domain.ts
- Eliminar todos los campos `id?: string` (Firebase)
- Unificar a `idXxx: number`
- Asegurar que coincidan exactamente con lo que regresa la API

#### Tarea 4.5 — Conectar hooks y context
- Verificar `use-user-profile.ts` — debe leer del JWT, no Firebase
- Verificar el Context de autenticación

---

### FASE 5: Completar páginas faltantes del Frontend (3 días)

#### Páginas que necesitan implementación completa:
1. **`/admin/reportes`** — Reportes de atenciones con filtros y gráficas
2. **`/admin/psicosocial`** — Vista de registros psicosociales
3. **`/medico/psicosocial`** — Módulo psicosocial del médico
4. **`/medico/analisis-ia`** — Análisis con Genkit (ya tiene base)
5. **`/medico/agenda-calendario`** — Vista calendario con react-day-picker
6. **`/paciente/psicosocial`** — Registro psicosocial del paciente
7. **`/tutorial`** — Tutorial de uso de la plataforma

#### Componentes faltantes:
- Filtros de fecha en tablas
- Paginación en listas largas
- Gestión de errores global (toasts)
- Loading states consistentes

---

### FASE 6: Seguridad y calidad (1 día)

#### Tarea 6.1 — Hardening del backend
- Remover el endpoint `POST /admin/debug/set-password` (peligroso en producción)
- Agregar rate limiting con `@nestjs/throttler`
- Agregar CORS configurado correctamente
- Agregar validación de parámetros en todos los endpoints
- Centralizar manejo de errores con ExceptionFilters

#### Tarea 6.2 — Variables de entorno del frontend
```env
# d:/clinica/studio/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Tarea 6.3 — Revisar Guards y autorización
- Verificar que TodAS las rutas sensibles tengan `@UseGuards(JwtAuthGuard, RolesGuard)`
- Agregar validación del `pais` del JWT en todas las queries (multi-tenant)

---

## 📊 6. RESUMEN EJECUTIVO DE CAMBIOS

| Componente | Antes | Después |
|---|---|---|
| ORM | TypeORM 0.3.27 (problemático) | mssql nativo + Stored Procedures |
| Conexión BD | TypeOrmModule con synchronize | Pool de conexiones persistente |
| Lógica transaccional | QueryRunner en TypeScript | Stored Procedures en SQL Server |
| Tipos PostgreSQL | timestamptz, jsonb, enum | datetime2, nvarchar(max), varchar |
| Entidades | 10 archivos entity con decoradores | ❌ Eliminadas |
| Auth BD | Repository<Usuario> | DbService.execute('sp_Login') |
| Frontend mocks | Muchos archivos mock | ❌ Eliminados |
| Firebase frontend | FirebaseErrorListener, firebase/ | ❌ Eliminados |
| Puerto API | 3001 (incorrecto) | 3000 (correcto) |

---

## 🚀 7. ORDEN DE EJECUCIÓN SUGERIDO

```
Semana 1:
├── Día 1: Fase 1 (Limpiar backend, crear DbService)
├── Día 2: Fase 2 (DDL + Stored Procedures)
├── Día 3: Fase 3a (auth + admin services)
├── Día 4: Fase 3b (medico + paciente services)
└── Día 5: Fase 4 (Conectar frontend)

Semana 2:
├── Día 1-3: Fase 5 (Completar páginas)
└── Día 4: Fase 6 (Seguridad) + testing

Total estimado: ~9 días de trabajo
```

---

## ⚠️ 8. RIESGOS Y MITIGACIONES

| Riesgo | Impacto | Mitigación |
|---|---|---|
| SP con lógica compleja difícil de debuguear | Medio | Agregar logs en SPs, pruebas individuales |
| Pérdida de datos en migración | Alto | Hacer backup antes, ejecutar DDL en ambiente de prueba primero |
| Frontend desincronizado con nueva API | Medio | Actualizar tipos domain.ts antes de conectar páginas |
| JWT payload cambia forma | Medio | Revisar todos los lugares que leen del token |

---

*Este plan está basado en el análisis completo del código existente en d:/clinica/studio/. Versión 1.0*
