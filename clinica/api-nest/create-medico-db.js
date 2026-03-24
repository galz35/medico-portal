const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.MSSQL_USER || 'sa',
    password: process.env.MSSQL_PASSWORD,
    server: process.env.MSSQL_HOST,
    port: parseInt(process.env.MSSQL_PORT || '1433', 10),
    options: {
        encrypt: process.env.MSSQL_ENCRYPT === 'true',
        trustServerCertificate: process.env.MSSQL_TRUST_CERT === 'true',
    },
};

async function createDatabase() {
    const dbName = process.env.MSSQL_DATABASE || 'medicoBD';
    try {
        console.log('Connectando a SQL Server...');
        await sql.connect(config);
        console.log('Conectado a master.');

        console.log(`Verificando si la base de datos ${dbName} existe...`);
        const result = await sql.query(`
      IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'${dbName}')
      BEGIN
          CREATE DATABASE [${dbName}];
          SELECT 'Creada' as estatus;
      END
      ELSE
      BEGIN
          SELECT 'Existe' as estatus;
      END
    `);

        if (result.recordset && result.recordset.length > 0) {
            if (result.recordset[0].estatus === 'Creada') {
                console.log(`Base de datos ${dbName} creada exitosamente.`);
            } else {
                console.log(`La base de datos ${dbName} ya existe.`);
            }
        } else {
            console.log(`Base de datos ${dbName} lista.`);
        }

    } catch (err) {
        console.error('Error al intentar crear la base de datos:', err);
    } finally {
        await sql.close();
    }
}

createDatabase();
