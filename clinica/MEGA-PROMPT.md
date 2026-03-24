# Mega Prompt v2.0: Backend para "Claro Mi Salud" (PostgreSQL)

## 1. Resumen del Proyecto

**"Claro Mi Salud"** es un sistema de gestión de salud corporativo para conectar empleados (Pacientes) con el equipo médico de la empresa (Médicos), gestionado por un rol de Administrador. La aplicación facilita el seguimiento del bienestar, la gestión de citas, la atención clínica digital y la administración general del sistema.

Este documento es una especificación técnica detallada para la construcción de un backend robusto y escalable utilizando **NestJS**, **TypeORM** y **PostgreSQL**. La API debe ser RESTful, estar asegurada con **JWT** para autenticación y autorización basada en roles, y documentada con **Swagger**.

---

## 2. Arquitectura y Tecnologías del Backend

- **Framework:** NestJS
- **ORM:** TypeORM
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT (JSON Web Tokens) con Bcrypt para contraseñas.
- **Documentación API:** Swagger (OpenAPI)
- **Lenguaje:** TypeScript
- **Validación:** `class-validator` y `class-transformer` para DTOs.

---

## 3. Roles de Usuario y Autenticación

Tres roles principales: **`PACIENTE`**, **`MEDICO`**, **`ADMIN`**.

### Flujo de Autenticación (Login con Contraseña)

1.  **Endpoint:** `POST /auth/login`
2.  **Request Body (DTO):** `LoginUsuarioDto { carnet: string, password: string }`
3.  **Lógica:**
    a. Buscar en la tabla `usuarios` un registro donde `carnet` coincida. Si no se encuentra, devolver `401 Unauthorized`.
    b. Usar `bcrypt.compare()` para verificar el `password` proporcionado contra el hash almacenado. Si no coincide, devolver `401 Unauthorized`.
    c. Si las credenciales son válidas, generar un token JWT.
    d. **Payload del JWT:** `{ idUsuario: number, carnet: string, rol: Rol, pais: Pais }`.
    e. Actualizar el campo `ultimo_acceso` del usuario a la fecha y hora actuales.
    f. Devolver el token JWT al cliente.
4.  **Guardias de NestJS:**
    *   Un `JwtAuthGuard` global protegerá la mayoría de las rutas.
    *   Un `RolesGuard` se usará en conjunto con decoradores `@Roles(Rol.ADMIN, ...)` para controlar el acceso a nivel de controlador o de método.

---

## 4. Modelos de Datos (Entidades TypeORM para PostgreSQL)

A continuación se describen las entidades, sus campos, tipos de datos para PostgreSQL y relaciones.

### `Usuario` (`usuarios`)
Almacena las credenciales y datos básicos de acceso.

```typescript
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  carnet: string;

  @Column({ type: 'varchar' })
  password_hash: string; // Almacenar el hash de la contraseña

  @Column({ type: 'varchar', length: 255 })
  nombre_completo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo: string;

  @Column({ type: 'enum', enum: ['PACIENTE', 'MEDICO', 'ADMIN'] })
  rol: string;

  @Column({ type: 'enum', enum: ['NI', 'CR', 'HN'] })
  pais: string;

  @Column({ type: 'char', length: 1, default: 'A' }) // A: Activo, I: Inactivo
  estado: string;

  @Column({ type: 'timestamptz', nullable: true })
  ultimo_acceso: Date;

  // Relaciones
  @OneToOne(() => Paciente, paciente => paciente.usuario, { nullable: true, cascade: true })
  @JoinColumn({ name: 'id_paciente' })
  paciente: Paciente;

  @OneToOne(() => Medico, medico => medico.usuario, { nullable: true, cascade: true })
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;
}
```

### `Paciente` (`pacientes`)
Datos demográficos y de la empresa del paciente.

```typescript
@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn()
  id_paciente: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  carnet: string;
  
  @Column({ type: 'varchar', length: 255 })
  nombre_completo: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;
  
  @Column({ type: 'varchar', length: 50, nullable: true })
  sexo: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gerencia: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  area: string;

  @Column({ type: 'char', length: 1, default: 'A' })
  estado_paciente: string; // A: Activo, I: Inactivo

  @Column({ type: 'char', length: 1, nullable: true })
  nivel_semaforo: string; // V, A, R

  // Relaciones
  @OneToOne(() => Usuario, usuario => usuario.paciente)
  usuario: Usuario;

  @OneToMany(() => CasoClinico, caso => caso.paciente)
  casos_clinicos: CasoClinico[];
}
```

