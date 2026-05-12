# Portal Clínica - Contratos API, BD, Frontend y Móvil

Fecha de creación: 2026-05-12  
Objetivo: documentar los contratos reales que debe respetar cualquier implementación.

## Convenciones

### Base URL

Backend NestJS tiene prefijo global:

```ts
app.setGlobalPrefix('api')
```

Por lo tanto, las rutas internas reales empiezan con `/api`.

En producción se debe decidir una de estas bases:

```text
https://rhclaroni.com/api-portal-clinica/api
```

o:

```text
https://rhclaroni.com/api-portal-clinica
```

La segunda solo es válida si Nginx agrega `/api` al proxy. No asumir.

### Autenticación

La API espera:

```http
Authorization: Bearer <access_token>
```

Frontend guarda:

- `localStorage.token`
- `localStorage.user`

El objeto `user` esperado por frontend:

```ts
interface User {
  id_usuario: number;
  carnet: string;
  nombre_completo: string;
  correo: string;
  rol: 'PACIENTE' | 'MEDICO' | 'ADMIN';
  pais: string;
  estado: string;
  idPaciente?: number;
  idMedico?: number;
}
```

## Contrato Auth

### `POST /api/auth/login`

Uso:

- Login local por carnet/password.

Request esperado por frontend:

```json
{
  "carnet": "123456",
  "password": "********"
}
```

Response esperado por frontend:

```json
{
  "access_token": "jwt",
  "user": {
    "id_usuario": 1,
    "carnet": "123456",
    "nombre_completo": "Nombre",
    "correo": "usuario@claro.com.ni",
    "rol": "MEDICO",
    "pais": "NI",
    "estado": "ACTIVO",
    "idPaciente": null,
    "idMedico": 10
  }
}
```

Stored procedures relacionados:

- `sp_Login`
- `sp_UpdateUltimoAcceso`

### `POST /api/auth/portal-session`

Uso:

- Intentar sesión desde portal corporativo por cookie.

Frontend actual:

- Lo llama con `credentials: 'include'`.
- Espera `access_token` y `user`.

Riesgo:

- Si no hay cookie válida, debe responder 401 controlado, no romper bootstrap.

### `GET /api/auth/profile`

Uso:

- Obtener perfil con token.

Headers:

```http
Authorization: Bearer <access_token>
```

Stored procedure:

- `sp_Auth_GetProfile`

## Contrato Admin

Todas las rutas requieren JWT y rol `ADMIN`.

| Método | Ruta interna | Propósito |
| --- | --- | --- |
| GET | `/api/admin/dashboard` | KPIs admin |
| POST | `/api/admin/usuarios` | Crear usuario |
| GET | `/api/admin/usuarios` | Listar usuarios |
| PATCH | `/api/admin/usuarios/:id` | Actualizar usuario |
| GET | `/api/admin/medicos` | Listar médicos |
| POST | `/api/admin/medicos` | Crear médico |
| GET | `/api/admin/empleados?carnet=` | Buscar empleados |
| GET | `/api/admin/roles-permisos` | Roles y permisos |
| GET | `/api/admin/reportes/atenciones` | Reporte atenciones |

Stored procedures:

- `sp_Admin_GetDashboard`
- `sp_Admin_GetUsuarios`
- `sp_Admin_CrearUsuario`
- `sp_Admin_UpdateUsuario`
- `sp_Admin_GetMedicos`
- `sp_Admin_CrearMedico`
- `sp_Admin_GetEmpleados`
- `sp_Admin_GetReportesAtenciones`
- `sp_Admin_GetRolesPermisos`

Campos mínimos para usuario:

```ts
interface Usuario {
  id_usuario: number;
  carnet: string;
  nombre_completo: string;
  correo: string;
  rol: string;
  pais: string;
  estado: string;
  id_paciente?: number | null;
  id_medico?: number | null;
}
```

## Contrato Médico

Todas las rutas requieren JWT y rol `MEDICO`, salvo que se decida permitir `ADMIN`.

| Método | Ruta interna | Propósito |
| --- | --- | --- |
| GET | `/api/medico/dashboard` | KPIs médico |
| GET | `/api/medico/agenda-citas` | Agenda por fecha/estado |
| POST | `/api/medico/agenda-citas/agendar` | Crear cita |
| POST | `/api/medico/atencion` | Registrar atención |
| GET | `/api/medico/pacientes` | Listar pacientes |
| GET | `/api/medico/pacientes/:id/chequeos` | Chequeos por paciente |
| GET | `/api/medico/pacientes/:id/citas` | Citas por paciente |
| GET | `/api/medico/pacientes/:id/examenes` | Exámenes por paciente |
| GET | `/api/medico/pacientes/:id/vacunas` | Vacunas por paciente |
| GET | `/api/medico/casos` | Casos clínicos |
| GET | `/api/medico/casos/:id` | Caso por ID |
| PATCH | `/api/medico/casos/:id` | Actualizar caso |
| GET | `/api/medico/citas/:id` | Cita por ID |
| GET | `/api/medico/examenes` | Exámenes pendientes |
| PATCH | `/api/medico/examenes/:id` | Actualizar examen |
| GET | `/api/medico/seguimientos` | Seguimientos |
| PATCH | `/api/medico/seguimientos/:id` | Actualizar seguimiento |
| GET | `/api/medico/citas` | Citas del médico |
| POST | `/api/medico/vacunas` | Registrar vacuna |
| POST | `/api/medico/casos` | Crear caso |
| GET | `/api/medico/reporte-atencion/:idAtencion` | Reporte PDF/datos atención |
| GET | `/api/medico/reporte-paciente/:idPaciente` | Reporte paciente |
| GET | `/api/medico/psicosocial` | Registros psicosociales |
| POST | `/api/medico/psicosocial` | Crear registro psicosocial |

