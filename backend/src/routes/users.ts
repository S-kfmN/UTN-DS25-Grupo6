import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';

// Crear un router para las rutas de usuarios
const router = Router();

// APLICAR MIDDLEWARE DE AUTENTICACIÓN A TODAS LAS RUTAS
// Esto significa que todas las rutas de este archivo requieren estar logueado
router.use(authenticateToken);

// RUTAS PROTEGIDAS - Requieren autenticación
// GET /api/users/profile - Obtener perfil del usuario logueado
router.get('/profile', getProfile);

// PUT /api/users/profile - Actualizar perfil del usuario logueado
router.put('/profile', updateProfile);

// GET /api/users - Obtener todos los usuarios (requiere autenticación y posiblemente rol de admin)
router.get('/', getAllUsers);

// Exportar el router para usarlo en app.ts
export default router;