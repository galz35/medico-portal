#!/usr/bin/env node
const sql = require('mssql');
const bcrypt = require('bcrypt');
const https = require('https');
const http = require('http');

const CLINICA_DB = {
  server: process.env.MSSQL_HOST || 'localhost',
  port: parseInt(process.env.MSSQL_PORT || '1433'),
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || 'TuPasswordFuerte!2026',
  database: process.env.MSSQL_DATABASE || 'medicoBD',
  options: { encrypt: false, trustServerCertificate: true }
};

const PORTAL_API = (process.env.PORTAL_API_URL || 'http://localhost:3120').replace(/\/+$/, '');
const DEFAULT_PASS = process.env.SYNC_DEFAULT_PASS || 'Cl2026!Pass';

async function getPortalUsers() {
  try {
    const url = new URL(`${PORTAL_API}/api/empleados/activos`);
    const fetcher = url.protocol === 'https:' ? https : http;
    return new Promise((resolve, reject) => {
      const req = fetcher.get(url.href, { headers: { 'Content-Type': 'application/json' } }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch { resolve(null); }
        });
      });
      req.on('error', () => resolve(null));
      req.end();
    });
  } catch { return null; }
}

async function upsertUser(pool, user) {
  const carnet = (user.carnet || user.usuario || '').toString().trim();
  if (!carnet) return;

  const nombre = user.nombre || user.nombre_completo || user.nombreCompleto || carnet;
  const correo = user.correo || user.email || `${carnet}@claro.com.ni`;
  const rolMap = { 1: 'ADMIN', 2: 'MEDICO', 3: 'PACIENTE', 4: 'RRHH' };
  const rolNombre = user.rolNombre || user.rol || rolMap[user.id_rol] || 'PACIENTE';
  const pais = user.pais || 'NI';

  const rolRow = await pool.request()
    .input('nombre', sql.VarChar, rolNombre)
    .query("SELECT id_rol FROM roles WHERE nombre = @nombre");
  const idRol = rolRow.recordset.length > 0 ? rolRow.recordset[0].id_rol : 3;

  const existing = await pool.request()
    .input('carnet', sql.VarChar, carnet)
    .query("SELECT id_usuario FROM usuarios WHERE carnet = @carnet");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(DEFAULT_PASS, salt);

  if (existing.recordset.length > 0) {
    await pool.request()
      .input('carnet', sql.VarChar, carnet)
      .input('nombre', sql.VarChar, nombre)
      .input('correo', sql.VarChar, correo)
      .input('hash', sql.VarChar, hash)
      .input('idRol', sql.Int, idRol)
      .input('pais', sql.VarChar, pais)
      .query(`UPDATE usuarios SET nombre_completo=@nombre, correo=@correo, password_hash=@hash, id_rol=@idRol, pais=@pais, estado='A' WHERE carnet=@carnet`);
    console.log(`  UPDATE ${carnet} -> ${nombre} (rol ${idRol})`);
  } else {
    await pool.request()
      .input('carnet', sql.VarChar, carnet)
      .input('nombre', sql.VarChar, nombre)
      .input('correo', sql.VarChar, correo)
      .input('hash', sql.VarChar, hash)
      .input('idRol', sql.Int, idRol)
      .input('pais', sql.VarChar, pais)
      .query(`INSERT INTO usuarios (carnet, password_hash, nombre_completo, correo, id_rol, pais, estado, fecha_creacion) VALUES (@carnet, @hash, @nombre, @correo, @idRol, @pais, 'A', GETDATE())`);
    console.log(`  INSERT ${carnet} -> ${nombre} (rol ${idRol})`);
  }
}

async function main() {
  console.log(`[SYNC] Iniciando sincronización de usuarios...`);
  console.log(`[SYNC] Portal API: ${PORTAL_API}`);
  console.log(`[SYNC] DB destino: ${CLINICA_DB.server}:${CLINICA_DB.port}/${CLINICA_DB.database}`);

  const pool = await new sql.ConnectionPool(CLINICA_DB).connect();
  console.log(`[SYNC] Conectado a BD Clínica`);

  const portalUsers = await getPortalUsers();
  if (portalUsers && Array.isArray(portalUsers)) {
    console.log(`[SYNC] Obtenidos ${portalUsers.length} usuarios del Portal`);
    for (const u of portalUsers) {
      try { await upsertUser(pool, u); }
      catch (e) { console.error(`  ERROR ${u.carnet}: ${e.message}`); }
    }
  } else {
    console.log(`[SYNC] No se pudo obtener usuarios del Portal API`);
    process.exit(1);
  }

  const count = await pool.request().query("SELECT COUNT(*) as c FROM usuarios");
  console.log(`[SYNC] Total usuarios en Clínica: ${count.recordset[0].c}`);
  console.log(`[SYNC] Sincronización completada.`);
  await pool.close();
}

main().catch(e => { console.error(`[SYNC] Error: ${e.message}`); process.exit(1); });
