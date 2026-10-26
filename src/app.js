const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { probarConexion } = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// Middlewares globales
// ==========================================
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Archivos estáticos y panel web
// ==========================================
// 1. Servir carpeta public local del proyecto
const publicLocal = path.join(__dirname, '../public');
app.use(express.static(publicLocal));

// 2. Conexión con Frontend externo Hazlo Tuyo (si existe en el entorno)
const frontendPath = path.resolve(__dirname, '../../gl_hazlo_tuyo_page');
if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
}

// Ruta directa para el panel administrativo
app.get('/admin', (req, res) => {
    if (fs.existsSync(path.join(publicLocal, 'index.html'))) {
        return res.sendFile(path.join(publicLocal, 'index.html'));
    }
    if (fs.existsSync(frontendPath)) {
        return res.sendFile(path.join(frontendPath, 'pages', 'admin-productos.html'));
    }
    res.redirect('/');
});

// ==========================================
// Rutas de la API
// ==========================================
app.use('/api/products', productRoutes);

// Ruta raíz informativa
app.get('/', (req, res) => {
    res.status(200).json({
        proyecto: 'Hazlo Tuyo - Sistema E-Commerce',
        evidencia: 'GA7-220501096-AA2-EV01. Codificación de módulos del software',
        modulo: 'Módulo de Productos (CRUD)',
        endpoints: {
            panelWeb: 'GET /admin',
            listar: 'GET /api/products',
            obtenerPorId: 'GET /api/products/:id',
            crear: 'POST /api/products',
            actualizar: 'PUT /api/products/:id',
            eliminar: 'DELETE /api/products/:id'
        },
        estado: 'Servidor y API en funcionamiento'
    });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `La ruta '${req.originalUrl}' no existe en este servidor`
    });
});

// ==========================================
// Inicio del Servidor
// ==========================================
async function iniciarServidor() {
    // 1. Verificar conexión a MySQL
    const dbOk = await probarConexion();
    if (!dbOk) {
        console.warn('[AVISO] La base de datos no está respondiendo. Revisa tus credenciales en el archivo .env');
    }

    // 2. Levantar servidor Express
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(` Servidor corriendo en: http://localhost:${PORT}`);
        console.log(` Panel Administrativo: http://localhost:${PORT}/admin`);
        console.log(` Módulo de Productos:  http://localhost:${PORT}/api/products`);
        console.log(`====================================================`);
    });
}

iniciarServidor();

module.exports = app;
