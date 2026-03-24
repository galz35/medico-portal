const { Client } = require('pg');

const client = new Client({
    host: 'aws-1-us-east-2.pooler.supabase.com',
    port: 6543,
    user: 'postgres.ayyotvvjcwdoocdcouao',
    password: '92li!ra$Gu2',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
});

console.log('Connecting to database...');
client.connect()
    .then(() => {
        console.log('Connected successfully!');
        return client.end();
    })
    .catch(err => {
        console.error('Connection failed:', err.message, 'Code:', err.code);
        process.exit(1);
    });
