# Portal Clínica - Resumen de Cierre

Fecha: 2026-05-12
Commit base: `a97d858a feat(movil): add clinical appointment attention flow`

---

## Cambios realizados

### Frontend (`/opt/apps/medico-portal/web`)

| Archivo | Cambio |
|---------|--------|
| `src/App.tsx` | Ruta `/login` agregada. `ProtectedRoute` envuelve admin/medico/paciente. Root redirige a `/login`. Placeholders reemplazados. Comentarios demo eliminados. |
| `src/components/medico/MedicoDashboard.tsx` | **Nuevo** - Dashboard médico con KPIs, próximas citas, alertas |
| `src/components/paciente/PacienteHistorial.tsx` | **Nuevo** - Historial del paciente (línea de tiempo) |
| `src/components/paciente/PacienteResultados.tsx` | **Nuevo** - Resultados de exámenes del paciente |

### Backend (`/opt/apps/medico-portal/clinica/api-nest`)

| Archivo | Cambio |
|---------|--------|
| `src/main.ts` | Validación de `JWT_SECRET` y `COOKIE_SECRET` en producción |
| `src/auth/jwt.strategy.ts` | Sin fallback `'secret'` |
| `src/auth/roles.guard.ts` | Normalizado a comparación exacta (sin coincidencia parcial) |
| `src/auth/roles.guard.spec.ts` | **Nuevo** - 8 tests unitarios |
| `src/seguimiento/seguimiento.controller.ts` | `@Roles('MEDICO', 'ADMIN')` agregado |

### Scripts y configuración

| Archivo | Cambio |
|---------|--------|
| `clinica/scripts/iclinica.bash` | `VITE_API_URL` ahora incluye `/api` (Opción A) |

### Móvil

| Archivo | Cambio |
|---------|--------|
| `clinica/mobile_app/lib/core/constants.dart` | API configurable via `--dart-define`. App marcada como oficial. |

---

## Comandos de validación

```bash
# Backend build
cd /opt/apps/medico-portal/clinica/api-nest && npm run build
# Resultado: OK

# Frontend build
cd /opt/apps/medico-portal/web && npm run build
# Resultado: OK (warning chunk size no crítico)

# Tests backend
cd /opt/apps/medico-portal/clinica/api-nest && npm test
# Resultado: 22 passed, 5 suites

# Nginx
nginx -t
# Resultado: syntax is ok

# PM2
pm2 status portal-clinica-api
# Resultado: online (23 días)
```

---

## Flujo de URL corregido

```
Frontend llama a:
  https://rhclaroni.com/api-portal-clinica/api/auth/login
                          └── Nginx proxy_pass http://127.0.0.1:3022/
                          └── Backend recibe /api/auth/login ✅

Swagger:
  https://rhclaroni.com/api-portal-clinica/docs
                          └── Backend recibe /docs ✅
```

---

## Riesgos restantes

| Riesgo | Impacto | Recomendación |
|--------|---------|---------------|
| PWA manifest icon warning | Bajo | Verificar desde navegador; el código actual no tiene manifest |
| Flutter no instalado en servidor | Medio | Instalar Flutter SDK o validar build móvil desde otra máquina |
| Sin verificación contra SQL Server real | Medio | Ejecutar consultas de verificación contra BD productiva |
| `/movil` tiene token hardcodeado | Alto | Decidir si pertenece a clínica o no; remover token |
| Admin CRUD pages (usuarios, médicos, roles) | Medio | Faltan componentes frontend para gestión completa |
| Seed data no verificada | Bajo | Confirmar usuarios de prueba existen en BD |
| Sin tests E2E automatizados | Medio | Ejecutar pruebas de humo del checklist E2E manualmente |

---

## Declaración

- [x] Backend build
- [x] Frontend build
- [x] Login por rol
- [x] API prefix validado (configuración)
- [x] PM2 online
- [x] Nginx válido
- [ ] Flujo admin (pendiente verificación en producción)
- [ ] Flujo médico (pendiente verificación en producción)
- [ ] Flujo paciente (pendiente verificación en producción)
- [ ] Riesgos restantes documentados
