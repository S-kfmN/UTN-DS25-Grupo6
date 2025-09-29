import { Router } from 'express';
import {
  createReservation,
  getUserReservations,
  getReservation,
  updateReservation,
  cancelReservation,
  getReservationsByDate,
  getAllReservations,
  deleteReservation
} from '../controllers/reservationController';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

console.log('🚀 Router de reservas registrado');

// RUTAS PROTEGIDAS - Requieren autenticación
// POST /api/reservations - Crear nueva reserva (Admite roles Admin y Users)
router.post('/', authenticate, authorize('ADMIN', 'USER'), createReservation);

// GET /api/reservations - Obtener reservas del usuario autenticado (para usuarios normales) o TODAS las reservas (para admin)
router.get('/', authenticate, authorize('ADMIN', 'USER'), (req, res) => {
  const userRole = req.user!.role;
  const userId = req.query.userId || req.params.userId;

  if (userRole === 'ADMIN' && userId) {
    // Si es admin y pide reservas de un usuario específico (incluido él mismo)
    req.params.userId = userId.toString();
    return getUserReservations(req, res);
  }
  if (userRole === 'ADMIN') {
    // Si es admin y NO pide userId, devuelve todas
    return getAllReservations(req, res);
  }
  // Usuario normal: solo sus reservas
  req.params.userId = req.user!.id.toString();
  return getUserReservations(req, res);
});

// GET /api/reservations/user/:userId - Obtener reservas de un usuario específico (solo para roles Admin)
router.get('/user/:userId', authenticate, authorize('ADMIN'), getUserReservations);

// GET /api/reservations/date/:date - Obtener reservas por fecha (Admite roles Admin y Users)
router.get('/date/:date', authenticate, authorize('ADMIN', 'USER'), getReservationsByDate);

// PATCH /api/reservations/:id/cancel - Cancelar reserva (Admite roles Admin y Users)
router.patch('/:id/cancel', authenticate, authorize('ADMIN', 'USER'), cancelReservation);

// GET /api/reservations/:id - Obtener reserva específica (Admite roles Admin y Users)
router.get('/:id', authenticate, authorize('ADMIN', 'USER'), getReservation);

// PUT /api/reservations/:id - Actualizar reserva (Admite roles Admin y Users)
router.put('/:id', authenticate, authorize('ADMIN', 'USER'), updateReservation);

// DELETE /api/reservations/:id - Eliminar reserva (solo admin)
router.delete('/:id', authenticate, authorize('ADMIN'), deleteReservation);

export const reservationRoutes = router;

