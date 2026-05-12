# Portal Clínica - Tareas Detalladas para IA Ejecutora

Fecha de creación: 2026-05-12  
Perfil objetivo: IA rápida de ejecución que necesita instrucciones explícitas, archivo por archivo y fase por fase.

## Modo de trabajo obligatorio

Para cada tarea:

1. Leer archivos indicados.
2. Ejecutar comando de validación inicial.
3. Hacer cambio mínimo.
4. Ejecutar comando de validación final.
5. Anotar resultado.
6. No avanzar si el cambio rompe una fase anterior.

## Tarea 1 - Reparar dependencias frontend

### Contexto

`npm run build` falla por:

- `react-day-picker`
- `embla-carousel-react`

`package.json` las declara, pero `node_modules` no las tiene.

### Archivos

- `/opt/apps/medico-portal/web/package.json`
- `/opt/apps/medico-portal/web/package-lock.json`
- `/opt/apps/medico-portal/web/src/components/ui/calendar.tsx`
- `/opt/apps/medico-portal/web/src/components/ui/carousel.tsx`

### Pasos

1. Ejecutar:

```bash
cd /opt/apps/medico-portal/web
npm ls react-day-picker embla-carousel-react
```

2. Instalar desde lockfile:

```bash
npm ci
```

3. Construir:

```bash
npm run build
```

4. Si sigue fallando por tipos, revisar importaciones en `calendar.tsx` y `carousel.tsx`.

5. Si falta realmente del lockfile:

```bash
npm install react-day-picker embla-carousel-react
npm run build
```

### Aceptación

- `npm run build` pasa.
- No se eliminan componentes UI sin revisar si se usan.

## Tarea 2 - Montar ruta login

### Contexto

Existe `LoginPage.tsx`, pero `App.tsx` no tiene `/login`. El interceptor redirige a `/login`, pero la app cae al fallback.

### Archivos

- `/opt/apps/medico-portal/web/src/App.tsx`
- `/opt/apps/medico-portal/web/src/components/auth/LoginPage.tsx`
- `/opt/apps/medico-portal/web/src/lib/api.ts`
- `/opt/apps/medico-portal/web/src/lib/runtime.ts`

### Pasos

1. Importar `LoginPage` en `App.tsx`.

2. Agregar ruta:

```tsx
<Route path="/login" element={<LoginPage />} />
```

3. Verificar que con `basename=/portal/clinica/`, la URL final sea:

```text
/portal/clinica/login
```

4. Ajustar navegación de logout y 401 si hace falta.

### Aceptación

- `/portal/clinica/login` renderiza login.
- 401 redirige a `/portal/clinica/login`.
- No hay loop de redirección.

## Tarea 3 - Proteger rutas por rol

### Contexto

`ProtectedRoute` existe, pero no se usa.

### Archivos

- `/opt/apps/medico-portal/web/src/App.tsx`
- `/opt/apps/medico-portal/web/src/components/auth/ProtectedRoute.tsx`
- `/opt/apps/medico-portal/web/src/lib/context/AuthContext.tsx`

### Pasos

1. Importar `ProtectedRoute`.

2. Envolver rutas admin:

```tsx
<ProtectedRoute allowedRoles={['ADMIN']}>
  <DashboardLayout>...</DashboardLayout>
</ProtectedRoute>
```

3. Envolver rutas médico:

```tsx
<ProtectedRoute allowedRoles={['MEDICO', 'ADMIN']}>
  <DashboardLayout>...</DashboardLayout>
</ProtectedRoute>
```

4. Envolver rutas paciente:

```tsx
<ProtectedRoute allowedRoles={['PACIENTE']}>
  <DashboardLayout>...</DashboardLayout>
</ProtectedRoute>
```

5. Revisar si admin debe entrar a médico. Si no, quitar `ADMIN`.

### Aceptación

- Usuario no autenticado va a login.
- Paciente no entra a médico.
- Médico no entra a admin.
- Admin entra a admin.

## Tarea 4 - Corregir prefijo API

### Contexto

Backend real usa `/api`. Frontend desplegado probablemente usa `https://rhclaroni.com/api-portal-clinica` sin `/api`.

### Archivos

- `/opt/apps/medico-portal/clinica/scripts/iclinica.bash`
- `/opt/apps/medico-portal/web/src/lib/runtime.ts`
- Config Nginx real

