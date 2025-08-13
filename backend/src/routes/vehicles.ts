import { Router } from 'express';
import { 
  createVehicle, 
  getUserVehicles, 
  getVehicle, 
  updateVehicle, 
  deleteVehicle 
} from '../controllers/vehicleController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// APLICAR MIDDLEWARE DE AUTENTICACIÓN A TODAS LAS RUTAS
router.use(authenticateToken);

// RUTAS PROTEGIDAS - Requieren autenticación
// POST /api/vehicles - Crear nuevo vehículo
router.post('/', createVehicle);

// GET /api/vehicles - Obtener vehículos del usuario
router.get('/', getUserVehicles);

// GET /api/vehicles/:id - Obtener vehículo específico
router.get('/:id', getVehicle);

// PUT /api/vehicles/:id - Actualizar vehículo
router.put('/:id', updateVehicle);

// DELETE /api/vehicles/:id - Eliminar vehículo
router.delete('/:id', deleteVehicle);

export default router;


