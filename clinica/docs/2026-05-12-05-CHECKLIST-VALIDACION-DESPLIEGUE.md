# Portal Clínica - Checklist de Validación y Despliegue

Fecha de creación: 2026-05-12

## 1. Checklist antes de modificar

- [ ] Estoy en `/opt/apps/medico-portal`.
- [ ] Ejecuté `git status --short`.
- [ ] Revisé si hay cambios ajenos.
- [ ] Leí los documentos `2026-05-12-*`.
- [ ] Confirmé si el cambio es frontend, backend, móvil, DB o despliegue.
- [ ] Identifiqué archivos exactos a tocar.
- [ ] No voy a ejecutar cambios destructivos.

## 2. Checklist frontend

Ruta:

```bash
/opt/apps/medico-portal/web
```

Comandos:

```bash
npm ci
npm run build
npm test
```

Validaciones:

- [ ] `npm ci` termina sin error.
- [ ] `npm run build` pasa.
- [ ] `/login` existe.
- [ ] `/portal/clinica/login` funciona con `basename`.
- [ ] `ProtectedRoute` se usa.
- [ ] Admin, médico y paciente tienen rutas protegidas.
- [ ] No quedan comentarios `Reuse for demo` en rutas productivas.
- [ ] `VITE_API_URL` apunta al prefijo correcto.
- [ ] 401 limpia sesión y redirige a login.
- [ ] 403 muestra sin permiso o redirige sin cerrar sesión.
- [ ] No hay llamadas API a endpoints inexistentes.

## 3. Checklist backend

Ruta:

```bash
/opt/apps/medico-portal/clinica/api-nest
```

Comandos:

```bash
npm run build
npm test
```

Validaciones:

- [ ] Build pasa.
- [ ] Tests pasan o se documenta por qué no existen.
- [ ] `JWT_SECRET` no usa fallback inseguro en producción.
- [ ] `COOKIE_SECRET` está definido.
- [ ] `RolesGuard` no usa coincidencia parcial insegura.
- [ ] Seguimientos tienen roles definidos o política explícita.
- [ ] Swagger disponible en `/docs`.
- [ ] Prefijo global `/api` está considerado en Nginx/frontend.
- [ ] DTOs validan entradas críticas.
- [ ] Errores 401/403/404/500 tienen formato consistente.

## 4. Checklist SQL Server

Antes:

- [ ] Hay backup.
- [ ] Se sabe nombre de base de datos.
- [ ] Se sabe usuario SQL usado por backend.
- [ ] No se ejecutarán scripts destructivos sin revisión.

Tablas:

- [ ] `roles`
- [ ] `permisos`
- [ ] `roles_permisos`
- [ ] `pacientes`
- [ ] `medicos`
- [ ] `usuarios`
- [ ] `empleados`
- [ ] `casos_clinicos`
- [ ] `citas_medicas`
- [ ] `atenciones_medicas`
- [ ] `chequeos_bienestar`
- [ ] `seguimientos`
- [ ] `examenes_medicos`
- [ ] `vacunas_aplicadas`
- [ ] `registros_psicosociales`

Stored procedures:

- [ ] `sp_Login`
- [ ] `sp_UpdateUltimoAcceso`
- [ ] `sp_Auth_GetProfile`
- [ ] `sp_Auth_HashPassword`
- [ ] Todos los `sp_Admin_*`
- [ ] Todos los `sp_Medico_*`
- [ ] Todos los `sp_Paciente_*`
- [ ] Todos los `sp_Seguimiento_*`

Datos mínimos:

- [ ] Rol `ADMIN`.
- [ ] Rol `MEDICO`.
- [ ] Rol `PACIENTE`.
- [ ] Usuario admin de prueba.
- [ ] Usuario médico de prueba con `id_medico`.
- [ ] Usuario paciente de prueba con `id_paciente`.
- [ ] Citas de prueba.
- [ ] Chequeos de prueba.

## 5. Checklist móvil

Rutas:

```bash
/opt/apps/medico-portal/clinica/mobile_app
/opt/apps/medico-portal/movil
```

Decisiones:

- [ ] Se definió cuál app móvil es oficial.
- [ ] La app no oficial queda marcada como experimental o fuera de alcance.
- [ ] API base configurable por `--dart-define`.
- [ ] No hay tokens técnicos hardcodeados.
- [ ] No apunta a `api-portal-planer-rust` salvo que sea integración confirmada.

Comandos si Flutter existe:

```bash
flutter pub get
flutter analyze
flutter test
flutter build apk --release --dart-define=API_BASE_URL=https://rhclaroni.com/api-portal-clinica/api
```

Validaciones:

- [ ] Build Android generado.
- [ ] Login funciona.
- [ ] Navegación por rol funciona.
- [ ] Errores offline/API se manejan.

