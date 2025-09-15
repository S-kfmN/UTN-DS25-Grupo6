import { Router } from 'express';
import {
  createVehicle,
  getUserVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehicles
} from '../controllers/vehicleController';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createVehicleSchema, updateVehicleSchema, vehicleIdSchema } from '../validations/vehicleValidation';

const router = Router();

// RUTAS PROTEGIDAS - Requieren autenticación
// POST /api/vehicles - Crear nuevo vehículo (Admite roles Admin y Users)
router.post('/', authenticate, authorize('ADMIN', 'USER'), validate(createVehicleSchema), createVehicle);

// GET /api/vehicles/all - Obtener TODOS los vehículos (solo para roles Admin)
router.get('/all', authenticate, authorize('ADMIN'), getAllVehicles);

// GET /api/vehicles - Obtener vehículos del usuario autenticado (Admite roles Admin y Users)
router.get('/', authenticate, authorize('ADMIN', 'USER'), getUserVehicles);

// GET /api/vehicles/:id - Obtener vehículo específico (Admite roles Admin y Users)
router.get('/:id', authenticate, authorize('ADMIN', 'USER'), validate(vehicleIdSchema, 'params'), getVehicle);

// PUT /api/vehicles/:id - Actualizar vehículo (Admite roles Admin y Users)
router.put('/:id', authenticate, authorize('ADMIN', 'USER'), validate(vehicleIdSchema, 'params'), validate(updateVehicleSchema), updateVehicle);

// DELETE /api/vehicles/:id - Eliminar vehículo (Admite roles Admin y Users)
router.delete('/:id', authenticate, authorize('ADMIN', 'USER'), validate(vehicleIdSchema, 'params'), deleteVehicle);

export const vehicleRoutes = router;


