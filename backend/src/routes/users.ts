import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers, getUserById } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { updateUserSchema, userIdSchema } from '../validations/user.validation';

// Crear un router para las rutas de usuarios
const router = Router();

// RUTAS PROTEGIDAS - Requieren autenticación
// GET /api/users/profile - Obtener perfil del usuario logueado
router.get('/profile', authenticate, getProfile);

// PUT /api/users/profile - Actualizar perfil del usuario logueado
router.put('/profile', authenticate, validate(updateUserSchema), updateProfile);

// GET /api/users - Obtener todos los usuarios (solo para roles Admin)
router.get('/', authenticate, authorize('ADMIN'), getAllUsers);

// GET /api/users/:id - Obtener un usuario específico por ID (solo para roles Admin)
router.get('/:id', authenticate, authorize('ADMIN'), validate(userIdSchema, 'params'), getUserById);

// Exportar el router para usarlo en app.ts
export const userRoutes = router;