### Pasos recomendados

1. Escoger opción A: frontend incluye `/api`.

2. En `iclinica.bash`, cambiar:

```bash
VITE_API_URL=https://rhclaroni.com/api-portal-clinica
```

por:

```bash
VITE_API_URL=https://rhclaroni.com/api-portal-clinica/api
```

3. Validar que Swagger sigue en:

```text
https://rhclaroni.com/api-portal-clinica/docs
```

4. Validar login:

```text
https://rhclaroni.com/api-portal-clinica/api/auth/login
```

### Aceptación

- No hay 404 por `/auth/login`.
- Las llamadas frontend llegan a `/api/auth/*`.

## Tarea 5 - Sustituir placeholders de rutas

### Contexto

`App.tsx` usa componentes temporales:

- `/medico/dashboard` usa `AdminDashboard`.
- `/medico/pacientes` usa `HistorialPaciente` con comentario demo.
- `/paciente/resultados` usa `PacienteDashboard`.
- `/paciente/historial` usa componente médico.

### Archivos

- `/opt/apps/medico-portal/web/src/App.tsx`
- `/opt/apps/medico-portal/web/src/components/medico/*`
- `/opt/apps/medico-portal/web/src/components/paciente/*`

### Pasos

1. Crear `MedicoDashboard.tsx` si no existe.

2. Crear `PacientesPage.tsx` o usar `HistorialPaciente` solo si está adaptado a listado médico.

3. Crear `PacienteHistorial.tsx`.

4. Crear `PacienteResultados.tsx` o definir si resultados se cubre con exámenes.

5. Quitar comentarios `Reuse for demo`.

### Aceptación

- Cada ruta principal tiene componente con nombre coherente.
- No se reutiliza dashboard de admin para médico.
- No se usa componente médico dentro de navegación paciente salvo que sea un componente shared real.

## Tarea 6 - Normalizar servicios frontend

### Contexto

Los servicios ya existen, pero hay que verificar que cada llamada coincida con rutas backend y respuesta.

### Archivos

- `/opt/apps/medico-portal/web/src/lib/services/medico.service.ts`
- `/opt/apps/medico-portal/web/src/lib/services/paciente.service.ts`
- `/opt/apps/medico-portal/web/src/lib/types/domain.ts`
- Controllers backend en `api-nest/src`

### Pasos

1. Hacer tabla ruta frontend -> ruta backend.

2. Para cada método:

- Confirmar método HTTP.
- Confirmar path.
- Confirmar query/body.
- Confirmar shape de respuesta.

3. Si backend devuelve `{ data }`, adaptar servicio.

4. Si backend devuelve array directo, documentarlo.

### Aceptación

- No hay llamadas a endpoints inexistentes.
- Los tipos TypeScript representan columnas reales.
- Tests de servicio cubren al menos agenda, login, paciente dashboard.

## Tarea 7 - Endurecer Auth backend

### Contexto

`JwtStrategy` usa fallback `'secret'`.

### Archivos

- `/opt/apps/medico-portal/clinica/api-nest/src/auth/jwt.strategy.ts`
- `/opt/apps/medico-portal/clinica/api-nest/src/auth/auth.module.ts`
- `/opt/apps/medico-portal/clinica/scripts/iclinica.bash`

### Pasos

1. Si `NODE_ENV === 'production'` y no hay `JWT_SECRET`, lanzar error al arrancar.

2. Mantener fallback solo para desarrollo si se decide.

3. Revisar `COOKIE_SECRET` con la misma regla.

4. Validar build:

```bash
cd /opt/apps/medico-portal/clinica/api-nest
npm run build
```

### Aceptación

- Producción no arranca con secreto débil.
- Desarrollo sigue teniendo camino documentado.

## Tarea 8 - Corregir RolesGuard

### Contexto

Actual usa `includes`, que permite coincidencias parciales.

### Archivo

- `/opt/apps/medico-portal/clinica/api-nest/src/auth/roles.guard.ts`

### Pasos

1. Cambiar comparación a igualdad:

```ts
return requiredRoles.includes(user.rol);
```

2. Si `user.rol` puede ser arreglo, soportar ambos:

```ts
const userRoles = Array.isArray(user.rol) ? user.rol : [user.rol];
return requiredRoles.some((role) => userRoles.includes(role));
```

3. Agregar test unitario.

### Aceptación

