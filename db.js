const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Yoriel206',
    database: process.env.DB_NAME || 'panaderia',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

console.log('DB Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


module.exports = pool.promise(); // Exporta el pool con soporte para Promises
