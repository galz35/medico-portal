# Prompt handoff para agente IA

Usa este prompt para continuar el trabajo con otro agente.

```text
Estas trabajando en /opt/apps/medico-portal en un servidor Linux.

Objetivo: terminar y estabilizar Portal Clinica sin romper lo que ya funciona.

Reglas:
- No empieces tocando codigo. Primero lee:
  - clinica/docs/2026-05-20-guia-agente-ia/00_INDICE.md
  - clinica/docs/2026-05-20-guia-agente-ia/01_ESTADO_REAL.md
  - clinica/docs/2026-05-20-guia-agente-ia/02_ARQUITECTURA_Y_MAPA.md
  - clinica/docs/2026-05-20-guia-agente-ia/03_REQUERIMIENTOS_FALTANTES.md
  - clinica/docs/2026-05-20-guia-agente-ia/04_PLAN_DE_TRABAJO.md
  - clinica/docs/2026-05-20-guia-agente-ia/05_VALIDACION_Y_DESPLIEGUE.md
- Ejecuta git status --short antes de modificar.
- No reviertas cambios ajenos.
- No uses git reset --hard.
- No ejecutes despliegues destructivos sin aprobacion explicita.
- Mantente en el stack real: backend NestJS + mssql + SQL Server, frontend Vite/React, movil Flutter.
- No sigas documentacion vieja que menciona Next.js o PostgreSQL como si fuera estado actual.

Estado verificado el 2026-05-20:
- Backend /clinica/api-nest compila, tests pasan: 5 suites, 22 tests.
- Frontend /web compila, tests pasan: 1 archivo, 3 tests.
- PM2 tiene portal-clinica-api online usando dist/main.js.
- Flutter no esta instalado en esta maquina, por eso movil no se valido.
- El frontend activo ya tiene /login montado.
- clinica/web no es app completa.
- App movil candidata oficial: clinica/mobile_app.
- App movil alternativa movil/ apunta a api-portal-planer-rust y debe tratarse como fuera de alcance o corregirse solo si se confirma.

Prioridad de trabajo:
1. Validar DB real y usuarios de prueba por rol.
2. Confirmar rutas publicas Nginx/API y variables VITE.
3. Sustituir mocks web por API real:
   - web/src/components/medico/AgendaCitas.tsx
   - web/src/components/medico/HistorialPaciente.tsx
   - web/src/components/medico/GestionCampanasVite.tsx
   - web/src/components/medico/steps/Step1_Resumen.tsx
4. Completar o quitar rutas visibles no implementadas en sidebar/admin.
5. Endurecer SSO/secretos:
   - JWT_SSO_SECRET obligatorio en produccion.
   - Quitar logs sensibles.
   - No dejar secretos productivos hardcodeados en scripts.
6. Validar app movil oficial cuando haya Flutter.
7. Ejecutar smoke tests publicos por rol.

Comandos base:
cd /opt/apps/medico-portal
git status --short

cd /opt/apps/medico-portal/clinica/api-nest
npx tsc -p tsconfig.json --noEmit --pretty false
npm test -- --runInBand
npm run build

cd /opt/apps/medico-portal/web
npx tsc -p tsconfig.json --noEmit --pretty false
npm test -- --run
npm run build

Entrega esperada:
- Cambios pequenos, enfocados y probados.
- Lista de archivos tocados.
- Resultado de pruebas.
- Pendientes reales si queda algo fuera de alcance.
```
