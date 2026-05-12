# Portal Clínica - Índice de Ejecución para IA

Fecha de creación: 2026-05-12  
Proyecto: `/opt/apps/medico-portal`  
Objetivo: dejar una guía completa, verificable y secuencial para que una IA de ejecución, incluso una IA rápida como DeepSeek V4 Flash, pueda continuar el trabajo sin perder contexto ni asumir datos falsos.

## Orden obligatorio de lectura

1. `2026-05-12-01-ESTADO-REAL-PROYECTO.md`
   - Resume qué existe hoy, qué compila, qué no compila, qué documentación previa está obsoleta y cuáles son los bloqueos reales.

2. `2026-05-12-02-PLAN-MAESTRO-FASES.md`
   - Divide el trabajo en fases. Cada fase tiene propósito, archivos, pasos y criterios de aceptación.

3. `2026-05-12-03-CONTRATOS-API-BD-FRONTEND.md`
   - Define las rutas reales del backend, los contratos esperados por frontend/móvil, las tablas y stored procedures conocidos.

4. `2026-05-12-04-TAREAS-DETALLADAS-DEEPSEEK.md`
   - Lista tareas accionables pieza por pieza. Usar como backlog operativo.

5. `2026-05-12-05-CHECKLIST-VALIDACION-DESPLIEGUE.md`
   - Checklist final para build, pruebas, integración, despliegue y rollback.

## Reglas para la IA ejecutora

- No asumir que la documentación antigua está correcta. Usar estos documentos fechados como referencia principal.
- No tocar base de datos productiva sin respaldo y sin registrar exactamente qué script SQL se ejecutó.
- No usar `git reset --hard`, no borrar directorios productivos y no revertir cambios ajenos.
- Antes de cambiar código, ejecutar inventario mínimo:
  - `git status --short`
  - `pwd`
  - `find /opt/apps/medico-portal -maxdepth 3 -name package.json -o -name pubspec.yaml`
- Cada cambio debe cerrar un punto del checklist. No mezclar refactors con correcciones funcionales.
- Si se cambia frontend, validar `npm run build` en `/opt/apps/medico-portal/web`.
- Si se cambia backend, validar `npm run build` en `/opt/apps/medico-portal/clinica/api-nest`.
- Si se cambia móvil, validar con Flutter solo si Flutter está instalado. En esta máquina, al 2026-05-12, `flutter` no está disponible.
- Si se cambia Nginx, PM2 o archivos bajo `/var/www`, usar el script de despliegue con cuidado y validar antes/después.

## Rutas principales

| Área | Ruta |
| --- | --- |
| Raíz del proyecto | `/opt/apps/medico-portal` |
| Frontend activo | `/opt/apps/medico-portal/web` |
| Backend NestJS | `/opt/apps/medico-portal/clinica/api-nest` |
| App móvil candidato 1 | `/opt/apps/medico-portal/clinica/mobile_app` |
| App móvil candidato 2 | `/opt/apps/medico-portal/movil` |
| Documentación histórica | `/opt/apps/medico-portal/clinica` y `/opt/apps/medico-portal/clinica/docs` |
| Script despliegue clínica | `/opt/apps/medico-portal/clinica/scripts/iclinica.bash` |
| Frontend desplegado | `/var/www/portal-clinica` |
| URL frontend esperada | `https://rhclaroni.com/portal/clinica/` |
| URL API pública esperada | `https://rhclaroni.com/api-portal-clinica` o `https://rhclaroni.com/api-portal-clinica/api` según se corrija el prefijo |
| PM2 backend | `portal-clinica-api` |
| Puerto backend | `3022` |

## Estado resumido al 2026-05-12

- Backend NestJS: compila correctamente con `npm run build`.
- Backend PM2: proceso `portal-clinica-api` aparece online.
- Frontend Vite/React: no compila por dependencias faltantes en `node_modules`.
- Móvil Flutter: no validado porque Flutter no está instalado en esta máquina.
- Base de datos: existen scripts SQL y consultas previas confirman tablas/roles/usuario de portal, pero falta checklist formal de verificación completa en SQL Server.
- Despliegue: existe script operativo, pero hay un riesgo importante de prefijo API entre Nginx, `VITE_API_URL` y `app.setGlobalPrefix('api')`.

## Documentación previa detectada

| Documento | Estado |
| --- | --- |
| `README.md` | Útil como entrada general, pero no suficiente para ejecución técnica. |
| `PLAN_TRABAJO_COMPLETO.md` | Parcialmente obsoleto. Habla de Next.js y describe una migración que ya cambió. |
| `PLAN_DETALLADO_CHECKLIST.md` | Optimista y desactualizado. Dice frontend 100%, pero hoy el build falla. |
| `Migration_Plan_Firebase_to_API.txt` | Histórico. Útil para entender intención de migración, no como verdad actual. |
| `docs/blueprint.md` | Útil para intención funcional inicial, pero describe prototipo con login falso. |
| `docs/backend.json` | Obsoleto frente a contratos actuales snake_case/int de SQL Server. |
| `MEGA-PROMPT.md` y `MEGA-PROMPTbackn.txt` | Útiles como intención, pero no sustituyen inventario real. |
| `PLAN_UX_CLARO_EMPRESARIAL.txt` | Útil para lineamientos visuales empresariales. |

## Resultado esperado del trabajo

Al finalizar las fases, el portal debe quedar así:

- Login real funcional desde `/portal/clinica/login`.
- Sesión persistente con JWT/localStorage y/o sesión portal según decisión documentada.
- Rutas protegidas por rol en frontend.
- API pública funcionando sin errores de prefijo.
- Backend NestJS conectado a SQL Server mediante stored procedures.
- Pantallas principales completas para ADMIN, MEDICO y PACIENTE.
- Móvil apuntando al backend correcto, sin tokens técnicos hardcodeados.
- Build frontend/backend reproducible.
- Despliegue por script validado.
- Checklist actualizado con evidencias.
