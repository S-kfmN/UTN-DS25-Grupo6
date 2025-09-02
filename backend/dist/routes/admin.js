"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
// Crear el router para las rutas de administración
const router = (0, express_1.Router)();
console.log('🏢 Router de administración registrado');
// NOTA: Por ahora no aplicamos middleware de autenticación
// En el futuro se debe agregar middleware requireAdmin para todas las rutas
// import { requireAdmin } from '../middlewares/auth';
// router.use(requireAdmin);
// ========================================
// GESTIÓN DE USUARIOS (ADMIN)
// ========================================
// GET /api/admin/users - Obtener lista de usuarios
// Query params opcionales:
//   ?role=admin - Filtrar por rol
//   ?isActive=true - Solo usuarios activos
//   ?limit=50 - Límite de resultados
//   ?offset=0 - Desplazamiento para paginación
router.get('/users', adminController_1.getUsersList);
// GET /api/admin/users/:id - Obtener detalles completos de un usuario
// Incluye vehículos y reservas del usuario
router.get('/users/:id', adminController_1.getUserDetails);
// PUT /api/admin/users/:id - Actualizar usuario desde admin
// Body opcional: name, email, phone, role, isActive
router.put('/users/:id', adminController_1.updateUser);
// DELETE /api/admin/users/:id - Desactivar usuario (admin)
// Cambia isActive a false
router.delete('/users/:id', adminController_1.deactivateUser);
// ========================================
// GESTIÓN DE VEHÍCULOS (ADMIN)
// ========================================
// GET /api/admin/vehicles - Obtener lista de vehículos
// Query params opcionales:
//   ?brand=Renault - Filtrar por marca
//   ?isActive=true - Solo vehículos activos
//   ?limit=50 - Límite de resultados
//   ?offset=0 - Desplazamiento para paginación
router.get('/vehicles', adminController_1.getVehiclesList);
// ========================================
// GESTIÓN DE RESERVAS (ADMIN)
// ========================================
// GET /api/admin/reservations - Obtener lista de reservas
// Query params opcionales:
//   ?status=pending - Filtrar por estado
//   ?date=2024-01-15 - Filtrar por fecha
//   ?limit=50 - Límite de resultados
//   ?offset=0 - Desplazamiento para paginación
router.get('/reservations', adminController_1.getReservationsList);
// PUT /api/admin/reservations/:id - Actualizar reserva desde admin
// Body opcional: status, date, time, notes
router.put('/reservations/:id', adminController_1.updateReservation);
// ========================================
// GESTIÓN DE SERVICIOS (ADMIN)
// ========================================
// GET /api/admin/services - Obtener lista de servicios
// Query params opcionales:
//   ?category=mantenimiento - Filtrar por categoría
//   ?isActive=true - Solo servicios activos
//   ?limit=50 - Límite de resultados
//   ?offset=0 - Desplazamiento para paginación
router.get('/services', adminController_1.getServicesList);
// ========================================
// ESTADÍSTICAS Y SISTEMA
// ========================================
// GET /api/admin/stats - Obtener estadísticas generales del sistema
// Incluye: usuarios, vehículos, reservas, servicios, métricas financieras
router.get('/stats', adminController_1.getSystemStats);
// GET /api/admin/system - Obtener información del sistema
// Incluye: versión, uptime, memoria, plataforma, etc.
router.get('/system', adminController_1.getSystemInfo);
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
exports.default = router;
