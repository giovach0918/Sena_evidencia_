const { Router } = require('express');
const ProductController = require('../controllers/productController');

const router = Router();

/**
 * Rutas del Módulo de Productos (CRUD)
 * Evidencia: GA7-220501096-AA2-EV01
 */

// 1. Consulta: Listar todos los productos
router.get('/', ProductController.listarProductos);

// 2. Consulta: Obtener un producto por ID
router.get('/:id', ProductController.obtenerProductoPorId);

// 3. Inserción: Crear un nuevo producto
router.post('/', ProductController.crearProducto);

// 4. Actualización: Modificar un producto existente por ID
router.put('/:id', ProductController.actualizarProducto);

// 5. Eliminación: Borrar un producto por ID
router.delete('/:id', ProductController.eliminarProducto);

module.exports = router;