- `ADMINISTRADOR` no pasa por `ADMIN` por coincidencia parcial.
- Tests cubren permitido/denegado.

## Tarea 9 - Definir seguridad de seguimientos

### Contexto

`SeguimientoController` no tiene `@Roles`.

### Archivos

- `/opt/apps/medico-portal/clinica/api-nest/src/seguimiento/seguimiento.controller.ts`
- `/opt/apps/medico-portal/clinica/api-nest/src/seguimiento/seguimiento.service.ts`

### Pasos

1. Decidir acceso:

- Médico/Admin gestiona.
- Paciente solo consulta propios.

2. Si es médico/admin:

```ts
@Roles('MEDICO', 'ADMIN')
```

3. Si paciente consulta, crear endpoints separados o filtros estrictos por `idPaciente`.

### Aceptación

- Ningún usuario autenticado puede ver seguimientos ajenos por accidente.

## Tarea 10 - Verificación SQL Server

### Contexto

Los scripts existen, pero hay que verificar la base real.

### Archivos

- `api-nest/scripts/01_create_tables.sql`
- `api-nest/scripts/02_create_procedures.sql`
- Servicios backend

### Pasos

1. Extraer lista de procedures usados:

```bash
rg -n "sp_[A-Za-z0-9_]+" /opt/apps/medico-portal/clinica/api-nest/src
```

2. Comparar contra SQL Server:

```sql
SELECT name FROM sys.procedures WHERE name LIKE 'sp_%' ORDER BY name;
```

3. Verificar columnas:

```sql
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME, ORDINAL_POSITION;
```

4. No ejecutar `DROP` ni recreaciones destructivas sin backup.

### Aceptación

- Todos los procedures usados existen.
- Los tipos coinciden.
- Hay reporte de diferencias.

## Tarea 11 - Decidir app móvil oficial

### Contexto

Hay dos apps:

- `clinica/mobile_app`
- `movil`

### Pasos

1. Comparar pantallas y servicios.

2. Propuesta por defecto:

- Oficial clínica: `clinica/mobile_app`.
- Experimental/no clínica: `movil`, hasta que se confirme.

3. En app oficial, parametrizar API:

```dart
static const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'https://rhclaroni.com/api-portal-clinica/api',
);
```

4. Remover tokens hardcodeados de app distribuible.

### Aceptación

- Una app marcada como oficial.
- API configurable.
- Sin secretos hardcodeados.

## Tarea 12 - Crear pruebas de humo E2E

### Contexto

Antes de producción, se necesita una prueba corta por rol.

### Pruebas mínimas

Admin:

1. Login.
2. Ver dashboard.
3. Listar usuarios.
4. Buscar empleado.

Médico:

1. Login.
2. Ver agenda.
3. Abrir cita.
4. Registrar atención.
5. Consultar paciente.

Paciente:

1. Login.
2. Ver dashboard.
3. Crear chequeo.
4. Solicitar cita.
5. Ver mis citas.

### Aceptación

- Cada flujo queda documentado con resultado.
- No hay 401 después de login válido.
- No hay 404 de API.

## Tarea 13 - Manifest/PWA icon

### Contexto

Se observó warning del navegador:

```text
Manifest icon https://www.rhclaroni.com/pwa-192x192.png
Download error or resource isn't a valid image
```

### Pasos

1. Localizar manifest usado por el portal.

2. Verificar icono:

```bash
curl -skI https://www.rhclaroni.com/pwa-192x192.png
```

3. Validar MIME:

```bash
curl -sk https://www.rhclaroni.com/pwa-192x192.png -o /tmp/pwa-192x192.png
file -bi /tmp/pwa-192x192.png
```

4. Si el archivo no es PNG válido, reemplazar por PNG 192x192 real.

5. Verificar también 512x512 si el manifest lo declara.

### Aceptación

- El navegador no muestra warning de manifest icon.
- Iconos devuelven `image/png`.

## Tarea 14 - Documentar cierre

### Pasos

1. Actualizar este paquete de docs con:

- Cambios realizados.
- Comandos ejecutados.
- Resultado.
- Riesgos restantes.

2. Crear resumen final:

```text
Fecha:
Commit:
Frontend build:
Backend build:
PM2:
Nginx:
URLs validadas:
Pendientes:
```

### Aceptación

- Otra persona puede auditar qué se hizo sin leer todo el historial de consola.
