import { Router } from 'express';
import { 
  createVehicle, 
  getUserVehicles, 
  getVehicle, 
  updateVehicle, 
  deleteVehicle,
  getAllVehicles // Importar la nueva función
} from '../controllers/vehicleController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// APLICAR MIDDLEWARE DE AUTENTICACIÓN A TODAS LAS RUTAS
router.use(authenticateToken);

// RUTAS PROTEGIDAS - Requieren autenticación
// POST /api/vehicles - Crear nuevo vehículo
router.post('/', createVehicle);

// GET /api/vehicles/all - Obtener TODOS los vehículos (solo para admin)
router.get('/all', getAllVehicles);

// GET /api/vehicles - Obtener vehículos del usuario autenticado (o de todos si es admin y no se especifica userId explícitamente)
router.get('/', getUserVehicles);

// GET /api/vehicles/:id - Obtener vehículo específico
router.get('/:id', getVehicle);

// PUT /api/vehicles/:id - Actualizar vehículo
router.put('/:id', updateVehicle);

// DELETE /api/vehicles/:id - Eliminar vehículo
router.delete('/:id', deleteVehicle);

export default router;


