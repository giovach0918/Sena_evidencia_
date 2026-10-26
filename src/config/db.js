const mysql = require("mysql2/promise");
require("dotenv").config();

// 1. Crear el pool con las configuraciones completas
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

// 2. Función asíncrona para verificar que todo funciona
async function probarConexion() {
    try {
        console.log(`[BD] Intentando conectar a MySQL (${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT})...`);
        const conexion = await pool.getConnection();

        console.log('[BD] Conexión exitosa a MySQL');
        console.log(`[BD] Base de datos: ${process.env.DB_NAME} en ${process.env.DB_HOST}:${process.env.DB_PORT}`);

        conexion.release();
        return true;
    } catch (error) {
        console.error('[BD] ERROR: no se pudo conectar a MySQL');
        console.error(`[BD] Detalle: ${error.message}`);
        console.error(`[BD] Código: ${error.code} (${error.errno})`);
        return false;
    }
}

// 3. Exportar el pool y la función para usarlos en otros archivos
module.exports = { pool, probarConexion };
