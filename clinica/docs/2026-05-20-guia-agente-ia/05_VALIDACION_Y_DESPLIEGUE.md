# Portal Clinica - Validacion y despliegue

Fecha: 2026-05-20

## Validacion local obligatoria

### Backend

Ruta:

```bash
cd /opt/apps/medico-portal/clinica/api-nest
```

Comandos:

```bash
npx tsc -p tsconfig.json --noEmit --pretty false
npm test -- --runInBand
npm run build
```

Esperado:

- TypeScript sin errores.
- Tests pasan.
- Build crea/actualiza `dist`.

### Frontend

Ruta:

```bash
cd /opt/apps/medico-portal/web
```

Comandos:

```bash
npx tsc -p tsconfig.json --noEmit --pretty false
npm test -- --run
npm run build
```

Esperado:

- TypeScript sin errores.
- Tests pasan.
- Build crea/actualiza `dist`.

Nota: Vitest puede requerir permiso fuera del sandbox porque Vite escribe temporales en `web/node_modules/.vite-temp`.

### Movil

Solo si Flutter esta instalado:

```bash
cd /opt/apps/medico-portal/clinica/mobile_app
flutter pub get
flutter analyze
flutter test
flutter build apk --release --dart-define=API_BASE_URL=https://rhclaroni.com/api-portal-clinica/api
```

Si Flutter no existe, documentar explicitamente que no se valido movil.

## Validacion de API local/servidor

PM2:

```bash
pm2 status
pm2 describe portal-clinica-api
pm2 logs portal-clinica-api --lines 100
```

Puertos:

```bash
ss -ltnp
```

Backend esperado:

- PM2 process: `portal-clinica-api`.
- Script: `clinica/api-nest/dist/main.js`.
- Puerto del script de despliegue: `3022`.

## Validacion publica

Frontend:

```bash
curl -skI https://rhclaroni.com/portal/clinica/
curl -skI https://rhclaroni.com/portal/clinica/login
```

API:

```bash
curl -skI https://rhclaroni.com/api-portal-clinica/docs
curl -skI https://rhclaroni.com/api-portal-clinica/api/auth/profile
```

Esperado:

- Frontend responde `200` o `304`.
- Login sirve `index.html`, no `404`.
- Swagger responde en la ruta que Nginx tenga configurada.
- Profile sin token responde `401` controlado, no `500`.

## Validacion funcional por rol

### Admin

- Login local o SSO.
- Dashboard carga.
- Usuarios lista.
- Medicos lista.
- Empleados busca.
- Roles/permisos carga.
- Reporte atenciones carga.
- Sidebar no contiene rutas rotas visibles.

### Medico

- Login local o SSO.
- Dashboard carga.
- Agenda carga desde API real.
- Busqueda/filtros no dependen de mock.
- Agendar cita funciona.
- Atencion por cita carga.
- Registrar atencion funciona.
- Historial de paciente carga.
- Examenes, vacunas y seguimientos cargan.
- Psicosocial carga si esta visible.

### Paciente

- Login local o SSO.
- Dashboard carga.
- Solicitar cita funciona.
- Crear chequeo funciona.
- Mis citas carga.
- Historial carga.
- Resultados/examenes carga.
- Telemedicina no rompe navegacion si queda visible.

## Despliegue

Script existente:

```bash
/opt/apps/medico-portal/clinica/scripts/iclinica.bash
```

Modos:

```bash
clinica/scripts/iclinica.bash update
clinica/scripts/iclinica.bash fresh
```

Advertencias:

- `fresh` borra/reclona `/opt/apps/medico-portal`; usar solo con aprobacion.
- El script contiene secretos/defaults sensibles. Antes de usar en produccion, mover secretos a ambiente o archivo protegido.
- El script hace `git pull --ff-only`; no ejecutarlo si hay cambios locales sin revisar.

## Nginx

Validar:

```bash
nginx -t
nginx -T
```

Rutas esperadas:

- `/portal/clinica/` sirve frontend compilado.
- `/api-portal-clinica/` proxya al backend.

Punto a confirmar:

- Si el proxy conserva `/api` o lo agrega/quita.
- La app web debe tener `VITE_API_URL` coherente con eso.

## Rollback

Antes de desplegar:

```bash
git rev-parse HEAD
pm2 describe portal-clinica-api
```

Rollback conceptual:

1. Volver al commit anterior conocido.
2. Reconstruir backend y frontend.
3. Restaurar frontend publicado previo si hay backup.
4. Reiniciar PM2.
5. `nginx -t` y reload solo si se tocaron configs.

No usar `git reset --hard` ni borrar carpetas sin aprobacion explicita.
