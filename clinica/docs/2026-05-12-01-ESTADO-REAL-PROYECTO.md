# Portal Clínica - Estado Real del Proyecto

Fecha de creación: 2026-05-12  
Base revisada: `/opt/apps/medico-portal`

## Resumen ejecutivo

El proyecto no está en cero. Ya existe backend NestJS, frontend Vite/React, scripts SQL, script de despliegue y dos bases de app móvil Flutter. El problema principal no es falta de código, sino inconsistencias entre documentación antigua, arquitectura real, build actual, prefijos de API y definición de qué app móvil es la oficial.

El backend está más maduro que el frontend. El backend compila y está levantado en PM2 como `portal-clinica-api`. El frontend no compila en el estado actual de `node_modules`. Además, `App.tsx` importa `LoginPage` indirectamente porque existe el componente, pero no tiene ruta `/login`; esto rompe el flujo cuando el interceptor de API redirige a `/login`.

## Arquitectura real detectada

| Pieza | Tecnología real | Ruta | Estado |
| --- | --- | --- | --- |
| Frontend web | Vite + React 18 + TypeScript | `/opt/apps/medico-portal/web` | Existe, no compila por dependencias faltantes |
| Backend API | NestJS 11 + Fastify + SQL Server `mssql` | `/opt/apps/medico-portal/clinica/api-nest` | Compila |
| Base de datos | SQL Server + stored procedures | scripts en `api-nest/scripts` | Scripts existen, requiere validación completa contra servidor |
| Móvil A | Flutter `clinica_app` | `/opt/apps/medico-portal/clinica/mobile_app` | Más alineado a clínica, no validado |
| Móvil B | Flutter `clinica_movil` | `/opt/apps/medico-portal/movil` | Parece base alterna/integración, no validado |
| Despliegue | Bash + PM2 + Nginx | `/opt/apps/medico-portal/clinica/scripts/iclinica.bash` | Existe y contiene configuración productiva |

## Validaciones ejecutadas

### Backend

Comando:

```bash
cd /opt/apps/medico-portal/clinica/api-nest
npm run build
```

Resultado observado:

- Build exitoso.
- No se validaron tests automatizados en esta revisión.

### Frontend

Comando:

```bash
cd /opt/apps/medico-portal/web
npm run build
```

Resultado observado:

- Falló por dependencias no resueltas:
  - `react-day-picker`
  - `embla-carousel-react`
- `package.json` las declara, pero `npm ls react-day-picker embla-carousel-react` mostró árbol vacío.

Interpretación:

- Probablemente se requiere `npm ci` o reinstalar dependencias.
- Si después de instalar persiste, revisar versiones y tipos de TypeScript.

### Móvil

Comando:

```bash
command -v flutter
```

Resultado observado:

- `flutter` no está instalado en esta máquina.

Interpretación:

- No se puede declarar build móvil correcto desde este servidor.
- La IA ejecutora debe validar en una máquina con Flutter SDK o instalarlo con aprobación operativa.

### PM2

Comando:

```bash
pm2 status
```

Resultado observado:

- `portal-clinica-api` está online.
- Puerto esperado por script: `3022`.

### Curl local HTTPS

Intentos contra `https://127.0.0.1` con Host `rhclaroni.com` devolvieron conexión rechazada en sandbox. No se debe concluir que producción esté caída solo por esa prueba. Validar desde shell con permisos adecuados o desde el navegador/host real.

## Documentación antigua vs realidad

### Desfase 1: Next.js vs Vite

`PLAN_TRABAJO_COMPLETO.md` habla de Next.js 15. El frontend real en `/web` usa Vite. No implementar nuevas pantallas como Next.js salvo que se decida una migración completa, lo cual no está justificado por el estado actual.

### Desfase 2: Firebase/mock vs API real

`Migration_Plan_Firebase_to_API.txt` y `docs/blueprint.md` describen un camino desde prototipo con login falso/Firebase. Hoy ya existe backend NestJS con SQL Server. La tarea no es diseñar desde cero, sino estabilizar lo existente.

### Desfase 3: PostgreSQL mencionado en migración

Alguna documentación histórica menciona PostgreSQL. El backend real usa SQL Server mediante `mssql`, stored procedures y variables `MSSQL_*`.

### Desfase 4: Checklist previo demasiado optimista

`PLAN_DETALLADO_CHECKLIST.md` marca frontend como 100%, pero el build actual falla. Tratar ese checklist como histórico, no como estado operativo.

## Backend real

### Entrada principal

Archivo: `/opt/apps/medico-portal/clinica/api-nest/src/main.ts`

Características:

