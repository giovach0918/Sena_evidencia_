const app = require('./app');
const { probarConexion } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

/**
 * Inicialización de la infraestructura del servidor
 * Cumple con el estándar de separación de responsabilidades:
 * - app.js: Configuración de la aplicación Express
 * - server.js: Conexión con base de datos y escucha del puerto HTTP
 */
async function iniciarServidor() {
    console.log('[Servidor] Iniciando entorno de ejecución...');

    // 1. Probar conexión con la base de datos MySQL
    const dbConectada = await probarConexion();
    if (!dbConectada) {
        console.warn('[AVISO] La base de datos no está respondiendo. Revisa tus credenciales en el archivo .env');
    }

    // 2. Levantar el servidor HTTP en el puerto configurado
    const server = app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(` Servidor corriendo en: http://localhost:${PORT}`);
        console.log(` Panel Administrativo: http://localhost:${PORT}/admin`);
        console.log(` Módulo de Productos:  http://localhost:${PORT}/api/products`);
        console.log(`====================================================`);
    });

    // 3. Manejo de apagado ordenado (Graceful Shutdown)
    process.on('SIGINT', () => {
        console.log('\n[Servidor] Deteniendo servidor HTTP de forma segura...');
        server.close(() => {
            console.log('[Servidor] Servidor detenido exitosamente.');
            process.exit(0);
        });
    });
}

iniciarServidor();