Stored procedures:

- `sp_Medico_GetPacientes`
- `sp_Medico_GetChequeosPorPaciente`
- `sp_Medico_GetCitasPorPaciente`
- `sp_Medico_GetExamenesPorPaciente`
- `sp_Medico_GetVacunasPorPaciente`
- `sp_Medico_GetCitasHoy`
- `sp_Medico_GetPacientesRojo`
- `sp_Medico_CountCasosAbiertos`
- `sp_Medico_GetAgendaCitas`
- `sp_Medico_GetCasosClinicos`
- `sp_Medico_GetCasoById`
- `sp_Medico_UpdateCaso`
- `sp_Medico_GetCitaById`
- `sp_Medico_AgendarCita`
- `sp_Medico_CrearAtencion`
- `sp_Medico_GetExamenes`
- `sp_Medico_UpdateExamen`
- `sp_Medico_GetSeguimientos`
- `sp_Medico_UpdateSeguimiento`
- `sp_Medico_GetCitasPorMedico`
- `sp_Medico_RegistrarVacuna`
- `sp_Medico_CrearCaso`
- `sp_Medico_GetReporteAtencion`
- `sp_Medico_GetReportePaciente`
- `sp_Medico_GetRegistrosPsicosociales`
- `sp_Medico_CrearRegistroPsicosocial`

Campos mínimos de cita:

```ts
interface CitaMedica {
  id_cita: number;
  id_paciente: number;
  id_medico?: number;
  fecha_hora: string;
  motivo: string;
  estado: string;
  tipo?: string;
  nombre_paciente?: string;
  carnet?: string;
  semaforo?: 'VERDE' | 'AMARILLO' | 'ROJO';
}
```

Campos mínimos de paciente:

```ts
interface Paciente {
  id_paciente: number;
  carnet: string;
  nombre_completo: string;
  correo?: string;
  pais?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: string;
  semaforo?: 'VERDE' | 'AMARILLO' | 'ROJO';
}
```

## Contrato Paciente

Todas las rutas requieren JWT y rol `PACIENTE`.

| Método | Ruta interna | Propósito |
| --- | --- | --- |
| GET | `/api/paciente/dashboard` | Dashboard del paciente |
| POST | `/api/paciente/solicitar-cita` | Solicitar cita |
| GET | `/api/paciente/mis-citas` | Citas del paciente |
| GET | `/api/paciente/mis-chequeos` | Chequeos del paciente |
| GET | `/api/paciente/mis-examenes` | Exámenes del paciente |
| GET | `/api/paciente/mis-vacunas` | Vacunas del paciente |
| POST | `/api/paciente/chequeo` | Crear chequeo bienestar |

Stored procedures:

- `sp_Paciente_GetDashboard`
- `sp_Paciente_GetTimeline`
- `sp_Paciente_SolicitarCita`
- `sp_Paciente_GetMisCitas`
- `sp_Paciente_GetMisChequeos`
- `sp_Paciente_GetMisExamenes`
- `sp_Paciente_GetMisVacunas`
- `sp_Paciente_CrearChequeo`

Chequeo bienestar mínimo:

```ts
interface ChequeoBienestar {
  id_chequeo: number;
  id_paciente: number;
  fecha: string;
  estado_animo?: string;
  nivel_estres?: number;
  horas_sueno?: number;
  sintomas?: string;
  observaciones?: string;
  semaforo?: 'VERDE' | 'AMARILLO' | 'ROJO';
}
```

## Contrato Seguimientos

Ruta base:

```text
/api/seguimientos
```

Estado actual:

- Requiere JWT.
- Usa `RolesGuard`.
- No tiene `@Roles`, entonces cualquier usuario autenticado pasa.

Decisión requerida:

- Si los seguimientos son médicos: agregar `@Roles('MEDICO', 'ADMIN')`.
- Si los pacientes pueden ver sus seguimientos: separar endpoints por rol o filtrar por `idPaciente`.

Stored procedures:

- `sp_Seguimiento_Crear`
- `sp_Seguimiento_GetAll`
- `sp_Seguimiento_GetById`
- `sp_Seguimiento_Update`
- `sp_Seguimiento_Delete`

## Contrato de errores

Definir una forma única. Recomendación:

```json
{
  "success": false,
  "statusCode": 401,
  "errorCode": "UNAUTHORIZED",
  "message": "Unauthorized",
  "timestamp": "2026-05-12T00:00:00.000Z",
  "path": "/api/auth/profile"
}
```

Frontend debe tratar:

- `401`: limpiar sesión y redirigir a `/login`.
- `403`: mostrar sin permisos, no cerrar sesión.
- `404`: error de ruta o recurso.
- `409`: conflicto de negocio.
- `500`: error servidor con mensaje genérico.

## Contrato Nginx recomendado

Si se usa `VITE_API_URL=https://rhclaroni.com/api-portal-clinica/api`, Nginx puede mantener:

```nginx
location /api-portal-clinica/ {
  proxy_pass http://127.0.0.1:3022/;
}
```

Entonces:

- `/api-portal-clinica/api/auth/login` -> backend `/api/auth/login`
- `/api-portal-clinica/docs` -> backend `/docs`

Esta opción conserva Swagger y respeta prefijo Nest.

## Contrato móvil

La app móvil oficial debe apuntar a la misma API base que frontend:

```text
https://rhclaroni.com/api-portal-clinica/api
```

No usar:

```text
http://10.0.2.2:3000
```

en producción.

No usar:

```text
https://rhclaroni.com/api-portal-planer-rust
```

para clínica salvo que se confirme una integración específica.

No incluir tokens técnicos hardcodeados en APK/IPA.
