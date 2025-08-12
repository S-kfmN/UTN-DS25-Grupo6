import { Router } from 'express';
import { register, login } from '../controllers/userController';

// Crear un router para las rutas de autenticación
const router = Router();

// RUTAS PÚBLICAS - No requieren autenticación
// POST /api/auth/register - Para que nuevos usuarios se registren
router.post('/register', register);

// POST /api/auth/login - Para que usuarios existentes inicien sesión
router.post('/login', login);

// Exportar el router para usarlo en app.ts
export default router;