import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { loginSchema, registerSchema, changePasswordSchema } from '../validations/auth.validation';
import { authenticate } from '../middlewares/auth.middleware';

// Crear un router para las rutas de autenticación
const router = Router();

// RUTAS PÚBLICAS - No requieren autenticación
// POST /api/auth/register - Para que nuevos usuarios se registren
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login - Para que usuarios existentes inicien sesión
router.post('/login', validate(loginSchema), authController.login);

// RUTAS PROTEGIDAS - Requieren autenticación
// POST /api/auth/change-password - Cambiar contraseña del usuario autenticado
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

// POST /api/auth/logout - Para cerrar sesión
router.post('/logout', authenticate, authController.logout);

// Exportar el router para usarlo en app.ts
export const authRoutes = router;