### `Medico` (`medicos`)
Información sobre los profesionales de la salud.

```typescript
@Entity('medicos')
export class Medico {
  @PrimaryGeneratedColumn()
  id_medico: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  carnet: string; // Opcional para médicos externos

  @Column({ type: 'varchar', length: 255 })
  nombre_completo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  especialidad: string;

  @Column({ type: 'enum', enum: ['INTERNO', 'EXTERNO'] })
  tipo_medico: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'char', length: 1, default: 'A' })
  estado_medico: string; // A: Activo, I: Inactivo

  // Relaciones
  @OneToOne(() => Usuario, usuario => usuario.medico)
  usuario: Usuario;

  @OneToMany(() => CitaMedica, cita => cita.medico)
  citas_medicas: CitaMedica[];
}
```

### `CasoClinico` (`casos_clinicos`)
Agrupa una condición o motivo de consulta desde su inicio hasta su cierre.

```typescript
@Entity('casos_clinicos')
@Index(['codigo_caso'], { unique: true })
export class CasoClinico {
  @PrimaryGeneratedColumn()
  id_caso: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_caso: string; // Autogenerado: CC-YYYY-#####

  @ManyToOne(() => Paciente, paciente => paciente.casos_clinicos)
  @JoinColumn({ name: 'id_paciente' })
  paciente: Paciente;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column({ type: 'varchar', length: 50 })
  estado_caso: string; // 'Abierto', 'Agendado', 'Cerrado', 'Cancelado'

  @Column({ type: 'char', length: 1 })
  nivel_semaforo: string; // V, A, R

  @Column({ type: 'text' })
  motivo_consulta: string;

  @Column({ type: 'text', nullable: true })
  resumen_clinico_usuario: string;

  // Relaciones
  @OneToOne(() => CitaMedica, cita => cita.caso_clinico, { nullable: true })
  @JoinColumn({ name: 'id_cita_principal' })
  cita_principal: CitaMedica;
}
```

### `CitaMedica` (`citas_medicas`)
Una cita específica programada en el calendario.

```typescript
@Entity('citas_medicas')
export class CitaMedica {
  @PrimaryGeneratedColumn()
  id_cita: number;
  
  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'id_paciente' })
  paciente: Paciente;

  @ManyToOne(() => Medico, medico => medico.citas_medicas)
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;

  @OneToOne(() => CasoClinico, caso => caso.cita_principal, { nullable: true })
  caso_clinico: CasoClinico;

  @Column({ type: 'date' })
  fecha_cita: Date;

  @Column({ type: 'time' })
  hora_cita: string;
  
  @Column({ type: 'varchar', length: 100 })
  canal_origen: string; // 'CHEQUEO', 'RRHH', 'SOLICITUD_DIRECTA'

  @Column({ type: 'varchar', length: 50 })
  estado_cita: string; // 'PROGRAMADA', 'CONFIRMADA', 'FINALIZADA', 'CANCELADA'

  @Column({ type: 'text' })
  motivo_resumen: string;

  @Column({ type: 'char', length: 1 })
  nivel_semaforo_paciente: string; // V, A, R - El semáforo al momento de la cita

  // Relaciones
  @OneToOne(() => AtencionMedica, atencion => atencion.cita)
  atencion_medica: AtencionMedica;
}
```

### `AtencionMedica` (`atenciones_medicas`)
El registro clínico detallado de lo que sucedió en una cita.

```typescript
@Entity('atenciones_medicas')
export class AtencionMedica {
  @PrimaryGeneratedColumn()
  id_atencion: number;

  @OneToOne(() => CitaMedica, cita => cita.atencion_medica)
  @JoinColumn({ name: 'id_cita' })
  cita: CitaMedica;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_atencion: Date;

  @Column({ type: 'text' })
  diagnostico_principal: string;

  @Column({ type: 'text', nullable: true })
  plan_tratamiento: string;

  @Column({ type: 'text', nullable: true })
  recomendaciones: string;
  
  @Column({ type: 'boolean', default: false })
  requiere_seguimiento: boolean;
  
  @Column({ type: 'date', nullable: true })
  fecha_siguiente_cita: Date;

  // Otros campos del formulario...
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peso_kg: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  altura_m: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  presion_arterial: string; // "120/80"
}
```

