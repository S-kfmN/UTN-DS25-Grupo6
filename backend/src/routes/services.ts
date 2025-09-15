import { Router } from 'express';
import { 
  createService,           // CREATE - Crear nuevo servicio
  getAllServices,          // READ - Obtener todos los servicios
  getServiceById,          // READ - Obtener servicio por ID
  getServicesByCategory,   // READ - Obtener servicios por categoría
  searchServices,          // READ - Buscar servicios por nombre
  updateService,           // UPDATE - Actualizar servicio existente
  deleteService,           // DELETE - Eliminar servicio (cambiar a inactivo)
  hardDeleteService,       // DELETE - Eliminación física (solo admin)
  getServiceStats          // READ - Obtener estadísticas
} from '../controllers/serviceController';
import { authenticate, authorize } from '../middlewares/auth.middleware';

// Crear el router para las rutas de servicios
const router = Router();

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
router.get('/', getAllServices);

// GET /api/services/stats - Obtener estadísticas de servicios
// Retorna: total, activos, inactivos
router.get('/stats', getServiceStats);

// GET /api/services/search - Buscar servicios por nombre
// Query params: ?q=termino_busqueda
// Ejemplo: /api/services/search?q=aceite
router.get('/search', searchServices);

// GET /api/services/category/:category - Obtener servicios por categoría
// Categorías válidas: mantenimiento, reparacion, diagnostico, limpieza, otros
// Ejemplo: /api/services/category/mantenimiento
router.get('/category/:category', getServicesByCategory);

// GET /api/services/:id - Obtener servicio específico por ID
// Ejemplo: /api/services/1
router.get('/:id', getServiceById);

// ========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ========================================

// POST /api/services - Crear nuevo servicio (solo para roles Admin)
// Body requerido: name, description, price, duration, category
// Body opcional: isActive
router.post('/', authenticate, authorize('ADMIN'), createService);

// PUT /api/services/:id - Actualizar servicio existente (solo para roles Admin)
// Body opcional: name, description, price, duration, category, isActive
// Ejemplo: /api/services/1
router.put('/:id', authenticate, authorize('ADMIN'), updateService);

// DELETE /api/services/:id - Eliminar servicio (cambiar a inactivo) (solo para roles Admin)
// Ejemplo: /api/services/1
router.delete('/:id', authenticate, authorize('ADMIN'), deleteService);

// DELETE /api/services/:id/hard - Eliminación física (solo para roles Admin)
// Ejemplo: /api/services/1/hard
router.delete('/:id/hard', authenticate, authorize('ADMIN'), hardDeleteService);

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

export const serviceRoutes = router;