const mysql = require("mysql2/promise");

const env = require("./env");

const pool = mysql.createPool({
    host: env.database.host,
    port: env.database.port,
    database: env.database.name,
    user: env.database.user,
    password: env.database.password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    const connection = await pool.getConnection();

    try {
        await connection.query("SELECT 1");
    } finally {
        connection.release();
    }
}

module.exports = {
    pool,
    testConnection
};