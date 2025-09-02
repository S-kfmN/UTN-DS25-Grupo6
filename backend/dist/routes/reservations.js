"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservationController_1 = require("../controllers/reservationController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
console.log('🚀 Router de reservas registrado');
// APLICAR MIDDLEWARE DE AUTENTICACIÓN A TODAS LAS RUTAS
router.use(auth_1.authenticateToken);
// RUTAS PROTEGIDAS - Requieren autenticación
// POST /api/reservations - Crear nueva reserva
router.post('/', reservationController_1.createReservation);
// GET /api/reservations - Obtener reservas del usuario
router.get('/', reservationController_1.getUserReservations);
// GET /api/reservations/date/:date - Obtener reservas por fecha (para ver disponibilidad)
router.get('/date/:date', reservationController_1.getReservationsByDate);
// PATCH /api/reservations/:id/cancel - Cancelar reserva (DEBE IR ANTES DE /:id)
router.patch('/:id/cancel', (req, res, next) => {
    console.log('🔍 Ruta cancel detectada:', req.method, req.path, req.params);
    console.log('🔍 URL completa:', req.originalUrl);
    console.log('🔍 Headers:', req.headers);
    next();
}, reservationController_1.cancelReservation);
// GET /api/reservations/:id - Obtener reserva específica
router.get('/:id', reservationController_1.getReservation);
// PUT /api/reservations/:id - Actualizar reserva
router.put('/:id', reservationController_1.updateReservation);
exports.default = router;