- Usa `NestFastifyApplication`.
- Registra cookies con `COOKIE_SECRET`.
- Usa Swagger en `/docs`.
- Usa `ValidationPipe` global con `whitelist: true`.
- Usa `GlobalErrorFilter`.
- Usa prefijo global `api`.
- Escucha `PORT`, `API_PORT` o `3001`.
- En producción, script usa `PORT=3022`.

### Módulos

Archivo: `/opt/apps/medico-portal/clinica/api-nest/src/app.module.ts`

Módulos reales:

- `DatabaseModule`
- `AuthModule`
- `AdminModule`
- `MedicoModule`
- `PacienteModule`
- `SeguimientoModule`
- `NotificationModule`
- `ThrottlerModule`

### Autenticación

Rutas principales bajo prefijo global `/api`:

- `POST /api/auth/portal-session`
- `POST /api/auth/login`
- `POST /api/auth/seed`
- `GET /api/auth/profile`
- `POST /api/auth/reset-password`
- `POST /api/auth/sso-login`
- `POST /api/auth/sso-sync-user`

JWT:

- Estrategia lee Bearer token.
- Payload validado expone:
  - `idUsuario`
  - `carnet`
  - `rol`
  - `pais`
  - `idPaciente`
  - `idMedico`

Riesgo:

- `JWT_SECRET` tiene fallback `'secret'`. En producción debe ser obligatorio y fuerte.

### Roles

`RolesGuard` permite pasar si no hay metadata `@Roles`. Si hay roles requeridos, compara con `user.rol?.includes(role)`.

Riesgo:

- Usar `includes` puede permitir coincidencias parciales si en el futuro hay roles con nombres contenidos entre sí.
- Recomendación: cambiar a igualdad estricta o normalizar arreglo de roles.

### Seguimientos

`SeguimientoController` usa `JwtAuthGuard` y `RolesGuard`, pero no declara `@Roles`. Con el guard actual, cualquier usuario autenticado pasa. Eso puede ser intencional o no. Debe decidirse y documentarse.

## Frontend real

### Runtime

Archivo: `/opt/apps/medico-portal/web/src/lib/runtime.ts`

Variables:

- `VITE_BASE_PATH` o `/`
- `VITE_API_URL` o `/api`
- `VITE_PORTAL_URL` o `http://localhost:5173`

Script de despliegue define:

- `VITE_APP_BASE=/portal/clinica/`
- `VITE_BASE_PATH=/portal/clinica/`
- `VITE_API_URL=https://rhclaroni.com/api-portal-clinica`
- `VITE_PORTAL_API_URL=https://rhclaroni.com/api-portal`
- `VITE_PORTAL_URL=https://rhclaroni.com/portal`
- `VITE_PUBLIC_URL=https://rhclaroni.com`

### API client

Archivo: `/opt/apps/medico-portal/web/src/lib/api.ts`

Comportamiento:

- Usa `API_BASE` como baseURL.
- Agrega Bearer token desde `localStorage.token`.
- En 401 elimina `token` y `user`.
- Redirige a `appPath('/login')`.

Bloqueo real:

- `App.tsx` no define ruta `/login`. Existe `components/auth/LoginPage.tsx`, pero no está montada.

### AuthContext

Archivo: `/opt/apps/medico-portal/web/src/lib/context/AuthContext.tsx`

Comportamiento:

- Primero intenta hidratar sesión desde `localStorage`.
- Si no hay sesión local, intenta `POST {VITE_API_URL}/auth/portal-session` con cookies.
- Login usa `api.post('/auth/login', { carnet, password })`.
- Espera respuesta `{ access_token, user }`.
- Redirige por rol:
  - `ADMIN` -> `/admin/dashboard`
  - `MEDICO` -> `/medico/agenda-citas`
  - `PACIENTE` -> `/paciente/dashboard`

Riesgo:

- Si `VITE_API_URL` no incluye `/api` y Nginx no agrega `/api`, las llamadas quedan contra `/auth/login` cuando backend real está bajo `/api/auth/login`.

### Rutas actuales

Archivo: `/opt/apps/medico-portal/web/src/App.tsx`

Rutas actuales:

- `/` redirige a `/medico/agenda-citas`.
- `/admin/dashboard` usa `AdminDashboard`.
- `/medico/dashboard` usa `AdminDashboard` como placeholder.
- `/medico/agenda-citas` usa `AgendaCitas`.
- `/medico/campanas` usa `GestionCampanasVite`.
- `/medico/historial` usa `HistorialPaciente`.
- `/medico/pacientes` reutiliza `HistorialPaciente`.
- `/medico/atencion/:idCita` usa `AtencionCitaWizard`.
- `/paciente/dashboard` usa `PacienteDashboard`.
- `/paciente/resultados` reutiliza `PacienteDashboard`.
- `/paciente/historial` usa `HistorialPaciente`, que es componente médico.
- `/paciente/telemedicina` usa `Telemedicina`.

