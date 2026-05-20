# Portal Clinica - Arquitectura y mapa tecnico

Fecha: 2026-05-20  
Ruta base: `/opt/apps/medico-portal`

## Vista general

```text
/opt/apps/medico-portal
├── web/                     Frontend web activo, Vite + React
├── clinica/
│   ├── api-nest/            Backend API NestJS
│   ├── mobile_app/          App Flutter alineada a Clinica
│   ├── scripts/             Script de despliegue
│   ├── docs/                Documentacion operativa
│   └── web/                 Fragmento web incompleto, no app buildable
├── movil/                   App Flutter alterna, no confirmada como Clinica
├── legacy_reference_*.cs*   Referencia legacy .NET/Razor
└── .git/
```

## Backend API

Ruta: `clinica/api-nest`

Stack:

- NestJS 11.
- Fastify.
- Swagger.
- JWT.
- SQL Server via `mssql`.
- Stored procedures como contrato principal.

Entry points:

- `src/main.ts`: bootstrap, Fastify, CORS, Swagger, prefix global `/api`.
- `src/app.module.ts`: modulo raiz.
- `src/database/db.service.ts`: pool SQL Server y metodos `execute`, `executeOne`, `executeNonQuery`, `query`.

Modulos:

- `auth`
- `admin`
- `medico`
- `paciente`
- `seguimiento`
- `common/notification`
- `database`

Prefijo global:

```text
/api
```

URL publica esperada por el script de despliegue:

```text
https://rhclaroni.com/api-portal-clinica/api
```

## Backend rutas principales

Auth:

- `POST /api/auth/portal-session`
- `POST /api/auth/login`
- `POST /api/auth/seed`
- `GET /api/auth/profile`
- `POST /api/auth/reset-password`
- `POST /api/auth/sso-login`
- `POST /api/auth/sso-sync-user`

Admin:

- `GET /api/admin/dashboard`
- `POST /api/admin/usuarios`
- `GET /api/admin/usuarios`
- `PATCH /api/admin/usuarios/:id`
- `GET /api/admin/medicos`
- `POST /api/admin/medicos`
- `GET /api/admin/empleados`
- `GET /api/admin/roles-permisos`
- `GET /api/admin/reportes/atenciones`

Medico:

- `GET /api/medico/dashboard`
- `GET /api/medico/agenda-citas`
- `POST /api/medico/agenda-citas/agendar`
- `POST /api/medico/atencion`
- `GET /api/medico/pacientes`
- `GET /api/medico/pacientes/:id/chequeos`
- `GET /api/medico/pacientes/:id/citas`
- `GET /api/medico/pacientes/:id/examenes`
- `GET /api/medico/pacientes/:id/vacunas`
- `GET /api/medico/casos`
- `GET /api/medico/casos/:id`
- `PATCH /api/medico/casos/:id`
- `GET /api/medico/citas/:id`
- `GET /api/medico/examenes`
- `PATCH /api/medico/examenes/:id`
- `GET /api/medico/seguimientos`
- `PATCH /api/medico/seguimientos/:id`
- `GET /api/medico/citas`
- `POST /api/medico/vacunas`
- `POST /api/medico/casos`
- `GET /api/medico/reporte-atencion/:idAtencion`
- `GET /api/medico/reporte-paciente/:idPaciente`
- `GET /api/medico/psicosocial`
- `POST /api/medico/psicosocial`

Paciente:

- `GET /api/paciente/dashboard`
- `POST /api/paciente/solicitar-cita`
- `GET /api/paciente/mis-citas`
- `GET /api/paciente/mis-chequeos`
- `GET /api/paciente/mis-examenes`
- `GET /api/paciente/mis-vacunas`
- `POST /api/paciente/chequeo`

Seguimientos:

- `POST /api/seguimientos`
- `GET /api/seguimientos`
- `GET /api/seguimientos/:id`
- `PUT /api/seguimientos/:id`
- `DELETE /api/seguimientos/:id`

## Frontend web

Ruta: `web`

Stack:

- Vite 6.
- React 18.
- TypeScript 5.
- React Router.
- Axios.
- Tailwind.
- Radix UI.

Entry points:

- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/lib/runtime.ts`
- `src/lib/api.ts`
- `src/lib/context/AuthContext.tsx`

Variables clave:

- `VITE_BASE_PATH`
- `VITE_API_URL`
- `VITE_PORTAL_URL`

El script de despliegue usa:

```bash
VITE_BASE_PATH=/portal/clinica/
VITE_API_URL=https://rhclaroni.com/api-portal-clinica/api
VITE_PORTAL_URL=https://rhclaroni.com/portal
```

Rutas web principales:

- `/login`
- `/admin/dashboard`
- `/medico/dashboard`
- `/medico/agenda-citas`
- `/medico/campanas`
- `/medico/historial`
- `/medico/pacientes`
- `/medico/atencion/:idCita`
- `/paciente/dashboard`
- `/paciente/resultados`
- `/paciente/historial`
- `/paciente/telemedicina`

Proteccion:

- `ProtectedRoute` protege por rol.
- `AuthContext` guarda `token` y `user` en localStorage.
- `api.ts` agrega `Authorization: Bearer`.
- `401` limpia token y redirige a `appPath('/login')`.

## Base de datos

Scripts principales:

- `clinica/api-nest/scripts/01_create_tables.sql`
- `clinica/api-nest/scripts/02_create_procedures.sql`
- `clinica/api-nest/scripts/03_create_indexes.sql`
- `clinica/api-nest/scripts/run_migrations.js`
- `clinica/api-nest/scripts/create_first_admin.js`

## Movil

App candidata oficial:

```text
clinica/mobile_app
```

Motivo: `lib/core/constants.dart` declara `apiBaseUrl` con default `https://rhclaroni.com/api-portal-clinica/api`.

App alterna:

```text
movil
```

Riesgo: apunta a `https://rhclaroni.com/api-portal-planer-rust` y tiene token tecnico por default.

Decision recomendada: mantener `clinica/mobile_app` como app movil Clinica y marcar `movil` como fuera de alcance hasta confirmar su proposito.

## Despliegue

Script:

```text
clinica/scripts/iclinica.bash
```

PM2:

```text
portal-clinica-api
```

Frontend publico esperado:

```text
https://rhclaroni.com/portal/clinica/
```

API publica esperada:

```text
https://rhclaroni.com/api-portal-clinica/api
```

Backend local esperado por script:

```text
PORT=3022
```
