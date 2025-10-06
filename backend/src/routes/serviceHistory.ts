import { Router } from 'express';
import { 
  createServiceHistory,           // CREATE - Registrar nuevo servicio en historial
  getServiceHistoryByVehicle,     // READ - Obtener historial por vehículo (patente)
  getServiceHistoryByUser,       // READ - Obtener historial por usuario
  getAllServiceHistory,           // READ - Obtener todo el historial (solo ADMIN)
  getServiceHistoryStats,        // READ - Obtener estadísticas del historial
  updateServiceHistory,          // UPDATE - Actualizar registro del historial
  deleteServiceHistory           // DELETE - Eliminar registro del historial
} from '../controllers/serviceHistoryController';
import { authenticate, authorize } from '../middlewares/auth.middleware';

// Crear el router para las rutas del historial de servicios
const router = Router();

console.log('🚀 Router de historial de servicios registrado');

// ========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ========================================

// POST /api/services/history - Registrar nuevo servicio en el historial
// Solo para roles ADMIN y MECHANIC
// Body requerido: userId, vehicleId, serviceId, resultado, observaciones, kilometraje, mecanico, registradoPor
// Body opcional: reservationId, repuestos
router.post('/history', authenticate, authorize('ADMIN', 'MECHANIC'), createServiceHistory);

// GET /api/services/history/vehicle - Obtener historial por vehículo (patente)
// Query params: ?patente=ABC123
// Accesible para ADMIN y propietario del vehículo
router.get('/history/vehicle', authenticate, getServiceHistoryByVehicle);

// GET /api/services/history/user/:userId - Obtener historial por usuario
// Solo para ADMIN o el propio usuario
router.get('/history/user/:userId', authenticate, getServiceHistoryByUser);

// GET /api/services/history/all - Obtener todo el historial de servicios
// Solo para ADMIN
// Query params opcionales: ?page=1&limit=50&fechaDesde=2024-01-01&fechaHasta=2024-12-31&resultado=Completado
router.get('/history/all', authenticate, authorize('ADMIN'), getAllServiceHistory);

// GET /api/services/history/stats - Obtener estadísticas del historial
// Query params opcionales: ?patente=ABC123&fechaDesde=2024-01-01&fechaHasta=2024-12-31
// Accesible para ADMIN y propietario del vehículo (si se especifica patente)
router.get('/history/stats', authenticate, getServiceHistoryStats);

// PUT /api/services/history/:id - Actualizar registro del historial
// Solo para ADMIN
router.put('/history/:id', authenticate, authorize('ADMIN'), updateServiceHistory);

// DELETE /api/services/history/:id - Eliminar registro del historial
// Solo para ADMIN
router.delete('/history/:id', authenticate, authorize('ADMIN'), deleteServiceHistory);

export const serviceHistoryRoutes = router;
