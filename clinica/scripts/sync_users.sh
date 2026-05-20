#!/bin/bash
# Sincronización diaria: PortalCore → Clínica
# 1. Copia empleados activos a tabla empleados
# 2. Crea usuarios con password local para los que tienen cuenta portal
# 3. Corre 5am vía cron
set -Eeuo pipefail
cd /opt/apps/medico-portal/clinica/api-nest
LOG_FILE="/var/log/clinica-sync-users.log"
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }
log "=== INICIO SYNC PORTAL→CLINICA ==="
node -e "
const sql = require('mssql');
const bcrypt = require('bcrypt');

async function main() {
  const cPool = await new sql.ConnectionPool({
    server:'localhost', port:1433, user:'sa',
    password:'TuPasswordFuerte!2026', database:'medicoBD',
    options:{encrypt:false,trustServerCertificate:true}
  }).connect();
  const pPool = await new sql.ConnectionPool({
    server:'localhost', port:1433, user:'sa',
    password:'TuPasswordFuerte!2026', database:'PortalCore',
    options:{encrypt:false,trustServerCertificate:true}
  }).connect();

  // 1. Sync empleados
  const emp = await pPool.request().query(\"SELECT carnet, nombre_completo, correo, cargo, empresa, Departamento as area, GERENTE as gerencia, GERENTECORREO, GERENTECARNET, pais, telefono FROM Empleado WHERE carnet IS NOT NULL AND carnet != '' AND (fechabaja IS NULL OR fechabaja = '') AND nombre_completo IS NOT NULL\");
  log('Empleados Portal: ' + emp.recordset.length);

  let insEmp = 0, updEmp = 0;
  for (const e of emp.recordset) {
    const c = e.carnet.trim();
    try {
      const ex = await cPool.request().input('c', sql.VarChar, c).query('SELECT id_empleado FROM empleados WHERE carnet = @c');
      if (ex.recordset.length > 0) {
        await cPool.request()
          .input('c', sql.VarChar, c).input('n', sql.VarChar, e.nombre_completo)
          .input('corr', sql.VarChar, e.correo||'').input('cargo', sql.VarChar, e.cargo||'')
          .input('gcia', sql.VarChar, e.gerencia||'').input('area', sql.VarChar, e.area||'')
          .input('tel', sql.VarChar, e.telefono||'').input('p', sql.VarChar, (e.pais||'NI').substring(0,2))
          .query('UPDATE empleados SET nombre_completo=@n, correo=@corr, cargo=@cargo, gerencia=@gcia, area=@area, telefono=@tel, pais=@p, estado=\\'ACTIVO\\' WHERE carnet=@c');
        updEmp++;
      } else {
        await cPool.request()
          .input('c', sql.VarChar, c).input('n', sql.VarChar, e.nombre_completo)
          .input('corr', sql.VarChar, e.correo||'').input('cargo', sql.VarChar, e.cargo||'')
          .input('gcia', sql.VarChar, e.gerencia||'').input('area', sql.VarChar, e.area||'')
          .input('tel', sql.VarChar, e.telefono||'').input('p', sql.VarChar, (e.pais||'NI').substring(0,2))
          .query('INSERT INTO empleados (carnet, nombre_completo, correo, cargo, gerencia, area, telefono, pais, estado) VALUES (@c, @n, @corr, @cargo, @gcia, @area, @tel, @p, \\'ACTIVO\\')');
        insEmp++;
      }
    } catch(err) { /* skip */ }
  }
  log('Empleados: +' + insEmp + ' nuevos, ' + updEmp + ' actualizados');

  // 2. Sync usuarios (crear los que faltan con password local)
  const cuentas = await pPool.request().query('SELECT Carnet, CorreoLogin, Activo FROM CuentaPortal WHERE Activo = 1 AND Carnet IS NOT NULL AND Carnet != \\'\\'');
  const salt = await bcrypt.genSalt(10);
  const passHash = await bcrypt.hash('Cl2026!Pass', salt);
  let newUsr = 0;

  for (const u of cuentas.recordset) {
    const c = u.Carnet.trim();
    try {
      const ex = await cPool.request().input('c', sql.VarChar, c).query('SELECT id_usuario FROM usuarios WHERE carnet = @c');
      if (ex.recordset.length === 0) {
        // Find employee name if available
        const empData = await cPool.request().input('c', sql.VarChar, c).query('SELECT TOP 1 nombre_completo FROM empleados WHERE carnet = @c');
        const nombre = empData.recordset.length > 0 ? empData.recordset[0].nombre_completo : u.CorreoLogin || c;
        await cPool.request()
          .input('c', sql.VarChar, c).input('h', sql.VarChar, passHash)
          .input('n', sql.VarChar, nombre).input('corr', sql.VarChar, u.CorreoLogin||'')
          .input('p', sql.VarChar, 'NI')
          .query('INSERT INTO usuarios (carnet, password_hash, nombre_completo, correo, id_rol, pais, estado, fecha_creacion) VALUES (@c, @h, @n, @corr, 3, @p, \\'A\\', GETDATE())');
        newUsr++;
      } else {
        // Ensure existing users with PORTAL_ hash get local password
        await cPool.request().input('c', sql.VarChar, c).input('h', sql.VarChar, passHash)
          .query('UPDATE usuarios SET password_hash = @h WHERE carnet = @c AND password_hash LIKE \\'PORTAL_%\\'');
      }
    } catch(err) { /* skip */ }
  }
  log('Usuarios nuevos: ' + newUsr);

  // 3. Crear pacientes para usuarios que no tienen (rol PACIENTE sin id_paciente)
  const sinPac = await cPool.request().query(\"SELECT u.id_usuario, u.carnet, u.nombre_completo, u.correo FROM usuarios u LEFT JOIN pacientes p ON u.id_paciente = p.id_paciente WHERE u.id_rol = 3 AND (u.id_paciente IS NULL OR p.id_paciente IS NULL)\");
  let newPac = 0;
  for (const u of sinPac.recordset) {
    try {
      const emp = await cPool.request().input('c', sql.VarChar, u.carnet).query('SELECT TOP 1 gerencia, area FROM empleados WHERE carnet = @c');
      const gcia = emp.recordset.length > 0 ? (emp.recordset[0].gerencia || '') : '';
      const area = emp.recordset.length > 0 ? (emp.recordset[0].area || '') : '';
      const r = await cPool.request()
        .input('c', sql.VarChar, u.carnet).input('n', sql.VarChar, u.nombre_completo)
        .input('corr', sql.VarChar, u.correo || '').input('g', sql.VarChar, gcia.substring(0,100))
        .input('a', sql.VarChar, area.substring(0,100))
        .query(\"INSERT INTO pacientes (carnet, nombre_completo, correo, gerencia, area, estado_paciente, nivel_semaforo) OUTPUT INSERTED.id_paciente VALUES (@c, @n, @corr, @g, @a, 'A', 'V')\");
      await cPool.request().input('id', sql.Int, u.id_usuario).input('idP', sql.Int, r.recordset[0].id_paciente)
        .query('UPDATE usuarios SET id_paciente = @idP WHERE id_usuario = @id');
      newPac++;
    } catch(err) { /* skip */ }
  }
  log('Pacientes nuevos: ' + newPac);

  const totalU = await cPool.request().query('SELECT COUNT(*) as c FROM usuarios');
  log('Total usuarios: ' + totalU.recordset[0].c);
  const totalP = await cPool.request().query('SELECT COUNT(*) as c FROM pacientes');
  log('Total pacientes: ' + totalP.recordset[0].c);
  
  await cPool.close(); await pPool.close();
}
main().catch(e => { log('ERROR: ' + e.message); process.exit(1); });
" 2>&1 | while IFS= read -r line; do log "$line"; done
log "=== FIN SYNC ==="