## 6. Checklist Nginx y PM2

Comandos:

```bash
nginx -t
pm2 status
pm2 describe portal-clinica-api
pm2 logs portal-clinica-api --lines 100
```

Validaciones:

- [ ] Nginx config válido.
- [ ] `portal-clinica-api` online.
- [ ] Puerto backend `3022` escuchando.
- [ ] Proxy `/api-portal-clinica/` resuelve backend.
- [ ] Frontend `/portal/clinica/` sirve `index.html`.
- [ ] No hay loop de redirect.
- [ ] Logs PM2 sin errores repetitivos.

## 7. Checklist URL pública

Validar:

```bash
curl -skI https://rhclaroni.com/portal/clinica/
curl -skI https://rhclaroni.com/portal/clinica/login
curl -skI https://rhclaroni.com/api-portal-clinica/docs
curl -skI https://rhclaroni.com/api-portal-clinica/api/auth/profile
```

Esperado:

- [ ] Frontend responde 200 o 304.
- [ ] Login responde frontend, no 404.
- [ ] Swagger responde.
- [ ] Profile sin token responde 401 controlado.
- [ ] Login con credenciales válidas responde token.

## 8. Checklist funcional por rol

### Admin

- [ ] Login admin.
- [ ] Dashboard carga.
- [ ] Lista usuarios.
- [ ] Crea usuario.
- [ ] Edita usuario.
- [ ] Lista médicos.
- [ ] Crea médico.
- [ ] Consulta empleados.
- [ ] Ve roles/permisos.
- [ ] Ve reporte de atenciones.

### Médico

- [ ] Login médico.
- [ ] Dashboard médico real.
- [ ] Agenda carga.
- [ ] Filtros de agenda funcionan.
- [ ] Agendar cita funciona.
- [ ] Abrir cita funciona.
- [ ] Registrar atención funciona.
- [ ] Historial paciente carga.
- [ ] Casos clínicos cargan.
- [ ] Exámenes cargan/actualizan.
- [ ] Seguimientos cargan/actualizan.
- [ ] Vacunas registran.
- [ ] Psicosocial carga/registra.
- [ ] Reporte atención/paciente funciona.

### Paciente

- [ ] Login paciente.
- [ ] Dashboard carga.
- [ ] Crear chequeo funciona.
- [ ] Solicitar cita funciona.
- [ ] Mis citas carga.
- [ ] Mis chequeos carga.
- [ ] Mis exámenes carga.
- [ ] Mis vacunas carga.
- [ ] Historial/timeline carga.
- [ ] Telemedicina no rompe navegación si queda habilitada.

## 9. Checklist PWA/manifest

- [ ] Manifest existe.
- [ ] Icono 192x192 es imagen válida.
- [ ] Icono 512x512 es imagen válida si aplica.
- [ ] MIME correcto `image/png`.
- [ ] No hay warning `Download error or resource isn't a valid image`.

## 10. Despliegue

Script:

```bash
cd /opt/apps/medico-portal/clinica
bash scripts/iclinica.bash update
```

Antes:

- [ ] Backend build pasa.
- [ ] Frontend build pasa.
- [ ] Se decidió prefijo API.
- [ ] Se revisó `VITE_API_URL`.
- [ ] Se revisó `PORT=3022`.
- [ ] Se revisó `CORS_ORIGIN`.

Después:

- [ ] PM2 online.
- [ ] Nginx reload correcto.
- [ ] URL frontend abre.
- [ ] URL Swagger abre.
- [ ] Login real funciona.
- [ ] No hay 401 repetitivos después de login.
- [ ] No hay 404 por prefijo API.

## 11. Rollback

Antes de despliegue guardar:

- [ ] Commit anterior.
- [ ] Backup de `/var/www/portal-clinica`.
- [ ] Config Nginx anterior.
- [ ] PM2 env anterior.

Rollback esperado:

```bash
cd /opt/apps/medico-portal
git checkout <commit_anterior>
cd /opt/apps/medico-portal/clinica
bash scripts/iclinica.bash update
```

Si el problema es solo frontend:

- Restaurar `/var/www/portal-clinica` desde backup.
- Recargar Nginx si se modificó config.

Si el problema es backend:

- Volver commit.
- Rebuild backend.
- Reiniciar PM2.

## 12. Declaración final de listo

No declarar "todo está ok" hasta completar:

- [ ] Backend build.
- [ ] Frontend build.
- [ ] Login por rol.
- [ ] API prefix validado.
- [ ] PM2 online.
- [ ] Nginx válido.
- [ ] Flujo admin.
- [ ] Flujo médico.
- [ ] Flujo paciente.
- [ ] Riesgos restantes documentados.
