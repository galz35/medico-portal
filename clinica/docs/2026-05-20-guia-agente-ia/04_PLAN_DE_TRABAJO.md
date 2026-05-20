# Portal Clinica - Plan de trabajo recomendado

Fecha: 2026-05-20

## Principio

No empezar por refactors. Primero cerrar el circuito productivo: DB real, auth, rutas por rol, pantallas con API real, despliegue y smoke tests.

## Fase 0 - Prechecks

1. Entrar al repo:

```bash
cd /opt/apps/medico-portal
git status --short
```

2. Si hay cambios no propios, no revertir. Documentar y trabajar alrededor.

3. Leer:

```text
clinica/docs/2026-05-20-guia-agente-ia/00_INDICE.md
clinica/docs/2026-05-20-guia-agente-ia/01_ESTADO_REAL.md
clinica/docs/2026-05-20-guia-agente-ia/03_REQUERIMIENTOS_FALTANTES.md
```

## Fase 1 - Base tecnica estable

Objetivo: confirmar que el estado local sigue sano.

Comandos:

```bash
cd /opt/apps/medico-portal/clinica/api-nest
npm test -- --runInBand
npm run build

cd /opt/apps/medico-portal/web
npm test -- --run
npm run build
```

Criterio:

- Todo pasa.
- Si falla, corregir primero antes de agregar funcionalidad.

## Fase 2 - DB real y auth

Objetivo: validar que SQL Server real cumple el contrato.

Tareas:

1. Identificar ambiente real de PM2:

```bash
pm2 describe portal-clinica-api
pm2 env 19
```

2. Validar variables:

- `MSSQL_HOST`
- `MSSQL_PORT`
- `MSSQL_USER`
- `MSSQL_PASSWORD`
- `MSSQL_DATABASE`
- `JWT_SECRET`
- `COOKIE_SECRET`
- `JWT_SSO_SECRET`
- `PORTAL_API_URL`

3. Confirmar objetos SQL:

- Tablas de `01_create_tables.sql`.
- Stored procedures de `02_create_procedures.sql`.
- Indices de `03_create_indexes.sql`.

4. Crear o confirmar usuarios de prueba:

- Admin.
- Medico con `id_medico`.
- Paciente con `id_paciente`.

Criterio:

- Login local funciona para los 3 roles.
- Profile funciona con token.
- Dashboard de cada rol no devuelve 500.

## Fase 3 - Frontend sin mocks visibles

Objetivo: conectar pantallas productivas a API real.

Orden recomendado:

1. `AgendaCitas.tsx`
   - Reemplazar `mockCitas`.
   - Usar endpoint medico real.
   - Mantener filtros y busqueda.

2. `HistorialPaciente.tsx`
   - Conectar busqueda/listado de pacientes.
   - Conectar detalle: chequeos, citas, examenes, vacunas.

3. `Step1_Resumen.tsx`
   - Quitar historial mock.
   - Recibir historial real desde el flujo de atencion o cargar por `idPaciente`.

4. `GestionCampanasVite.tsx`
   - Decidir si queda en alcance.
   - Si queda, crear endpoint real o ocultar ruta.

5. Sidebar/admin
   - Eliminar rutas visibles sin implementacion o crear paginas reales.

Criterio:

- No hay datos clinicos ficticios en produccion.
- Loading, error y empty state funcionan.
- `npm run build` y `npm test -- --run` pasan.

## Fase 4 - Seguridad y SSO

Objetivo: evitar secretos hardcodeados y logs sensibles.

Tareas:

1. Cambiar fallback de `JWT_SSO_SECRET` para que en produccion sea obligatorio.
2. Remover logs de payload completo SSO.
3. Revisar `iclinica.bash` para no versionar secretos reales.
4. Validar `portal-session` con cookie real.
5. Validar `sso-login` con ticket real.

Criterio:

- SSO funciona.
- Produccion falla temprano si falta secreto.
- Logs no exponen token, payload sensible ni password.

## Fase 5 - Movil

Objetivo: definir una sola app Clinica.

Recomendacion:

1. Usar `clinica/mobile_app` como oficial.
2. Dejar `movil` fuera de alcance hasta que negocio confirme.

Comandos cuando haya Flutter:

```bash
cd /opt/apps/medico-portal/clinica/mobile_app
flutter pub get
flutter analyze
flutter test
flutter build apk --release --dart-define=API_BASE_URL=https://rhclaroni.com/api-portal-clinica/api
```

Criterio:

- Login movil funciona.
- Navegacion por rol funciona.
- APK release compila.

## Fase 6 - Despliegue y smoke tests

Objetivo: validar publico.

Comandos:

```bash
nginx -t
pm2 status
pm2 describe portal-clinica-api
curl -skI https://rhclaroni.com/portal/clinica/
curl -skI https://rhclaroni.com/portal/clinica/login
curl -skI https://rhclaroni.com/api-portal-clinica/docs
```

Validaciones funcionales:

- Login admin.
- Login medico.
- Login paciente.
- Refresh en ruta interna.
- Logout.
- Token vencido o invalido.

## Fase 7 - Cierre

Antes de entregar:

```bash
cd /opt/apps/medico-portal
git status --short
```

Documentar:

- Archivos tocados.
- Comandos ejecutados.
- Resultado de pruebas.
- Pendientes reales no resueltos.
