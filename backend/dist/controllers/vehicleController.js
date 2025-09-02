"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.getVehicle = exports.getUserVehicles = exports.createVehicle = void 0;
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
// CREATE - Crear vehículo
const createVehicle = async (req, res) => {
    try {
        const userId = req.userId; // Del middleware de autenticación
        const vehicleData = req.body;
        // Validaciones básicas
        if (!vehicleData.license || !vehicleData.brand || !vehicleData.model || !vehicleData.year || !vehicleData.color) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }
        // Validar año del vehículo
        if (vehicleData.year < 1900 || vehicleData.year > new Date().getFullYear() + 1) {
            return res.status(400).json({
                success: false,
                message: 'Año del vehículo inválido'
            });
        }
        // Verificar si la patente ya existe
        const existingVehicle = await Vehicle_1.default.findByLicense(vehicleData.license);
        if (existingVehicle) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un vehículo con esa patente'
            });
        }
        // Crear vehículo
        const newVehicle = await Vehicle_1.default.create(vehicleData, userId);
        res.status(201).json({
            success: true,
            data: newVehicle
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.createVehicle = createVehicle;
// READ - Obtener vehículos del usuario
const getUserVehicles = async (req, res) => {
    try {
        const userId = req.userId;
        const vehicles = await Vehicle_1.default.findByUserId(userId);
        res.json({
            success: true,
            data: vehicles
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getUserVehicles = getUserVehicles;
// READ - Obtener vehículo específico
const getVehicle = async (req, res) => {
    try {
        const userId = req.userId;
        const vehicleId = parseInt(req.params.id);
        const vehicle = await Vehicle_1.default.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        // Verificar que el vehículo pertenece al usuario
        if (vehicle.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para ver este vehículo'
            });
        }
        res.json({
            success: true,
            data: vehicle
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getVehicle = getVehicle;
// UPDATE - Actualizar vehículo
const updateVehicle = async (req, res) => {
    try {
        const userId = req.userId;
        const vehicleId = parseInt(req.params.id);
        const updateData = req.body;
        // Verificar que el vehículo existe y pertenece al usuario
        const vehicle = await Vehicle_1.default.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        if (vehicle.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para modificar este vehículo'
            });
        }
        // Si se está actualizando la patente, verificar que no exista
        if (updateData.license && updateData.license !== vehicle.license) {
            const existingVehicle = await Vehicle_1.default.findByLicense(updateData.license);
            if (existingVehicle) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un vehículo con esa patente'
                });
            }
        }
        // Actualizar vehículo
        const updatedVehicle = await Vehicle_1.default.update(vehicleId, updateData);
        res.json({
            success: true,
            data: updatedVehicle
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.updateVehicle = updateVehicle;
// DELETE - Eliminar vehículo
const deleteVehicle = async (req, res) => {
    try {
        const userId = req.userId;
        const vehicleId = parseInt(req.params.id);
        // Verificar que el vehículo existe y pertenece al usuario
        const vehicle = await Vehicle_1.default.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        if (vehicle.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar este vehículo'
            });
        }
        // Eliminar vehículo
        const deleted = await Vehicle_1.default.delete(vehicleId);
        if (deleted) {
            res.json({
                success: true,
                message: 'Vehículo eliminado correctamente'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el vehículo'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.deleteVehicle = deleteVehicle;
