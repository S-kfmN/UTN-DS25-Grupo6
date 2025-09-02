"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
// Crear un router para las rutas de usuarios
const router = (0, express_1.Router)();
// APLICAR MIDDLEWARE DE AUTENTICACIÓN A TODAS LAS RUTAS
// Esto significa que todas las rutas de este archivo requieren estar logueado
router.use(auth_1.authenticateToken);
// RUTAS PROTEGIDAS - Requieren autenticación
// GET /api/users/profile - Obtener perfil del usuario logueado
router.get('/profile', userController_1.getProfile);
// PUT /api/users/profile - Actualizar perfil del usuario logueado
router.put('/profile', userController_1.updateProfile);
// Exportar el router para usarlo en app.ts
exports.default = router;
