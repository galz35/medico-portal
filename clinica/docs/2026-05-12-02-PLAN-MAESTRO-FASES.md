# Portal Clínica - Plan Maestro por Fases

Fecha de creación: 2026-05-12  
Objetivo: completar y estabilizar el portal clínica por fases, desde baseline hasta despliegue validado.

## Fase 0 - Baseline, respaldo y control de daño

### Propósito

Congelar el estado real antes de tocar código. Esta fase evita que una IA rápida modifique archivos sin entender el impacto.

### Archivos/rutas

- `/opt/apps/medico-portal`
- `/opt/apps/medico-portal/web`
- `/opt/apps/medico-portal/clinica/api-nest`
- `/opt/apps/medico-portal/clinica/mobile_app`
- `/opt/apps/medico-portal/movil`
- `/opt/apps/medico-portal/clinica/scripts/iclinica.bash`

### Pasos

1. Registrar estado Git:

```bash
cd /opt/apps/medico-portal
git status --short
git branch --show-current
git log -1 --oneline
```

2. Registrar procesos:

```bash
pm2 status
pm2 describe portal-clinica-api
```

3. Registrar builds:

```bash
cd /opt/apps/medico-portal/clinica/api-nest
npm run build

cd /opt/apps/medico-portal/web
npm run build
```

4. Registrar dependencias:

```bash
cd /opt/apps/medico-portal/web
npm ls react-day-picker embla-carousel-react

cd /opt/apps/medico-portal/clinica/api-nest
npm ls mssql @nestjs/core @nestjs/platform-fastify
```

5. Revisar si Flutter existe:

```bash
command -v flutter
```

### Criterios de aceptación

- Hay una nota clara con comandos ejecutados y resultado.
- Se sabe si hay cambios no committeados.
- Se confirma que backend compila.
- Se confirma que frontend falla o compila después de instalar dependencias.
- No se hizo ningún cambio funcional todavía.

## Fase 1 - Corregir build web y ruta de login

### Propósito

Lograr que el frontend compile y que el flujo básico de login exista.

### Archivos

- `/opt/apps/medico-portal/web/package.json`
- `/opt/apps/medico-portal/web/package-lock.json`
- `/opt/apps/medico-portal/web/src/App.tsx`
- `/opt/apps/medico-portal/web/src/components/auth/LoginPage.tsx`
- `/opt/apps/medico-portal/web/src/components/auth/ProtectedRoute.tsx`
- `/opt/apps/medico-portal/web/src/lib/api.ts`
- `/opt/apps/medico-portal/web/src/lib/context/AuthContext.tsx`

### Pasos

1. Instalar dependencias declaradas:

```bash
cd /opt/apps/medico-portal/web
npm ci
```

2. Ejecutar build:

```bash
npm run build
```

3. Si fallan `react-day-picker` o `embla-carousel-react`, verificar que existan en `package.json` y `package-lock.json`. Si no están realmente instaladas:

```bash
npm install react-day-picker embla-carousel-react
npm run build
```

4. Montar ruta `/login` en `App.tsx` usando `LoginPage`.

5. Usar `ProtectedRoute` en grupos de rutas:

- Admin: `allowedRoles={['ADMIN']}`
- Médico: `allowedRoles={['MEDICO', 'ADMIN']}` si admin puede supervisar; si no, solo `MEDICO`.
- Paciente: `allowedRoles={['PACIENTE']}`

6. Cambiar `/` para que redirija según sesión o a `/login`, no siempre a médico.

7. Validar manualmente:

- Sin token: `/portal/clinica/` debe llevar a login.
- Token inválido: interceptor limpia sesión y lleva a `/portal/clinica/login`.
- Login exitoso: redirige por rol.

### Criterios de aceptación

- `npm run build` pasa en `/web`.
- Existe ruta `/login`.
- Rutas quedan protegidas por rol.
- El fallback no oculta errores redirigiendo siempre a médico.
- No se rompe `basename` con `/portal/clinica/`.

## Fase 2 - Resolver prefijo API público

### Propósito

Eliminar la ambigüedad entre:

- API NestJS interna con prefijo `/api`.
- Ruta pública Nginx `/api-portal-clinica`.
- `VITE_API_URL`.

### Archivos

- `/opt/apps/medico-portal/web/src/lib/runtime.ts`
- `/opt/apps/medico-portal/clinica/scripts/iclinica.bash`
- Configuración Nginx real del host
- `/opt/apps/medico-portal/clinica/api-nest/src/main.ts`

### Diagnóstico requerido

Probar estas rutas:

