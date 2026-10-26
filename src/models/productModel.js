const { pool } = require('../config/db');

/**
 * Modelo para la entidad Producto (products)
 * Cumple con los requerimientos de la evidencia SENA GA7-220501096-AA2-EV01
 * Manejo de consultas SQL preparadas para seguridad contra inyección SQL.
 */
class ProductModel {
    /**
     * Consultar todos los productos con el nombre de su categoría
     */
    static async findAll() {
        const query = `
            SELECT 
                p.id,
                p.sku,
                p.name,
                p.slug,
                p.category_id,
                c.name AS category_name,
                p.price_cop,
                p.compare_price_cop,
                p.description,
                p.main_image,
                p.rating,
                p.reviews_count,
                p.is_featured,
                p.in_stock,
                p.created_at
            FROM products p
            INNER JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await pool.query(query);
        return rows;
    }

    /**
     * Consultar un producto por su identificador (ID)
     */
    static async findById(id) {
        const query = `
            SELECT 
                p.id,
                p.sku,
                p.name,
                p.slug,
                p.category_id,
                c.name AS category_name,
                p.price_cop,
                p.compare_price_cop,
                p.description,
                p.main_image,
                p.rating,
                p.reviews_count,
                p.is_featured,
                p.in_stock,
                p.created_at
            FROM products p
            INNER JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        return rows[0] || null;
    }

    /**
     * Consultar producto por SKU o Slug (útil para validaciones de unicidad)
     */
    static async findBySkuOrSlug(sku, slug) {
        const query = `SELECT id, sku, slug FROM products WHERE sku = ? OR slug = ? LIMIT 1`;
        const [rows] = await pool.query(query, [sku, slug]);
        return rows[0] || null;
    }

    /**
     * Inserción: Crear un nuevo producto en la base de datos
     */
    static async create(data) {
        const query = `
            INSERT INTO products (
                id, sku, name, slug, category_id, 
                price_cop, compare_price_cop, description, 
                main_image, is_featured, in_stock
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.id,
            data.sku,
            data.name,
            data.slug,
            data.category_id,
            data.price_cop,
            data.compare_price_cop || null,
            data.description || null,
            data.main_image || null,
            data.is_featured ? 1 : 0,
            data.in_stock !== undefined ? (data.in_stock ? 1 : 0) : 1
        ];

        await pool.query(query, values);
        return await this.findById(data.id);
    }

    /**
     * Actualización: Modificar los datos de un producto existente
     */
    static async update(id, data) {
        const query = `
            UPDATE products SET
                sku = ?,
                name = ?,
                slug = ?,
                category_id = ?,
                price_cop = ?,
                compare_price_cop = ?,
                description = ?,
                main_image = ?,
                is_featured = ?,
                in_stock = ?
            WHERE id = ?
        `;
        const values = [
            data.sku,
            data.name,
            data.slug,
            data.category_id,
            data.price_cop,
            data.compare_price_cop || null,
            data.description || null,
            data.main_image || null,
            data.is_featured ? 1 : 0,
            data.in_stock ? 1 : 0,
            id
        ];

        const [result] = await pool.query(query, values);
        if (result.affectedRows === 0) return null;
        return await this.findById(id);
    }

    /**
     * Eliminación: Borrar un producto de la base de datos por su ID
     */
    static async delete(id) {
        const query = `DELETE FROM products WHERE id = ?`;
        const [result] = await pool.query(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = ProductModel;
