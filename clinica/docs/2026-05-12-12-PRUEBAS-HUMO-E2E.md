# Portal Clínica - Pruebas de Humo E2E

Fecha: 2026-05-12

## Prerrequisitos

- Frontend desplegado en `https://rhclaroni.com/portal/clinica/`
- API en `https://rhclaroni.com/api-portal-clinica/api`
- Backend online en PM2 (`portal-clinica-api`)
- Usuarios de prueba con datos en BD

---

## 1. Flujo Público (sin autenticación)

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 1.1 | Navegar a `https://rhclaroni.com/portal/clinica/` | Redirige a `/portal/clinica/login` |
| 1.2 | Navegar directamente a `/portal/clinica/login` | Renderiza formulario de login (carnet + password) |
| 1.3 | Navegar a `/portal/clinica/admin/dashboard` sin token | Redirige a `/portal/clinica/login` |
| 1.4 | Navegar a `/portal/clinica/medico/agenda-citas` sin token | Redirige a `/portal/clinica/login` |
| 1.5 | Navegar a `/portal/clinica/paciente/dashboard` sin token | Redirige a `/portal/clinica/login` |

---

## 2. Flujo Admin

Requiere: usuario con rol `ADMIN`

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 2.1 | Login con credenciales de admin | Redirige a `/admin/dashboard` |
| 2.2 | Dashboard admin carga | KPIs visibles (médicos activos, pacientes totales, citas hoy) |
| 2.3 | Navegar a `/admin/usuarios` (si existe ruta) | Lista de usuarios cargada |
| 2.4 | Cerrar sesión | Token eliminado, redirige a `/login` |
| 2.5 | Protección de ruta: admin intenta `/medico/agenda-citas` | Permite acceso (rol ADMIN incluido en MEDICO) |

---

## 3. Flujo Médico

Requiere: usuario con rol `MEDICO`

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 3.1 | Login con credenciales de médico | Redirige a `/medico/dashboard` |
| 3.2 | Dashboard médico carga | KPIs médicos visibles (citas hoy, pacientes atendidos) |
| 3.3 | Navegar a `/medico/agenda-citas` | Agenda del día cargada |
| 3.4 | Protección de ruta: médico intenta `/admin/dashboard` | Redirige a `/medico/agenda-citas` (sin permisos) |
| 3.5 | Cerrar sesión | Token eliminado, redirige a `/login` |

---

## 4. Flujo Paciente

Requiere: usuario con rol `PACIENTE`

| # | Paso | Resultado esperado |
|---|------|--------------------|
| 4.1 | Login con credenciales de paciente | Redirige a `/paciente/dashboard` |
| 4.2 | Dashboard paciente carga | Estadísticas visibles (chequeos, citas, vacunas) |
| 4.3 | Navegar a `/paciente/historial` | Historial de paciente cargado |
| 4.4 | Navegar a `/paciente/resultados` | Resultados de exámenes cargados |
| 4.5 | Protección de ruta: paciente intenta `/medico/agenda-citas` | Redirige a `/paciente/dashboard` |
| 4.6 | Cerrar sesión | Token eliminado, redirige a `/login` |

---

## 5. Pruebas de API directa (curl)

```bash
# Swagger debe responder
curl -sk https://rhclaroni.com/api-portal-clinica/docs

# Profile sin token debe dar 401
curl -sk -o /dev/null -w '%{http_code}' https://rhclaroni.com/api-portal-clinica/api/auth/profile

# Login con credenciales correctas debe dar token
curl -sk -X POST https://rhclaroni.com/api-portal-clinica/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"carnet":"USUARIO_PRUEBA","password":"PASSWORD_PRUEBA"}'
```

---

## 6. Resultado

| Flujo | Estado | Observaciones |
|-------|--------|---------------|
| Público (sin auth) | ⬜ | |
| Admin | ⬜ | |
| Médico | ⬜ | |
| Paciente | ⬜ | |
| API directa | ⬜ | |
