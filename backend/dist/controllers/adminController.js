"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemInfo = exports.getSystemStats = exports.getServicesList = exports.updateReservation = exports.getReservationsList = exports.getVehiclesList = exports.deactivateUser = exports.updateUser = exports.getUserDetails = exports.getUsersList = void 0;
const User_1 = __importDefault(require("../models/User"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const Service_1 = __importDefault(require("../models/Service"));
const client_1 = require("@prisma/client"); // Importar enums de Prisma
// Controlador para el CRUD de Administración del Sistema
// Maneja todas las operaciones administrativas: usuarios, vehículos, reservas, servicios
// ========================================
// GESTIÓN DE USUARIOS (ADMIN)
// ========================================
// READ - Obtener lista de usuarios para admin
const getUsersList = async (req, res) => {
    try {
        // Extraer parámetros de query para filtros
        const { role, isActive, limit = 50, offset = 0 } = req.query;
        // Obtener todos los usuarios del modelo
        const allUsers = await User_1.default.findAll();
        // Aplicar filtros
        let filteredUsers = allUsers;
        // Filtrar por rol si se especifica
        if (role && typeof role === 'string') {
            const roleFilter = role.toUpperCase();
            if (Object.values(client_1.UserRole).includes(roleFilter)) {
                filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
            }
        }
        // Filtrar por estado activo si se especifica
        if (isActive !== undefined) {
            const activeFilter = isActive === 'true';
            filteredUsers = filteredUsers.filter(user => user.isActive === activeFilter);
        }
        // Aplicar paginación
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        // Enriquecer datos con conteos
        const enrichedUsers = await Promise.all(paginatedUsers.map(async (user) => {
            // Contar vehículos del usuario
            const userVehicles = await Vehicle_1.default.findByUserId(user.id);
            // Contar reservas del usuario
            const userReservations = await Reservation_1.default.findByUserId(user.id);
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt, // No usar toISOString()
                vehicleCount: userVehicles.length,
                reservationCount: userReservations.length
            };
        }));
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                users: enrichedUsers,
                total: filteredUsers.length,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: filteredUsers.length
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener lista de usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getUsersList = getUsersList;
// READ - Obtener detalles completos de un usuario
const getUserDetails = async (req, res) => {
    try {
        // Extraer el ID del usuario de los parámetros
        const userId = parseInt(req.params.id);
        // Validar que el ID sea un número válido
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }
        // Buscar el usuario por ID
        const user = await User_1.default.findById(userId);
        // Si no se encuentra el usuario
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        // Obtener vehículos del usuario
        const userVehicles = await Vehicle_1.default.findByUserId(userId);
        // Obtener reservas del usuario
        const userReservations = await Reservation_1.default.findByUserId(userId);
        // Construir respuesta enriquecida
        const userDetails = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt, // No usar toISOString()
            updatedAt: user.updatedAt, // No usar toISOString()
            vehicles: userVehicles.map(vehicle => ({
                id: vehicle.id,
                license: vehicle.license,
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                isActive: vehicle.status === client_1.VehicleStatus.ACTIVE, // Mapear estado a isActive booleano
                createdAt: vehicle.createdAt // No usar toISOString()
            })),
            reservations: userReservations.map(reservation => ({
                id: reservation.id,
                date: reservation.date,
                time: reservation.time,
                status: reservation.status,
                serviceId: reservation.serviceId, // Usar serviceId
                // TODO: Cargar el nombre del servicio para mostrar serviceType
                createdAt: reservation.createdAt // No usar toISOString()
            }))
        };
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                user: userDetails
            }
        });
    }
    catch (error) {
        console.error('Error al obtener detalles de usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getUserDetails = getUserDetails;
// UPDATE - Actualizar usuario desde admin
const updateUser = async (req, res) => {
    try {
        // Extraer el ID del usuario y los datos de actualización
        const userId = parseInt(req.params.id);
        const updateData = req.body;
        // Validar que el ID sea un número válido
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }
        // Validar que al menos un campo se proporcione para actualizar
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar al menos un campo para actualizar'
            });
        }
        // Validar rol si se proporciona
        if (updateData.role && !Object.values(client_1.UserRole).includes(updateData.role)) {
            return res.status(400).json({
                success: false,
                message: `Rol inválido. Use: ${Object.values(client_1.UserRole).join(', ')}`
            });
        }
        // Buscar el usuario existente
        const existingUser = await User_1.default.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        // Actualizar el usuario
        const updatedUser = await User_1.default.update(userId, updateData);
        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: {
                user: updatedUser
            }
        });
    }
    catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.updateUser = updateUser;
