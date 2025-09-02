"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicleController_1 = require("../controllers/vehicleController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// APLICAR MIDDLEWARE DE AUTENTICACIÓN A TODAS LAS RUTAS
router.use(auth_1.authenticateToken);
// RUTAS PROTEGIDAS - Requieren autenticación
// POST /api/vehicles - Crear nuevo vehículo
router.post('/', vehicleController_1.createVehicle);
// GET /api/vehicles - Obtener vehículos del usuario
router.get('/', vehicleController_1.getUserVehicles);
// GET /api/vehicles/:id - Obtener vehículo específico
router.get('/:id', vehicleController_1.getVehicle);
// PUT /api/vehicles/:id - Actualizar vehículo
router.put('/:id', vehicleController_1.updateVehicle);
// DELETE /api/vehicles/:id - Eliminar vehículo
router.delete('/:id', vehicleController_1.deleteVehicle);
exports.default = router;