Bloqueos funcionales:

- Falta ruta `/login`.
- `ProtectedRoute` existe pero no se usa en `App.tsx`.
- Varias rutas usan placeholders o componentes de otro rol.
- No hay protección real por rol en frontend.

## API pública y prefijo

Backend:

- `app.setGlobalPrefix('api')`
- Login real interno: `/api/auth/login`

Script Nginx:

- Expone `/api-portal-clinica/` y hace proxy a `http://127.0.0.1:3022/`.

Frontend:

- `VITE_API_URL=https://rhclaroni.com/api-portal-clinica`
- Login frontend: `/auth/login`
- URL resultante: `https://rhclaroni.com/api-portal-clinica/auth/login`

Riesgo crítico:

- Si Nginx remueve `/api-portal-clinica/` y manda `/auth/login` al backend, NestJS espera `/api/auth/login`; devolverá 404.
- Si actualmente funciona, puede ser porque hay una regla Nginx distinta a la del script, un build distinto o un backend diferente.

Correcciones posibles:

1. Cambiar frontend a:

```bash
VITE_API_URL=https://rhclaroni.com/api-portal-clinica/api
```

2. O cambiar Nginx para que `/api-portal-clinica/` proxyee hacia `http://127.0.0.1:3022/api/`.

Escoger una sola estrategia y documentarla. La opción 1 es menos invasiva si Swagger `/api-portal-clinica/docs` ya se usa como healthcheck.

## Base de datos

Scripts:

- `/opt/apps/medico-portal/clinica/api-nest/scripts/01_create_tables.sql`
- `/opt/apps/medico-portal/clinica/api-nest/scripts/02_create_procedures.sql`

Tablas principales detectadas:

- `roles`
- `permisos`
- `roles_permisos`
- `pacientes`
- `medicos`
- `usuarios`
- `empleados`
- `casos_clinicos`
- `citas_medicas`
- `atenciones_medicas`
- `chequeos_bienestar`
- `seguimientos`
- `examenes_medicos`
- `vacunas_aplicadas`
- `registros_psicosociales`

Observación de datos previa:

- Existen roles `ADMIN`, `MEDICO`, `PACIENTE`, `RRHH`.
- Existe usuario Gustavo con `id_rol=1`, `estado=ACTIVO`, `pais=NI`, `password_hash=PORTAL_LOGIN_ONLY`.

Riesgo:

- `PORTAL_LOGIN_ONLY` sugiere usuario sincronizado desde portal, no necesariamente login local con password.
- Para pruebas locales se debe usar usuario seed o flujo SSO/portal-session, no asumir contraseña.

## Móvil

### `clinica/mobile_app`

Más alineada a clínica:

- `login_screen`
- pantallas admin
- pantallas médico
- pantallas paciente
- servicios por rol

Problema:

- `apiBaseUrl` apunta a `http://10.0.2.2:3000`, no al backend productivo.

### `/movil`

Parece base alterna con config más avanzada, pero está apuntando por defecto a:

```dart
https://rhclaroni.com/api-portal-planer-rust
```

También contiene un token técnico hardcodeado:

```dart
defaultValue: '34549d2a54ed17eb5d3841d313e9e28ef713099de442bd48'
```

Riesgo:

- No debe quedar un token técnico hardcodeado en una app móvil distribuible.
- Debe decidirse si `/movil` pertenece a clínica o a otro portal.

Recomendación:

- Tomar `/opt/apps/medico-portal/clinica/mobile_app` como candidato canónico de clínica.
- Dejar `/opt/apps/medico-portal/movil` como experimental hasta confirmar.

## Bloqueos prioritarios

1. Frontend no compila por dependencias faltantes.
2. Falta ruta `/login` en `App.tsx`.
3. `ProtectedRoute` no se usa.
4. Riesgo de prefijo API público vs `/api` interno.
5. Rutas de médico/paciente usan placeholders.
6. Dos apps móviles sin decisión canónica.
7. Flutter no instalado para validar móvil.
8. Documentación histórica contradice arquitectura actual.
9. Secretos y configuración están concentrados en script de despliegue; se debe migrar a `.env`/PM2 ecosystem o al menos documentar.

## Qué no se debe hacer

- No migrar a Next.js solo porque un documento antiguo lo menciona.
- No volver a Firebase.
- No cambiar a PostgreSQL.
- No borrar una de las apps móviles sin decisión explícita.
- No tocar Nginx sin respaldo de configuración.
- No ejecutar scripts SQL completos contra producción sin backup y revisión de impacto.
