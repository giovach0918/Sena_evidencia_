const ProductModel = require('../models/productModel');

/**
 * Controlador para la gestión del módulo de Productos
 * Contiene la lógica de negocio para las operaciones CRUD.
 */
class ProductController {
    /**
     * Consulta: Listar todos los productos
     * GET /api/products
     */
    static async listarProductos(req, res) {
        try {
            const productos = await ProductModel.findAll();
            return res.status(200).json({
                success: true,
                total: productos.length,
                data: productos
            });
        } catch (error) {
            console.error('[ProductController - listarProductos]:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al consultar productos',
                error: error.message
            });
        }
    }

    /**
     * Consulta: Obtener un producto por su ID
     * GET /api/products/:id
     */
    static async obtenerProductoPorId(req, res) {
        try {
            const { id } = req.params;
            const producto = await ProductModel.findById(id);

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el producto con ID: '${id}'`
                });
            }

            return res.status(200).json({
                success: true,
                data: producto
            });
        } catch (error) {
            console.error('[ProductController - obtenerProductoPorId]:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al consultar el producto',
                error: error.message
            });
        }
    }

    /**
     * Inserción: Registrar un nuevo producto
     * POST /api/products
     */
    static async crearProducto(req, res) {
        try {
            const {
                id,
                sku,
                name,
                slug,
                category_id,
                price_cop,
                compare_price_cop,
                description,
                main_image,
                is_featured,
                in_stock
            } = req.body;

            // Validaciones básicas de campos obligatorios
            if (!sku || !name || !category_id || price_cop === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos sku, name, category_id y price_cop son obligatorios'
                });
            }

            // Generar ID y slug si no vienen en la petición
            const cleanSku = sku.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const finalId = id || (cleanSku.startsWith('gl-') ? cleanSku : `gl-${cleanSku}`);
            const finalSlug = slug || name.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            // Validar si ya existe el ID, SKU o Slug
            const existente = await ProductModel.findById(finalId);
            if (existente) {
                return res.status(409).json({
                    success: false,
                    message: `Ya existe un producto con el ID '${finalId}'`
                });
            }

            const coincidencia = await ProductModel.findBySkuOrSlug(sku, finalSlug);
            if (coincidencia) {
                return res.status(409).json({
                    success: false,
                    message: `Ya existe un producto con el SKU '${sku}' o el slug '${finalSlug}'`
                });
            }

            const nuevoProducto = await ProductModel.create({
                id: finalId,
                sku,
                name,
                slug: finalSlug,
                category_id: Number(category_id),
                price_cop: Number(price_cop),
                compare_price_cop: compare_price_cop ? Number(compare_price_cop) : null,
                description,
                main_image,
                is_featured: Boolean(is_featured),
                in_stock: in_stock !== undefined ? Boolean(in_stock) : true
            });

            return res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: nuevoProducto
            });
        } catch (error) {
            console.error('[ProductController - crearProducto]:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al registrar el producto en la base de datos',
                error: error.message
            });
        }
    }

    /**
     * Actualización: Modificar un producto existente
     * PUT /api/products/:id
     */
    static async actualizarProducto(req, res) {
        try {
            const { id } = req.params;
            const productoActual = await ProductModel.findById(id);

            if (!productoActual) {
                return res.status(404).json({
                    success: false,
                    message: `No se puede actualizar. El producto con ID '${id}' no existe`
                });
            }

            const {
                sku,
                name,
                slug,
                category_id,
                price_cop,
                compare_price_cop,
                description,
                main_image,
                is_featured,
                in_stock
            } = req.body;

            // Usar datos nuevos o mantener los existentes
            const datosActualizados = {
                sku: sku || productoActual.sku,
                name: name || productoActual.name,
                slug: slug || productoActual.slug,
                category_id: category_id !== undefined ? Number(category_id) : productoActual.category_id,
                price_cop: price_cop !== undefined ? Number(price_cop) : productoActual.price_cop,
                compare_price_cop: compare_price_cop !== undefined ? Number(compare_price_cop) : productoActual.compare_price_cop,
                description: description !== undefined ? description : productoActual.description,
                main_image: main_image !== undefined ? main_image : productoActual.main_image,
                is_featured: is_featured !== undefined ? Boolean(is_featured) : productoActual.is_featured,
                in_stock: in_stock !== undefined ? Boolean(in_stock) : productoActual.in_stock
            };

            const productoModificado = await ProductModel.update(id, datosActualizados);

            return res.status(200).json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: productoModificado
            });
        } catch (error) {
            console.error('[ProductController - actualizarProducto]:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el producto en la base de datos',
                error: error.message
            });
        }
    }

    /**
     * Eliminación: Borrar un producto por su ID
     * DELETE /api/products/:id
     */
    static async eliminarProducto(req, res) {
        try {
            const { id } = req.params;
            const productoActual = await ProductModel.findById(id);

            if (!productoActual) {
                return res.status(404).json({
                    success: false,
                    message: `No se puede eliminar. El producto con ID '${id}' no existe`
                });
            }

            await ProductModel.delete(id);

            return res.status(200).json({
                success: true,
                message: `Producto '${productoActual.name}' (${id}) eliminado correctamente`
            });
        } catch (error) {
            console.error('[ProductController - eliminarProducto]:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar el producto de la base de datos',
                error: error.message
            });
        }
    }
}

module.exports = ProductController;
