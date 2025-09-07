import { Router } from 'express';
import {
  createReservation,
  getUserReservations,
  getReservation,
  updateReservation,
  cancelReservation,
  getReservationsByDate,
  getAllReservations // Importar la nueva función
} from '../controllers/reservationController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

console.log('🚀 Router de reservas registrado');

// APLICAR MIDDLEWARE DE AUTENTICACIÓN A TODAS LAS RUTAS
router.use(authenticateToken);

// RUTAS PROTEGIDAS - Requieren autenticación
// POST /api/reservations - Crear nueva reserva
router.post('/', createReservation);

// GET /api/reservations - Obtener TODAS las reservas (solo para admin)
router.get('/', getAllReservations);

// GET /api/reservations/user/:userId - Obtener reservas de un usuario específico
router.get('/user/:userId', getUserReservations);

// GET /api/reservations/date/:date - Obtener reservas por fecha (para ver disponibilidad)
router.get('/date/:date', getReservationsByDate);

// PATCH /api/reservations/:id/cancel - Cancelar reserva (DEBE IR ANTES DE /:id)
router.patch('/:id/cancel', (req, res, next) => {
  console.log('🔍 Ruta cancel detectada:', req.method, req.path, req.params);
  console.log('🔍 URL completa:', req.originalUrl);
  console.log('🔍 Headers:', req.headers);
  next();
}, cancelReservation);

// GET /api/reservations/:id - Obtener reserva específica
router.get('/:id', getReservation);

// PUT /api/reservations/:id - Actualizar reserva
router.put('/:id', updateReservation);

export default router;

