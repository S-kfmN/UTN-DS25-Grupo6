"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
// Crear un router para las rutas de autenticación
const router = (0, express_1.Router)();
// RUTAS PÚBLICAS - No requieren autenticación
// POST /api/auth/register - Para que nuevos usuarios se registren
router.post('/register', userController_1.register);
// POST /api/auth/login - Para que usuarios existentes inicien sesión
router.post('/login', userController_1.login);
// Exportar el router para usarlo en app.ts
exports.default = router;
