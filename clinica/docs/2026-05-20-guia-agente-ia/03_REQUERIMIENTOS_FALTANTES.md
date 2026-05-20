# Portal Clinica - Requerimientos faltantes

Fecha: 2026-05-20

## Objetivo de cierre

Para considerar el modulo Clinica listo, debe quedar validado de punta a punta:

- Login local y SSO.
- Rutas protegidas por rol.
- Dashboard admin, medico y paciente con datos reales.
- Agenda, atencion, historial, chequeos, examenes, vacunas, seguimiento y psicosocial usando API real.
- SQL Server con tablas, procedures, indices y datos semilla correctos.
- Frontend publicado en `/portal/clinica/`.
- Backend publicado en `/api-portal-clinica/api`.
- App movil oficial definida, compilable y apuntando al endpoint correcto.

## Faltante critico

### 1. Validar base de datos real

Pendiente:

- Confirmar nombre real de DB: probablemente `medicoBD`.
- Confirmar credenciales reales usadas por PM2.
- Ejecutar o validar scripts:
  - `01_create_tables.sql`
  - `02_create_procedures.sql`
  - `03_create_indexes.sql`
- Confirmar que existen roles:
  - `ADMIN`
  - `MEDICO`
  - `PACIENTE`
- Confirmar usuarios de prueba con `id_medico` e `id_paciente`.
- Confirmar que cada stored procedure usado por servicios existe.

Criterio de aceptacion:

- `POST /api/auth/login` devuelve token para admin, medico y paciente.
- `GET /api/auth/profile` devuelve perfil con token.
- Dashboard de cada rol carga sin 500.

### 2. Sustituir mocks del frontend por API real

Archivos con mocks o datos de muestra que deben revisarse:

- `web/src/components/medico/AgendaCitas.tsx`
- `web/src/components/medico/HistorialPaciente.tsx`
- `web/src/components/medico/GestionCampanasVite.tsx`
- `web/src/components/medico/steps/Step1_Resumen.tsx`

Requerimiento:

- Cada pantalla productiva debe consumir servicios de `web/src/lib/services/*` o crear servicio equivalente.
- No debe depender de arrays hardcodeados para informacion clinica.
- Debe manejar loading, empty state y error.

Criterio de aceptacion:

- Al iniciar sesion como medico, agenda e historial muestran informacion real o empty state real.
- No quedan datos clinicos falsos visibles en produccion.

### 3. Completar navegacion admin

Observacion:

- Sidebar incluye `Auditoria SSO` con path `/admin/auditoria`, pero `App.tsx` solo monta `/admin/dashboard`.

Pendiente:

- Crear o remover rutas no implementadas:
  - `/admin/auditoria`
  - gestion usuarios si se requiere desde sidebar.

Criterio de aceptacion:

- Ningun item visible del sidebar manda a fallback inesperado.

### 4. Endurecer SSO y secretos

Riesgos:

- `AuthService` usa fallback literal para `JWT_SSO_SECRET`.
- `clinica/scripts/iclinica.bash` contiene secretos en texto plano.
- `AuthService` contiene `console.log` de debugging SSO.

Pendiente:

- Requerir `JWT_SSO_SECRET` desde ambiente en produccion.
- Mover secretos a variables de entorno o archivo protegido no versionado.
- Reducir logs SSO a informacion no sensible.
- Confirmar contrato con portal central:
  - cookie `portal_sid`
  - endpoint introspect
  - token SSO
  - payload esperado.

Criterio de aceptacion:

- Produccion no arranca si faltan secretos criticos.
- Logs no imprimen payloads sensibles completos.
- SSO local y publico validado.

### 5. Definir app movil oficial

Recomendacion:

- Oficializar `clinica/mobile_app`.
- Marcar `movil` como experimental/fuera de alcance o corregirlo si realmente es la app nueva.

Pendiente `clinica/mobile_app`:

- Ejecutar `flutter pub get`.
- Ejecutar `flutter analyze`.
- Ejecutar `flutter test`.
- Compilar APK con:

```bash
flutter build apk --release --dart-define=API_BASE_URL=https://rhclaroni.com/api-portal-clinica/api
```

Pendiente `movil`:

- Quitar default `api-portal-planer-rust` si se decide usarla como Clinica.
- Eliminar token tecnico hardcodeado.

### 6. Pruebas E2E por rol

Falta validar con navegador:

- Login admin.
- Login medico.
- Login paciente.
- Redireccion por rol.
- 401 limpia sesion.
- 403 no borra sesion indebidamente.
- Deep link bajo `/portal/clinica/*`.
- Refresh del navegador en rutas internas.

### 7. Despliegue y Nginx

Pendiente:

- Confirmar snippet Nginx real para:
  - `/portal/clinica/`
  - `/api-portal-clinica/`
- Validar si Nginx conserva o reescribe `/api`.
- Confirmar Swagger publico:
  - `/api-portal-clinica/docs`
  - o `/api-portal-clinica/api/docs`

Criterio de aceptacion:

- `curl -skI https://rhclaroni.com/portal/clinica/` responde frontend.
- `curl -skI https://rhclaroni.com/portal/clinica/login` responde frontend.
- `curl -skI https://rhclaroni.com/api-portal-clinica/docs` o equivalente responde Swagger.
- `GET /api/auth/profile` sin token responde 401 controlado.

## Faltante no critico

- Reducir bundle web mayor a 500 kB con code splitting.
- Agregar mas tests frontend para `AuthContext`, `ProtectedRoute` y servicios.
- Agregar tests backend para controladores y errores de DB.
- Documentar contratos JSON exactos por pantalla.
- Revisar accesibilidad y responsividad de pantallas mas densas.