// DELETE - Desactivar usuario (admin)
const deactivateUser = async (req, res) => {
    try {
        // Extraer el ID del usuario
        const userId = parseInt(req.params.id);
        // Validar que el ID sea un número válido
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }
        // Buscar el usuario existente
        const existingUser = await User_1.default.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        // No permitir desactivar al último admin
        if (existingUser.role === client_1.UserRole.ADMIN) {
            const allAdmins = (await User_1.default.findAll()).filter(u => u.role === client_1.UserRole.ADMIN && u.isActive);
            if (allAdmins.length === 1) {
                return res.status(400).json({
                    success: false,
                    message: 'No se puede desactivar al último administrador del sistema'
                });
            }
        }
        // Desactivar el usuario
        const updatedUser = await User_1.default.update(userId, { isActive: false });
        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Usuario desactivado exitosamente',
            data: {
                user: updatedUser
            }
        });
    }
    catch (error) {
        console.error('Error al desactivar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.deactivateUser = deactivateUser;
// ========================================
// GESTIÓN DE VEHÍCULOS (ADMIN)
// ========================================
// READ - Obtener lista de vehículos para admin
const getVehiclesList = async (req, res) => {
    try {
        // Extraer parámetros de query para filtros
        const { brand, isActive, limit = 50, offset = 0 } = req.query;
        // Obtener todos los vehículos del modelo
        const allVehicles = await Vehicle_1.default.findAll();
        // Aplicar filtros
        let filteredVehicles = allVehicles;
        // Filtrar por marca si se especifica
        if (brand && typeof brand === 'string') {
            filteredVehicles = filteredVehicles.filter(vehicle => vehicle.brand.toLowerCase().includes(brand.toLowerCase()));
        }
        // Filtrar por estado activo si se especifica
        if (isActive !== undefined) {
            const activeFilter = isActive === 'true'; // Query param es string
            filteredVehicles = filteredVehicles.filter(vehicle => (activeFilter && vehicle.status === client_1.VehicleStatus.ACTIVE) ||
                (!activeFilter && vehicle.status === client_1.VehicleStatus.INACTIVE));
        }
        // Aplicar paginación
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);
        // Enriquecer datos con información del propietario y conteos
        const enrichedVehicles = await Promise.all(paginatedVehicles.map(async (vehicle) => {
            // Obtener información del propietario
            const owner = await User_1.default.findById(vehicle.userId);
            // Contar reservas del vehículo
            const vehicleReservations = await Reservation_1.default.findByUserId(vehicle.userId);
            const vehicleReservationCount = vehicleReservations.filter(r => r.vehicleId === vehicle.id).length;
            return {
                id: vehicle.id,
                license: vehicle.license,
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                isActive: vehicle.status === client_1.VehicleStatus.ACTIVE, // Mapear estado a isActive booleano
                createdAt: vehicle.createdAt, // No usar toISOString()
                ownerName: owner?.name || 'Usuario no encontrado',
                ownerEmail: owner?.email || 'Email no disponible',
                reservationCount: vehicleReservationCount
            };
        }));
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                vehicles: enrichedVehicles,
                total: filteredVehicles.length,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: filteredVehicles.length
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener lista de vehículos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getVehiclesList = getVehiclesList;
// ========================================
// GESTIÓN DE RESERVAS (ADMIN)
// ========================================
// READ - Obtener lista de reservas para admin
const getReservationsList = async (req, res) => {
    try {
        // Extraer parámetros de query para filtros
        const { status, date, limit = 50, offset = 0 } = req.query;
        // Obtener todas las reservas del modelo
        const allReservations = await Reservation_1.default.findAll();
        // Aplicar filtros
        let filteredReservations = allReservations;
        // Filtrar por estado si se especifica
        if (status && typeof status === 'string') {
            const statusFilter = status.toUpperCase();
            if (Object.values(client_1.ReservationStatus).includes(statusFilter)) {
                filteredReservations = filteredReservations.filter(reservation => reservation.status === statusFilter);
            }
        }
        // Filtrar por fecha si se especifica
        if (date && typeof date === 'string') {
            filteredReservations = filteredReservations.filter(reservation => reservation.date === date);
        }
        // Aplicar paginación
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedReservations = filteredReservations.slice(startIndex, endIndex);
        // Enriquecer datos con información del cliente y vehículo
        const enrichedReservations = await Promise.all(paginatedReservations.map(async (reservation) => {
            // Obtener información del cliente
            const customer = await User_1.default.findById(reservation.userId);
            // Obtener información del vehículo
            const vehicle = await Vehicle_1.default.findById(reservation.vehicleId);
            // TODO: Obtener información del servicio para mostrar serviceType y price
            const service = await Service_1.default.findById(reservation.serviceId);
            return {
                id: reservation.id,
                date: reservation.date,
                time: reservation.time,
                status: reservation.status,
                serviceType: service?.name || 'Servicio no encontrado', // Usar el nombre del servicio
                price: service?.price || 0, // Usar el precio del servicio
                createdAt: reservation.createdAt, // No usar toISOString()
                customerName: customer?.name || 'Usuario no encontrado',
                customerEmail: customer?.email || 'Email no disponible',
                vehicleLicense: vehicle?.license || 'Placa no disponible',
                vehicleBrand: vehicle?.brand || 'Marca no disponible',
                vehicleModel: vehicle?.model || 'Modelo no disponible'
            };
        }));
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                reservations: enrichedReservations,
                total: filteredReservations.length,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: filteredReservations.length
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener lista de reservas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getReservationsList = getReservationsList;
// UPDATE - Actualizar reserva desde admin
const updateReservation = async (req, res) => {
    try {
        // Extraer el ID de la reserva y los datos de actualización
        const reservationId = parseInt(req.params.id);
        const updateData = req.body;
        // Validar que el ID sea un número válido
        if (isNaN(reservationId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de reserva inválido'
            });
        }
        // Validar que al menos un campo se proporcione para actualizar
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar al menos un campo para actualizar'
            });
        }
        // Validar estado si se proporciona
        if (updateData.status && !Object.values(client_1.ReservationStatus).includes(updateData.status)) {
            return res.status(400).json({
                success: false,
                message: `Estado inválido. Use: ${Object.values(client_1.ReservationStatus).join(', ')}`
            });
        }
        // Buscar la reserva existente
        const existingReservation = await Reservation_1.default.findById(reservationId);
        if (!existingReservation) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        // Actualizar la reserva
        const updatedReservation = await Reservation_1.default.update(reservationId, updateData);
        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Reserva actualizada exitosamente',
            data: {
                reservation: updatedReservation
            }
        });
    }
    catch (error) {
        console.error('Error al actualizar reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.updateReservation = updateReservation;
// ========================================
// GESTIÓN DE SERVICIOS (ADMIN)
// ========================================
// READ - Obtener lista de servicios para admin
const getServicesList = async (req, res) => {
    try {
        // Extraer parámetros de query para filtros
        const { category, isActive, limit = 50, offset = 0 } = req.query;
        // Obtener todos los servicios del modelo
        const allServices = await Service_1.default.findAll();
        // Aplicar filtros
        let filteredServices = allServices;
        // Filtrar por categoría si se especifica
        if (category && typeof category === 'string') {
            const categoryFilter = category.toUpperCase();
            if (Object.values(client_1.ServiceCategory).includes(categoryFilter)) {
                filteredServices = filteredServices.filter(service => service.category === categoryFilter);
            }
        }
        // Filtrar por estado activo si se especifica
        if (isActive !== undefined) {
            const activeFilter = isActive === 'true';
            filteredServices = filteredServices.filter(service => service.isActive === activeFilter);
        }
        // Aplicar paginación
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedServices = filteredServices.slice(startIndex, endIndex);
        // Enriquecer datos con conteo de reservas
        const enrichedServices = await Promise.all(paginatedServices.map(async (service) => {
            // Por ahora el conteo es 0, se puede implementar en el futuro
            const reservationCount = 0; // TODO: Implementar conteo de reservas para el servicio
            return {
                id: service.id,
                name: service.name,
                category: service.category,
                price: service.price,
                duration: service.duration,
                isActive: service.isActive,
                reservationCount,
                createdAt: service.createdAt // No usar toISOString()
            };
        }));
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                services: enrichedServices,
                total: filteredServices.length,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: filteredServices.length
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener lista de servicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getServicesList = getServicesList;
// ========================================
// ESTADÍSTICAS DEL SISTEMA
// ========================================
// READ - Obtener estadísticas generales del sistema
const getSystemStats = async (req, res) => {
    try {
        // Obtener todos los datos del sistema
        const allUsers = await User_1.default.findAll();
        const allVehicles = await Vehicle_1.default.findAll();
        const allReservations = await Reservation_1.default.findAll();
        const allServices = await Service_1.default.findAll();
        // Calcular estadísticas de usuarios
        const totalUsers = allUsers.length;
        const activeUsers = allUsers.filter(user => user.isActive).length;
        const usersByRole = { [client_1.UserRole.ADMIN]: 0, [client_1.UserRole.MECHANIC]: 0, [client_1.UserRole.USER]: 0 };
        allUsers.forEach(user => {
            usersByRole[user.role]++;
        });
        // Calcular estadísticas de vehículos
        const totalVehicles = allVehicles.length;
        const activeVehicles = allVehicles.filter(vehicle => vehicle.status === client_1.VehicleStatus.ACTIVE).length;
        // Calcular estadísticas de reservas
        const totalReservations = allReservations.length;
        const reservationsByStatus = {
            [client_1.ReservationStatus.PENDING]: allReservations.filter(r => r.status === client_1.ReservationStatus.PENDING).length,
            [client_1.ReservationStatus.CONFIRMED]: allReservations.filter(r => r.status === client_1.ReservationStatus.CONFIRMED).length,
            [client_1.ReservationStatus.COMPLETED]: allReservations.filter(r => r.status === client_1.ReservationStatus.COMPLETED).length,
            [client_1.ReservationStatus.CANCELLED]: allReservations.filter(r => r.status === client_1.ReservationStatus.CANCELLED).length
        };
        // Calcular estadísticas de servicios
        const totalServices = allServices.length;
        const activeServices = allServices.filter(service => service.isActive).length;
        // Construir objeto de estadísticas
        const systemStats = {
            // Usuarios
            totalUsers,
            activeUsers,
            usersByRole,
            // Vehículos
            totalVehicles,
            activeVehicles,
            // Reservas
            totalReservations,
            reservationsByStatus,
            reservationsByMonth: [], // Por implementar en el futuro
            // Servicios
            totalServices,
            activeServices,
            topServices: [], // Por implementar en el futuro
            // Financiero
            totalRevenue: 0, // Por implementar en el futuro
            averageReservationValue: 0, // Por implementar en el futuro
            // Sistema
            serverUptime: process.uptime().toString(),
            lastBackup: new Date().toISOString(), // Por implementar en el futuro
            systemVersion: '1.0.0'
        };
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                stats: systemStats
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas del sistema:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getSystemStats = getSystemStats;
// ========================================
// OPERACIONES DEL SISTEMA
// ========================================
// READ - Obtener información del sistema
const getSystemInfo = async (req, res) => {
    try {
        const systemInfo = {
            name: 'API del Lubricentro Renault',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            platform: process.platform,
            nodeVersion: process.version,
            timestamp: new Date().toISOString()
        };
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                system: systemInfo
            }
        });
    }
    catch (error) {
        console.error('Error al obtener información del sistema:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getSystemInfo = getSystemInfo;
