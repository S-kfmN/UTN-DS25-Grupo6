"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
// Crear el router para las rutas de servicios
const router = (0, express_1.Router)();
console.log('🚀 Router de servicios registrado');
// NOTA: Por ahora no aplicamos middleware de autenticación
// porque queremos que los clientes puedan ver los servicios disponibles
// En el futuro se puede agregar autenticación para crear/editar/eliminar
// ========================================
// RUTAS PÚBLICAS (sin autenticación)
// ========================================
// GET /api/services - Obtener todos los servicios
// Query params opcionales:
//   ?active=true - Solo servicios activos
//   ?active=false - Solo servicios inactivos
//   Sin parámetro - Todos los servicios
router.get('/', serviceController_1.getAllServices);
// GET /api/services/stats - Obtener estadísticas de servicios
// Retorna: total, activos, inactivos
router.get('/stats', serviceController_1.getServiceStats);
// GET /api/services/search - Buscar servicios por nombre
// Query params: ?q=termino_busqueda
// Ejemplo: /api/services/search?q=aceite
router.get('/search', serviceController_1.searchServices);
// GET /api/services/category/:category - Obtener servicios por categoría
// Categorías válidas: mantenimiento, reparacion, diagnostico, limpieza, otros
// Ejemplo: /api/services/category/mantenimiento
router.get('/category/:category', serviceController_1.getServicesByCategory);
// GET /api/services/:id - Obtener servicio específico por ID
// Ejemplo: /api/services/1
router.get('/:id', serviceController_1.getServiceById);
// ========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ========================================
// NOTA: En el futuro se puede agregar middleware de autenticación aquí
// POST /api/services - Crear nuevo servicio
// Body requerido: name, description, price, duration, category
// Body opcional: isActive
router.post('/', serviceController_1.createService);
// PUT /api/services/:id - Actualizar servicio existente
// Body opcional: name, description, price, duration, category, isActive
// Ejemplo: /api/services/1
router.put('/:id', serviceController_1.updateService);
// DELETE /api/services/:id - Eliminar servicio (cambiar a inactivo)
// Ejemplo: /api/services/1
router.delete('/:id', serviceController_1.deleteService);
// DELETE /api/services/:id/hard - Eliminación física (solo para admin)
// Ejemplo: /api/services/1/hard
router.delete('/:id/hard', serviceController_1.hardDeleteService);
// ========================================
// ORDEN DE LAS RUTAS - MUY IMPORTANTE
// ========================================
// Las rutas más específicas deben ir ANTES que las más genéricas
// 
//CORRECTO:
// 1. /stats (específica)
// 2. /search (específica)  
// 3. /category/:category (específica)
// 4. /:id (genérica)
// 5. / (genérica)
//
// INCORRECTO:
// 1. /:id (genérica) - Esto capturaría /stats, /search, etc.
// 2. /stats (específica) - Nunca se ejecutaría
exports.default = router;
