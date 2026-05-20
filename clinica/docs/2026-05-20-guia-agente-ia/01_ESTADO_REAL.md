# Portal Clinica - Estado real verificado

Fecha: 2026-05-20  
Base: `/opt/apps/medico-portal`

## Resumen ejecutivo

El proyecto tiene backend NestJS, frontend web Vite/React, dos aplicaciones Flutter y scripts SQL/PM2/Nginx. No esta en cero. El trabajo pendiente principal es cerrar brechas funcionales y operativas: reemplazar pantallas web con mock por datos reales, decidir oficialmente cual app movil se mantiene, validar SQL Server real contra los stored procedures, endurecer secretos/SSO y completar pruebas E2E por rol.

Estado corto:

- Backend: compila, tests unitarios pasan y corre en PM2 como `portal-clinica-api`.
- Web: compila, tests pasan y ya tiene ruta `/login`.
- Movil oficial probable: `clinica/mobile_app`, porque apunta a `api-portal-clinica/api`.
- Movil alterno/riesgoso: `movil`, porque apunta por defecto a `api-portal-planer-rust` y tiene token tecnico por defecto.
- DB: scripts existen, pero falta validar contra el SQL Server real y datos semilla reales.
- Despliegue: existe `clinica/scripts/iclinica.bash`; contiene configuracion productiva, pero tambien secretos y valores por defecto sensibles.

## Validaciones ejecutadas

### Git

```bash
cd /opt/apps/medico-portal
git status --short
```

Resultado inicial: limpio.

Nota: despues de ejecutar `npm run build` en `web`, quedo modificado `web/tsconfig.tsbuildinfo`. Es artefacto generado por TypeScript, no cambio funcional de codigo.

### Backend

```bash
cd /opt/apps/medico-portal/clinica/api-nest
npx tsc -p tsconfig.json --noEmit --pretty false
npm test -- --runInBand
npm run build
```

Resultado:

- TypeScript sin errores.
- Build exitoso.
- 5 suites pasaron.
- 22 tests pasaron.

### Frontend web

```bash
cd /opt/apps/medico-portal/web
npx tsc -p tsconfig.json --noEmit --pretty false
npm test -- --run
npm run build
```

Resultado:

- TypeScript sin errores.
- 1 archivo de prueba paso.
- 3 tests pasaron.
- Build exitoso.

Warning no bloqueante:

- `dist/assets/index-*.js` queda sobre 500 kB minificado.
- Recomendacion futura: code splitting con `dynamic import` o `manualChunks`.

### Flutter

```bash
command -v flutter
```

Resultado: no instalado en esta maquina. No se pudo validar `flutter analyze`, `flutter test` ni `flutter build apk`.

### PM2

```bash
pm2 status
pm2 describe portal-clinica-api
```

Resultado:

- `portal-clinica-api` online.
- Script: `/opt/apps/medico-portal/clinica/api-nest/dist/main.js`.
- CWD: `/opt/apps/medico-portal/clinica/api-nest`.
- Node: `20.20.1`.
- `NODE_ENV`: `production`.
- Uptime observado: 7 dias.
- Restarts: 1.

## Estado de modulos

| Modulo | Ruta | Estado | Nota |
| --- | --- | --- | --- |
| Backend API | `clinica/api-nest` | Operativo | NestJS 11 + Fastify + SQL Server via `mssql` |
| Web | `web` | Compila | Vite + React 18 + rutas protegidas |
| Web antiguo/incompleto | `clinica/web` | Incompleto | Solo contiene algunos archivos, no tiene `package.json` |
| Movil A | `clinica/mobile_app` | Candidato oficial | Flutter, apunta a Clinica API |
| Movil B | `movil` | Revisar/aislar | Flutter, apunta a Planer Rust por defecto |
| SQL | `clinica/api-nest/scripts` | Existe | Falta aplicar/validar en DB real |
| Deploy | `clinica/scripts/iclinica.bash` | Existe | Requiere limpieza de secretos y validacion final |

## Riesgos principales

1. Hay pantallas web que aun usan datos mock o flujos incompletos:
   - `web/src/components/medico/AgendaCitas.tsx`
   - `web/src/components/medico/HistorialPaciente.tsx`
   - `web/src/components/medico/GestionCampanasVite.tsx`
   - `web/src/components/medico/steps/Step1_Resumen.tsx`

2. `movil/lib/core/config/api_environment.dart` apunta por defecto a `https://rhclaroni.com/api-portal-planer-rust` y trae un token tecnico por defecto.

3. `clinica/scripts/iclinica.bash` contiene secretos en texto plano y defaults sensibles.

4. `AuthService` tiene SSO/JIT con SQL directo y un fallback de `JWT_SSO_SECRET`. En produccion debe venir de ambiente y no de literal.

5. No se valido SQL Server real desde esta revision.

6. No hay prueba E2E completa por rol en navegador ni prueba movil.

## Correcciones sobre documentacion antigua

La documentacion del `2026-05-12` decia que el frontend no tenia `/login`. Eso ya no aplica: `web/src/App.tsx` monta `Route path="/login"` con `LoginPage`.

La documentacion antigua que habla de Next.js no refleja el frontend activo. El frontend activo es Vite/React en `/web`.

La documentacion que menciona PostgreSQL no refleja el backend activo. El backend activo usa SQL Server con `mssql` y stored procedures.