### `ChequeoBienestar` (`chequeos_bienestar`)
Registro diario del estado de bienestar del paciente.

```typescript
@Entity('chequeos_bienestar')
export class ChequeoBienestar {
    @PrimaryGeneratedColumn()
    id_chequeo: number;

    @ManyToOne(() => Paciente)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    fecha_registro: Date;
    
    @Column({ type: 'char', length: 1 })
    nivel_semaforo: string; // V, A, R

    // JSONB para almacenar toda la data del wizard (flexible)
    @Column({ type: 'jsonb' })
    datos_completos: object;
}
```
---

## 5. Endpoints de la API (Detallado)

### Módulo de Autenticación (`/auth`)

- **`POST /auth/login`**:
    - **Rol:** Público.
    - **DTO:** `LoginDto { carnet: string, password: string }`
    - **Lógica:** Autentica al usuario. Si es exitoso, devuelve JWT con payload `{ idUsuario, carnet, rol, pais }`. Actualiza `ultimo_acceso`.
    - **Respuesta:** `{ accessToken: string }`

### Módulo de Administración (`/admin`) - Rol: `ADMIN`

- **`GET /admin/dashboard`**:
    - **Lógica:** Devuelve KPIs agregados para el `pais` del admin (obtenido del JWT).
    - **Consultas:** `COUNT` en `usuarios`, `medicos`, `citas` (con filtros de fecha y país).
    - **Respuesta:** Objeto con totales: `{ totalUsuarios, medicosActivos, citasHoy, pacientesEnRojo, ... }`.

- **`GET /admin/usuarios`**:
    - **Lógica:** Devuelve una lista paginada de `usuarios`.
    - **Query Params:** `page`, `limit`, `rol`, `estado`, `search`.
    - **Filtro:** Siempre filtra por el `pais` del token JWT del admin.
    - **Consulta:** `SELECT * FROM usuarios WHERE pais = :pais AND ... LIMIT :limit OFFSET :offset`.

- **`POST /admin/usuarios`**:
    - **DTO:** `CrearUsuarioDto { carnet, nombreCompleto, correo, rol, pais, password }`
    - **Lógica:**
        1. Hashear `password` con `bcrypt`.
        2. Crear un nuevo `Usuario`.
        3. **Transacción:** Si el `rol` es `PACIENTE` o `MEDICO`, crear también la entidad `Paciente` o `Medico` correspondiente y asociarla al nuevo usuario.
    - **Respuesta:** `201 Created` con el nuevo objeto `Usuario`.

- **`PUT /admin/usuarios/:id`**:
    - **DTO:** `ActualizarUsuarioDto { rol?: Rol, estado?: 'A' | 'I' }`
    - **Lógica:** Actualiza datos específicos de un `Usuario`. No debe permitir cambiar la contraseña aquí.
    - **Respuesta:** El objeto `Usuario` actualizado.

- **`GET /admin/medicos`**:
    - **Lógica:** Devuelve la lista de `Medico`, filtrada por el `pais` del admin.
    - **Consulta:** `SELECT * FROM medicos JOIN usuarios ON ... WHERE usuarios.pais = :pais`.

- **`POST /admin/medicos`**:
    - **DTO:** `CrearMedicoDto { nombreCompleto, especialidad, tipoMedico, correo, telefono, carnet? }`
    - **Lógica:** Crea un nuevo `Medico`. Si es `INTERNO`, debe asociarse a un `Usuario` ya existente a través de su `carnet`.

### Módulo de Médicos (`/medico`) - Rol: `MEDICO`

- **`GET /medico/dashboard`**:
    - **Lógica:** Devuelve KPIs para el médico logueado (citas de hoy, seguimientos pendientes del médico, pacientes en rojo de su país).
    - **Consultas:** `SELECT COUNT(*) FROM citas_medicas WHERE id_medico = :idMedico AND fecha_cita = CURRENT_DATE`, etc.
    
