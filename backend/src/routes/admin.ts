import { Router } from 'express';
import {
  // Gestión de usuarios
  getUsersList,           // READ - Lista de usuarios
  getUserDetails,         // READ - Detalles de usuario
  updateUser,             // UPDATE - Actualizar usuario
  deactivateUser,         // DELETE - Desactivar usuario

  // Gestión de vehículos
  getVehiclesList,        // READ - Lista de vehículos

  // Gestión de reservas
  getReservationsList,    // READ - Lista de reservas
  updateReservation,      // UPDATE - Actualizar reserva

  // Gestión de servicios
  getServicesList,        // READ - Lista de servicios

  // Estadísticas y sistema
  getSystemStats,         // READ - Estadísticas del sistema
  getSystemInfo           // READ - Información del sistema
} from '../controllers/adminController';
import { authenticate, authorize } from '../middlewares/auth.middleware'; // Importar middlewares de autenticación y autorización

// Crear el router para las rutas de administración
const router = Router();

console.log('🏢 Router de administración registrado');

// Aplicar middlewares de autenticación y autorización para todas las rutas de administración
router.use(authenticate, authorize('ADMIN'));

// ========================================
// GESTIÓN DE USUARIOS (ADMIN)
// ========================================

// GET /api/admin/users - Obtener lista de usuarios
// Query params opcionales:
//   ?role=admin - Filtrar por rol
//   ?isActive=true - Solo usuarios activos
//   ?limit=50 - Límite de resultados
//   ?offset=0 - Desplazamiento para paginación
router.get('/users', getUsersList);

// GET /api/admin/users/:id - Obtener detalles completos de un usuario
// Incluye vehículos y reservas del usuario
router.get('/users/:id', getUserDetails);

// PUT /api/admin/users/:id - Actualizar usuario desde admin
// Body opcional: name, email, phone, role, isActive
router.put('/users/:id', updateUser);

// DELETE /api/admin/users/:id - Desactivar usuario (admin)
// Cambia isActive a false
router.delete('/users/:id', deactivateUser);

// ========================================
// GESTIÓN DE VEHÍCULOS (ADMIN)
// ========================================

// GET /api/admin/vehicles - Obtener lista de vehículos
// Query params opcionales:
//   ?brand=Renault - Filtrar por marca
//   ?isActive=true - Solo vehículos activos
//   ?limit=50 - Límite de resultados
//   ?offset=0 - Desplazamiento para paginación
router.get('/vehicles', getVehiclesList);

// ========================================
// GESTIÓN DE RESERVAS (ADMIN)
// ========================================

// GET /api/admin/reservations - Obtener lista de reservas
// Query params opcionales:
//   ?status=pending - Filtrar por estado
//   ?date=2024-01-15 - Filtrar por fecha
//   ?limit=50 - Límite de resultados
//   ?offset=0 - Desplazamiento para paginación
router.get('/reservations', getReservationsList);

// PUT /api/admin/reservations/:id - Actualizar reserva desde admin
// Body opcional: status, date, time, notes
router.put('/reservations/:id', updateReservation);

// ========================================
// GESTIÓN DE SERVICIOS (ADMIN)
// ========================================

// GET /api/admin/services - Obtener lista de servicios
// Query params opcionales:
//   ?category=mantenimiento - Filtrar por categoría
//   ?isActive=true - Solo servicios activos
//   ?limit=50 - Límite de resultados
//   ?offset=0 - Desplazamiento para paginación
router.get('/services', getServicesList);

// ========================================
// ESTADÍSTICAS Y SISTEMA
// ========================================

// GET /api/admin/stats - Obtener estadísticas generales del sistema
// Incluye: usuarios, vehículos, reservas, servicios, métricas financieras
router.get('/stats', getSystemStats);

// GET /api/admin/system - Obtener información del sistema
// Incluye: versión, uptime, memoria, plataforma, etc.
router.get('/system', getSystemInfo);

// ========================================
// ORDEN DE LAS RUTAS - MUY IMPORTANTE
// ========================================
// Las rutas más específicas deben ir ANTES que las más genéricas
//
// ✅ CORRECTO:
// 1. /users (específica)
// 2. /users/:id (específica con parámetro)
// 3. /vehicles (específica)
// 4. /reservations (específica)
// 5. /reservations/:id (específica con parámetro)
// 6. /services (específica)
// 7. /stats (específica)
// 8. /system (específica)
//
// ❌ INCORRECTO:
// 1. /:id (genérica) - Esto capturaría todas las rutas con parámetros
// 2. /users (específica) - Nunca se ejecutaría

// ========================================
// ENDPOINTS FUTUROS (para implementar)
// ========================================

// FUTURO: Gestión de roles y permisos
// router.post('/users/:id/role', changeUserRole);
// router.get('/roles', getAvailableRoles);

// FUTURO: Gestión de horarios y disponibilidad
// router.get('/schedule', getSystemSchedule);
// router.put('/schedule', updateSystemSchedule);

// FUTURO: Reportes y exportación
// router.get('/reports/users', exportUsersReport);
// router.get('/reports/reservations', exportReservationsReport);
// router.get('/reports/financial', exportFinancialReport);

// FUTURO: Configuración del sistema
// router.get('/config', getSystemConfig);
// router.put('/config', updateSystemConfig);

// FUTURO: Logs y auditoría
// router.get('/logs', getSystemLogs);
// router.get('/logs/:type', getLogsByType);

export default router;