```bash
curl -skI https://rhclaroni.com/api-portal-clinica/docs
curl -skI https://rhclaroni.com/api-portal-clinica/api/auth/profile
curl -skI https://rhclaroni.com/api-portal-clinica/auth/profile
```

Para login, usar un usuario de prueba controlado y no credenciales reales en documentación.

### Decisión técnica

Escoger una opción:

#### Opción A - Frontend incluye `/api`

Cambiar despliegue a:

```bash
VITE_API_URL=https://rhclaroni.com/api-portal-clinica/api
```

Ventaja:

- No obliga a mover Swagger `/docs`.
- Respeta backend tal como está.

#### Opción B - Nginx agrega `/api`

Configurar Nginx para que:

```nginx
location /api-portal-clinica/ {
  proxy_pass http://127.0.0.1:3022/api/;
}
```

Ventaja:

- Frontend queda con URL más limpia.

Riesgo:

- Puede romper `/api-portal-clinica/docs` si no se agrega una regla separada para Swagger.

### Criterios de aceptación

- `POST /auth/login` desde frontend llega a la ruta real de NestJS.
- `GET /auth/profile` con token válido responde correctamente.
- No hay 404 por prefijo.
- La decisión queda anotada en este documento o en un changelog.

## Fase 3 - Endurecer backend

### Propósito

Cerrar riesgos de seguridad, roles, DTOs y contratos.

### Archivos

- `api-nest/src/auth/*`
- `api-nest/src/admin/*`
- `api-nest/src/medico/*`
- `api-nest/src/paciente/*`
- `api-nest/src/seguimiento/*`
- `api-nest/src/database/*`

### Pasos

1. Hacer obligatorio `JWT_SECRET` en producción. No permitir fallback `'secret'`.

2. Revisar `RolesGuard`:

Actual:

```ts
requiredRoles.some((role) => user.rol?.includes(role))
```

Recomendado:

```ts
requiredRoles.includes(user.rol)
```

Si el usuario puede tener múltiples roles, normalizar a arreglo explícito.

3. Decidir roles de `/api/seguimientos`.

Opciones:

- `@Roles('MEDICO')`
- `@Roles('MEDICO', 'ADMIN')`
- `@Roles('PACIENTE', 'MEDICO', 'ADMIN')` con filtros por usuario

4. Validar DTOs:

- Login
- Crear usuario
- Crear médico
- Agendar cita
- Crear atención
- Crear chequeo
- Registrar vacuna
- Crear psicosocial
- Crear seguimiento

5. Normalizar respuestas:

Frontend espera objetos directos en algunos lugares y puede esperar arrays en otros. Definir si el backend responde:

```json
{ "success": true, "data": {} }
```

o datos directos. Elegir una estrategia y adaptar servicios.

6. Agregar tests mínimos:

- AuthService login exitoso/fallido.
- RolesGuard.
- DatabaseService mock de procedure call.
- MedicoService endpoints críticos.

### Criterios de aceptación

- `npm run build` backend pasa.
- Tests nuevos pasan.
- JWT sin secreto fuerte no arranca en producción.
- Roles no dependen de `includes`.
- Seguimientos tienen política explícita.

## Fase 4 - Base de datos y stored procedures

### Propósito

Confirmar que la base real soporta todos los endpoints requeridos.

### Archivos

- `api-nest/scripts/01_create_tables.sql`
- `api-nest/scripts/02_create_procedures.sql`
- Servicios backend que llaman stored procedures.

### Pasos

1. Sacar respaldo antes de cualquier cambio.

2. Verificar tablas:

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

3. Verificar stored procedures usados por código:

- Todo `sp_Auth_*`
- Todo `sp_Admin_*`
- Todo `sp_Medico_*`
- Todo `sp_Paciente_*`
- Todo `sp_Seguimiento_*`

4. Verificar semillas:

- Roles básicos.
- Permisos.
- Usuario admin de prueba.
- Médico de prueba.
- Paciente de prueba.
- Citas y chequeos de prueba.

5. Verificar compatibilidad de nombres:

- Backend usa snake_case.
- Frontend usa tipos snake_case con alias de compatibilidad.
- Documentos antiguos usan camelCase. No seguirlos.

### Criterios de aceptación

- Cada endpoint crítico tiene stored procedure existente.
- Cada procedure devuelve columnas que frontend espera.
- Hay datos mínimos para probar los tres roles.
- No hay scripts destructivos ejecutados sin respaldo.

## Fase 5 - Completar frontend por rol

### Propósito

Sustituir placeholders y conectar pantallas reales con servicios.

