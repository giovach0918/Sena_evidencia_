-- =============================================================
-- BASE DE DATOS: gl_hazlo_tuyo_db
-- Proyecto: Hazlo Tuyo
-- Evidencia SENA: GA7-220501096-AA2-EV01
-- =============================================================

-- 1. Crear base de datos con soporte completo de caracteres y emojis
CREATE DATABASE IF NOT EXISTS gl_hazlo_tuyo_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE gl_hazlo_tuyo_db;

-- 2. Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 3. Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category_id INT NOT NULL,
    price_cop DECIMAL(10, 2) NOT NULL,
    compare_price_cop DECIMAL(10, 2) DEFAULT NULL,
    description TEXT,
    main_image VARCHAR(255),
    rating DECIMAL(2, 1) DEFAULT 4.9,
    reviews_count INT DEFAULT 128,
    is_featured BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Tabla de Variantes (Colores, tamaños, tensiones)
CREATE TABLE IF NOT EXISTS product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    stock INT DEFAULT 30,
    CONSTRAINT fk_variants_product 
        FOREIGN KEY (product_id) REFERENCES products(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 5. Inserción de Datos Iniciales (Seed Data)
-- -------------------------------------------------------------

INSERT INTO categories (id, name, slug) VALUES
(1, 'Masajeadores', 'masajeadores'),
(2, 'Termos e Hidratación', 'termos'),
(3, 'Bandas de Resistencia', 'bandas'),
(4, 'Accesorios', 'accesorios')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO products (id, sku, name, slug, category_id, price_cop, compare_price_cop, description, main_image, is_featured) VALUES
('gl-facial-ay1688', 'GL-FACIAL-AY1688', 'Masajeador facial y anti-papada (Ref. AY-1688)', 'producto-ay1688', 1, 89900.00, 129900.00, 'Dispositivo ergonómico para estimular la circulación, reafirmar la piel y reducir la tensión en mandíbula y cuello.', 'assets/prod-facial.jpg', 1),
('gl-cuello-jt600', 'GL-CUELLO-JT600', 'Masajeador de cuello y cervical (Ref. JT-600)', 'producto-jt600', 1, 119900.00, 169900.00, 'Diseño curvo que se adapta al cuello, proporcionando alivio rápido para la tensión cervical con calor relajante.', 'assets/prod-cuello.jpg', 1),
('gl-pistola-pro', 'GL-PISTOLA-PRO', 'Pistola de Masaje Muscular Profundo Pro', 'producto-pistola-pro', 1, 149900.00, 219900.00, 'Herramienta de percusión de grado profesional para recuperación muscular y relajación miofascial.', 'assets/prod-pistola.jpg', 1),
('gl-termo-led-negro', 'GL-TERMO-LED-NEGRO', 'Termo Inteligente LED 500ml - Negro', 'producto-termo-led-negro', 2, 59900.00, 89900.00, 'Termo de acero inoxidable con pantalla LED táctil que indica la temperatura.', 'assets/prod-termo-led.jpg', 1),
('gl-termo-sport-1l', 'GL-TERMO-SPORT-1L', 'Termo Deportivo de Acero 1L', 'producto-termo-sport', 2, 79900.00, 109900.00, 'Termo de gran capacidad ideal para entrenamientos largos con doble pared al vacío.', 'assets/prod-termo-sport.jpg', 0),
('gl-botella-motivacional', 'GL-BOTELLA-MOTIVACIONAL', 'Botella Motivacional 2L', 'producto-botella-motivacional', 2, 39900.00, 59900.00, 'Botella deportiva con marcas de tiempo para asegurar tu hidratación diaria libre de BPA.', 'assets/prod-botella.jpg', 0),
('gl-bandas-set5', 'GL-BANDAS-SET5', 'Set de 5 Bandas Elásticas de Látex', 'producto-bandas-set5', 3, 29900.00, 49900.00, 'Set completo con 5 niveles de resistencia para entrenar todo el cuerpo en casa.', 'assets/prod-bandas-set.jpg', 0),
('gl-banda-tela-gluteos', 'GL-BANDA-TELA-GLUTEOS', 'Banda de Tela Antideslizante (Glúteos)', 'producto-banda-tela', 3, 35900.00, 55900.00, 'Banda gruesa de tela que no se enrolla. Ideal para activación de glúteos y piernas.', 'assets/prod-banda-tela.jpg', 1),
('gl-banda-tubular', 'GL-BANDA-TUBULAR', 'Banda Tubular con Asas de Alta Tensión', 'producto-banda-tubular', 3, 45900.00, 69900.00, 'Banda tubular reforzada con agarres cómodos. Excelente alternativa a las pesas.', 'assets/prod-banda-tubular.jpg', 0),
('gl-foam-roller', 'GL-FOAM-ROLLER', 'Foam Roller Texturizado', 'producto-foam-roller', 4, 55900.00, 85900.00, 'Herramienta esencial para la liberación miofascial y movilidad.', 'assets/prod-foam-roller.jpg', 0),
('gl-pelota-corcho', 'GL-PELOTA-CORCHO', 'Pelota de Masaje de Corcho Natural', 'producto-pelota-corcho', 4, 25000.00, 39900.00, 'Perfecta para tratar puntos gatillo difíciles de alcanzar en pies y espalda.', 'assets/prod-pelota-corcho.jpg', 0),
('gl-yoga-mat', 'GL-YOGA-MAT', 'Tapete de Yoga Antideslizante 6mm', 'producto-yoga-mat', 4, 65000.00, 99000.00, 'Colchoneta de alta densidad ecológica que brinda estabilidad con líneas de alineación.', 'assets/prod-yoga-mat.jpg', 0)
ON DUPLICATE KEY UPDATE name=VALUES(name), price_cop=VALUES(price_cop);

INSERT INTO product_variants (product_id, name, stock) VALUES
('gl-facial-ay1688', 'Rosa Palo', 25),
('gl-facial-ay1688', 'Blanco Perla', 25),
('gl-cuello-jt600', 'Blanco Clásico', 20),
('gl-cuello-jt600', 'Azul Marino', 20),
('gl-pistola-pro', 'Negro Mate', 30),
('gl-pistola-pro', 'Gris Titanio', 30),
('gl-termo-led-negro', 'Negro', 40),
('gl-termo-led-negro', 'Azul Marino', 40),
('gl-termo-sport-1l', 'Plata', 25),
('gl-termo-sport-1l', 'Negro', 25),
('gl-botella-motivacional', 'Gradiente Rosa/Azul', 50),
('gl-botella-motivacional', 'Gradiente Verde/Morado', 50),
('gl-bandas-set5', 'Multicolor', 60),
('gl-bandas-set5', 'Kit Pasteles', 60),
('gl-banda-tela-gluteos', 'Negro (Heavy)', 50),
('gl-banda-tela-gluteos', 'Gris (Medium)', 50),
('gl-banda-tubular', 'Negro (50 lbs)', 30),
('gl-banda-tubular', 'Rojo (30 lbs)', 30),
('gl-foam-roller', 'Negro', 25),
('gl-foam-roller', 'Azul', 25),
('gl-pelota-corcho', 'Corcho Natural', 35),
('gl-pelota-corcho', 'Corcho Texturizado', 35),
('gl-yoga-mat', 'Verde Oliva', 20),
('gl-yoga-mat', 'Púrpura', 20);
