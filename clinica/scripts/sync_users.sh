#!/bin/bash
# Sincroniza usuarios del Portal Central a Clínica
# 1. Asigna password local a usuarios SSO-provisionados
# 2. Los usuarios pueden entrar con carnet + Cl2026!Pass
# Ejecutar diariamente vía cron

set -Eeuo pipefail
cd /opt/apps/medico-portal/clinica/api-nest

LOG_FILE="/var/log/clinica-sync-users.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

log "=== INICIO SYNC ==="

node -e "
const sql = require('mssql');
const bcrypt = require('bcrypt');

async function main() {
  const pool = await new sql.ConnectionPool({
    server: process.env.MSSQL_HOST || 'localhost',
    port: parseInt(process.env.MSSQL_PORT || '1433'),
    user: process.env.MSSQL_USER || 'sa',
    password: process.env.MSSQL_PASSWORD || 'TuPasswordFuerte!2026',
    database: process.env.MSSQL_DATABASE || 'medicoBD',
    options: { encrypt: false, trustServerCertificate: true }
  }).connect();

  // Usuarios sin password local (PORTAL_SSO, PORTAL_LOGIN_ONLY)
  const sinPass = await pool.request()
    .query(\"SELECT id_usuario, carnet, nombre_completo FROM usuarios WHERE password_hash LIKE 'PORTAL_%'\");
  
  if (sinPass.recordset.length > 0) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Cl2026!Pass', salt);
    for (const u of sinPass.recordset) {
      await pool.request()
        .input('id', sql.Int, u.id_usuario)
        .input('hash', sql.VarChar, hash)
        .query('UPDATE usuarios SET password_hash = @hash WHERE id_usuario = @id');
      console.log('PASSWORD #' + u.id_usuario + ' ' + u.carnet + ' - ' + u.nombre_completo);
    }
  }

  // Usuarios que entraron por SSO y no tienen carnet mayuscula (normalizar)
  await pool.request().query(\"UPDATE usuarios SET carnet = UPPER(carnet) WHERE carnet != UPPER(carnet)\");

  const total = await pool.request().query('SELECT COUNT(*) as c FROM usuarios');
  console.log('TOTAL usuarios: ' + total.recordset[0].c);
  await pool.close();
}

main().catch(e => { console.error('ERROR: ' + e.message); process.exit(1); });
" 2>&1 | while IFS= read -r line; do log "$line"; done

log "=== FIN SYNC ==="
