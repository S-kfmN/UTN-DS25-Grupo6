import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers, changePassword, getUserById } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { updateUserSchema, changePasswordSchema, userIdSchema } from '../validations/userValidation';

// Crear un router para las rutas de usuarios
const router = Router();

// APLICAR MIDDLEWARE DE AUTENTICACIÓN A TODAS LAS RUTAS
// Esto significa que todas las rutas de este archivo requieren estar logueado
router.use(authenticateToken);

// RUTAS PROTEGIDAS - Requieren autenticación
// GET /api/users/profile - Obtener perfil del usuario logueado
router.get('/profile', getProfile);

// PUT /api/users/profile - Actualizar perfil del usuario logueado
router.put('/profile', validate(updateUserSchema, 'body'), updateProfile);

// POST /api/users/change-password - Cambiar contraseña del usuario logueado
router.post('/change-password', validate(changePasswordSchema, 'body'), changePassword);

// GET /api/users - Obtener todos los usuarios (requiere autenticación y posiblemente rol de admin)
router.get('/', getAllUsers);

// GET /api/users/:id - Obtener un usuario específico por ID
router.get('/:id', validate(userIdSchema, 'params'), getUserById);

// Exportar el router para usarlo en app.ts
export default router;