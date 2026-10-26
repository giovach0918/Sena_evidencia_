# Evidencia GA7-220501096-AA2-EV01: Codificación de Módulos del Software

**Programa de Formación:** Análisis y Desarrollo de Software (ADSO) - SENA  
**Proyecto:** Hazlo Tuyo (E-Commerce)  
**Módulo Codificado:** Módulo de Gestión de Productos (CRUD Completo)  
**Tecnologías:** Node.js, Express.js, MySQL (conector `mysql2`), Dotenv, CORS, Morgan.

---

## 1. Descripción del Módulo
El presente módulo implementa la lógica de backend para la administración del catálogo de productos de la tienda virtual **Hazlo Tuyo**. Cuenta con una arquitectura en capas (Modelo - Controlador - Rutas), cumpliendo con estándares de codificación y buenas prácticas de seguridad mediante consultas preparadas contra inyección SQL.

### Funcionalidades implementadas (CRUD):
1. **Inserción (Create):** Creación de nuevos productos con validación de SKU, Slug y categoría foránea.
2. **Consulta (Read):**
   - Listado general de productos con su categoría asociada (`JOIN`).
   - Consulta individual por identificador (`id`).
3. **Actualización (Update):** Modificación parcial o total de los datos de un producto.
4. **Eliminación (Delete):** Borrado físico de un producto en base de datos.

---

## 2. Estructura del Proyecto

```text
├── database.sql               # Script DDL y DML para restaurar la base de datos
├── pruebas_api.http           # Archivo de pruebas de endpoints (REST Client / Thunder Client)
├── package.json               # Configuración de dependencias y scripts de inicio
├── .env.example               # Plantilla de variables de entorno
├── .gitignore                 # Exclusión de node_modules y .env
├── repositorio.txt            # Enlace al repositorio de Git/GitHub (requerido por el SENA)
└── src/
    ├── app.js                 # Punto de entrada de la aplicación Express
    ├── config/
    │   └── db.js              # Configuración del Pool de conexiones a MySQL
    ├── controllers/
    │   └── productController.js # Lógica de negocio y manejo de peticiones HTTP
    ├── models/
    │   └── productModel.js     # Capa de acceso a datos y consultas SQL
    └── routes/
        └── productRoutes.js    # Definición de rutas y verbos HTTP
```

---

## 3. Instrucciones de Instalación y Ejecución

### Prerrequisitos:
- Node.js versión 18 o superior.
- Servidor MySQL activo con la base de datos `gl_hazlo_tuyo_db`.

### Pasos:
1. **Restaurar la base de datos:**
   Ejecutar el script [`database.sql`](file:///c:/Antigravity_proyectos/Sena_evidencia_/database.sql) en su cliente MySQL (phpMyAdmin, MySQL Workbench, DBeaver o terminal).

2. **Configurar variables de entorno:**
   Crear un archivo `.env` basado en `.env.example`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=gl_hazlo_tuyo_db
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   O en producción:
   ```bash
   npm start
   ```

---

## 4. Endpoints de la API

| Método | Endpoint | Descripción | Código Éxito |
|---|---|---|---|
| `GET` | `/` | Información del servicio | `200 OK` |
| `GET` | `/api/products` | Consultar todos los productos | `200 OK` |
| `GET` | `/api/products/:id` | Consultar un producto por ID | `200 OK` |
| `POST` | `/api/products` | Insertar un nuevo producto | `201 Created` |
| `PUT` | `/api/products/:id` | Actualizar un producto existente | `200 OK` |
| `DELETE` | `/api/products/:id` | Eliminar un producto | `200 OK` |

---

## 5. Estándares de Codificación Aplicados
- **Nomenclatura CamelCase:** Para variables, funciones y métodos (`listarProductos`, `obtenerProductoPorId`).
- **Nomenclatura PascalCase:** Para clases y modelos (`ProductModel`, `ProductController`).
- **Separación de responsabilidades:** Arquitectura desacoplada en modelos, controladores y rutas.
- **Manejo de estados HTTP:** Uso adecuado de `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found` y `500 Internal Server Error`.