### Admin

Pantallas requeridas:

- Dashboard administrativo.
- Usuarios.
- Médicos.
- Empleados.
- Roles y permisos.
- Reportes de atenciones.

Endpoints:

- `/admin/dashboard`
- `/admin/usuarios`
- `/admin/medicos`
- `/admin/empleados`
- `/admin/roles-permisos`
- `/admin/reportes/atenciones`

### Médico

Pantallas requeridas:

- Dashboard médico real.
- Agenda de citas.
- Agendar cita.
- Atención médica por cita.
- Historial de paciente.
- Casos clínicos.
- Exámenes.
- Seguimientos.
- Vacunas.
- Psicosocial.
- Reporte de atención y reporte de paciente.

Endpoints:

- `/medico/dashboard`
- `/medico/agenda-citas`
- `/medico/agenda-citas/agendar`
- `/medico/atencion`
- `/medico/pacientes`
- `/medico/pacientes/:id/chequeos`
- `/medico/pacientes/:id/citas`
- `/medico/pacientes/:id/examenes`
- `/medico/pacientes/:id/vacunas`
- `/medico/casos`
- `/medico/citas`
- `/medico/examenes`
- `/medico/seguimientos`
- `/medico/vacunas`
- `/medico/psicosocial`

### Paciente

Pantallas requeridas:

- Dashboard paciente.
- Chequeo de bienestar.
- Solicitar cita.
- Mis citas.
- Mis chequeos.
- Mis exámenes.
- Mis vacunas.
- Historial/timeline.
- Telemedicina si está dentro de alcance.

Endpoints:

- `/paciente/dashboard`
- `/paciente/chequeo`
- `/paciente/solicitar-cita`
- `/paciente/mis-citas`
- `/paciente/mis-chequeos`
- `/paciente/mis-examenes`
- `/paciente/mis-vacunas`

### Criterios de aceptación

- No quedan comentarios "Reuse for demo" en rutas productivas.
- Cada ruta tiene componente propio o una reutilización justificada.
- Estados loading/error/empty están cubiertos.
- No hay datos mock donde exista API.
- `npm run build` pasa.

## Fase 6 - Móvil Flutter

### Propósito

Decidir app móvil oficial y conectarla al backend correcto.

### Decisión inicial recomendada

Usar `/opt/apps/medico-portal/clinica/mobile_app` como base oficial de clínica porque sus pantallas están organizadas por admin/médico/paciente.

### Pasos

1. Confirmar con el dueño del proyecto si `/movil` pertenece a clínica o a otro producto.

2. En `clinica/mobile_app`, cambiar base URL para permitir `--dart-define`:

```dart
static const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'https://rhclaroni.com/api-portal-clinica/api',
);
```

3. Quitar tokens técnicos hardcodeados de cualquier app móvil.

4. Validar:

```bash
cd /opt/apps/medico-portal/clinica/mobile_app
flutter pub get
flutter analyze
flutter test
flutter build apk --release --dart-define=API_BASE_URL=https://rhclaroni.com/api-portal-clinica/api
```

### Criterios de aceptación

- App móvil oficial definida.
- URL API configurable.
- No hay secretos hardcodeados.
- Build Android release generado.
- Login y navegación por rol funcionan.

## Fase 7 - Integración, seguridad y despliegue

### Propósito

Validar todo de punta a punta antes de declarar "solucionado".

### Pasos

1. Build backend:

```bash
cd /opt/apps/medico-portal/clinica/api-nest
npm run build
```

2. Build frontend:

```bash
cd /opt/apps/medico-portal/web
npm run build
```

3. Validar Nginx:

```bash
nginx -t
```

4. Desplegar:

```bash
cd /opt/apps/medico-portal/clinica
bash scripts/iclinica.bash update
```

5. Validar PM2:

```bash
pm2 status
pm2 logs portal-clinica-api --lines 100
```

6. Validar URLs públicas:

```bash
curl -skI https://rhclaroni.com/portal/clinica/
curl -skI https://rhclaroni.com/api-portal-clinica/docs
```

7. Validar flujo navegador:

- Login admin.
- Login médico.
- Login paciente.
- 401 limpia sesión.
- Redirecciones respetan `/portal/clinica/`.
- Crear/consultar cita.
- Crear atención.
- Paciente ve sus datos.

### Criterios de aceptación

- Sin errores 401 repetitivos después de login válido.
- Sin errores 404 por prefijo API.
- Sin warnings críticos de PWA/iconos si se mantiene manifest.
- Build reproducible.
- Rollback documentado.