- **`GET /medico/agenda-citas`**:
    - **Lógica:** Devuelve la lista de `CasoClinico` con `estado_caso = 'Abierto'` del `pais` del médico.
    - **Consulta:** `SELECT ... FROM casos_clinicos JOIN pacientes ON ... WHERE pacientes.pais = :pais AND estado_caso = 'Abierto'`.
    - **Respuesta:** Un array de objetos `CasoClinico` con la información del paciente anidada (`JOIN`).

- **`POST /medico/agenda-citas/agendar`**:
    - **DTO:** `AgendarCitaDto { idCaso: number, idMedico: number, fechaCita: string, horaCita: string }`
    - **Lógica (Transacción):**
        1. Crear una nueva `CitaMedica`.
        2. Actualizar el `CasoClinico` correspondiente: cambiar `estado_caso` a `'Agendado'` y asignar el `id_cita_principal` al nuevo `id_cita`.

- **`POST /medico/agenda-citas/cancelar`**:
    - **DTO:** `CancelarCasoDto { idCaso: number, motivo: string }`
    - **Lógica:** Cambiar `estado_caso` a `'Cancelado'`. Opcionalmente, registrar el motivo en una tabla de logs.

- **`GET /medico/casos/:id`**:
    - **Lógica:** Devuelve el detalle completo de un `CasoClinico`.
    - **Consulta:** `SELECT ... FROM casos_clinicos` con `LEFT JOIN` a `pacientes`, `atenciones_medicas`, `examenes_medicos`, `seguimientos_paciente`.
    - **Respuesta:** Objeto `CasoClinico` con arrays anidados de sus relaciones.

- **`POST /medico/atencion`**:
    - **DTO:** `CrearAtencionDto { idCita, idMedico, diagnosticoPrincipal, ... (todos los campos del formulario) }`
    - **Lógica (Transacción):**
        1. Crear un nuevo registro en `AtencionMedica`.
        2. Actualizar `CitaMedica` a `estado_cita = 'FINALIZADA'`.
        3. Actualizar `CasoClinico` a `estado_caso = 'Cerrado'`.
        4. Si `requiere_seguimiento` es `true`, crear un nuevo registro en `SeguimientoPaciente`.

### Módulo de Pacientes (`/paciente`) - Rol: `PACIENTE`

- **`GET /paciente/dashboard`**:
    - **Lógica:** Devuelve KPIs para el paciente logueado (obtenido del JWT).
    - **Consultas:** `SELECT nivel_semaforo FROM pacientes WHERE id_paciente = :id`, `SELECT ... FROM citas_medicas WHERE id_paciente = :id AND fecha_cita >= CURRENT_DATE ORDER BY fecha_cita ASC LIMIT 1`, etc.

- **`POST /paciente/solicitar-cita`**:
    - **DTO:** `SolicitudCitaDto { ... (payload completo del wizard) }`
    - **Lógica (Transacción):**
        1. Crear un registro en `ChequeoBienestar` con los `datos_completos` en el campo JSONB.
        2. **Si `ruta` es `'consulta'`:** Crear un `CasoClinico` con `estado_caso = 'Abierto'`. El `motivo_consulta` se puede generar a partir de los síntomas seleccionados. El `nivel_semaforo` se calcula basado en la criticidad de los síntomas.

- **`GET /paciente/mis-citas`**:
    - **Lógica:** Devuelve el historial de `CitaMedica` del paciente logueado.
    - **Consulta:** `SELECT * FROM citas_medicas JOIN medicos ON ... WHERE id_paciente = :idPaciente ORDER BY fecha_cita DESC`.

- **`GET /paciente/historial-chequeos`**:
    - **Lógica:** Devuelve el historial de `ChequeoBienestar` del paciente logueado.
    - **Consulta:** `SELECT id_chequeo, fecha_registro, nivel_semaforo, datos_completos->>'estadoAnimo' as estadoAnimo FROM chequeos_bienestar WHERE id_paciente = :idPaciente`.
    
---
Este documento proporciona una base sólida y detallada para la construcción del backend. El uso de transacciones es clave en las operaciones que modifican múltiples tablas para garantizar la integridad de los datos.