"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservationsByDate = exports.cancelReservation = exports.updateReservation = exports.getReservation = exports.getUserReservations = exports.createReservation = void 0;
const Reservation_1 = __importDefault(require("../models/Reservation"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const client_1 = require("@prisma/client"); // Importar el enum de Prisma
// CREATE - Crear reserva
const createReservation = async (req, res) => {
    try {
        const userId = req.userId; // Del middleware de autenticación
        const reservationData = req.body;
        // Validaciones básicas
        if (!reservationData.vehicleId || !reservationData.serviceId || !reservationData.date || !reservationData.time) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos (vehicleId, serviceId, date, time)'
            });
        }
        // Validar que el vehículo pertenezca al usuario
        const vehicle = await Vehicle_1.default.findById(reservationData.vehicleId);
        if (!vehicle || vehicle.userId !== userId) {
            return res.status(400).json({
                success: false,
                message: 'Vehículo no encontrado o no pertenece al usuario'
            });
        }
        // Validar formato de fecha (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(reservationData.date)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de fecha inválido. Use YYYY-MM-DD'
            });
        }
        // Validar formato de hora (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(reservationData.time)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de hora inválido. Use HH:MM'
            });
        }
        // Validar que la fecha no sea en el pasado
        const reservationDate = new Date(reservationData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (reservationDate < today) {
            return res.status(400).json({
                success: false,
                message: 'No se pueden hacer reservas en fechas pasadas'
            });
        }
        // Validar disponibilidad del horario
        const isAvailable = await Reservation_1.default.isTimeSlotAvailable(reservationData.date, reservationData.time);
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Este horario no está disponible'
            });
        }
        // Crear la reserva
        const newReservation = await Reservation_1.default.create(reservationData, userId);
        res.status(201).json({
            success: true,
            message: 'Reserva creada exitosamente',
            data: {
                reservation: newReservation
            }
        });
    }
    catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.createReservation = createReservation;
// READ - Obtener reservas del usuario
const getUserReservations = async (req, res) => {
    try {
        const userId = req.userId;
        const reservations = await Reservation_1.default.findByUserId(userId);
        res.json({
            success: true,
            data: {
                reservations
            }
        });
    }
    catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getUserReservations = getUserReservations;
// READ - Obtener reserva específica
const getReservation = async (req, res) => {
    try {
        const userId = req.userId;
        const reservationId = parseInt(req.params.id);
        const reservation = await Reservation_1.default.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        // Verificar que la reserva pertenezca al usuario
        if (reservation.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para ver esta reserva'
            });
        }
        res.json({
            success: true,
            data: {
                reservation
            }
        });
    }
    catch (error) {
        console.error('Error al obtener reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getReservation = getReservation;
// UPDATE - Actualizar reserva
const updateReservation = async (req, res) => {
    try {
        const userId = req.userId;
        const reservationId = parseInt(req.params.id);
        const updateData = req.body;
        // Verificar que la reserva exista y pertenezca al usuario
        const existingReservation = await Reservation_1.default.findById(reservationId);
        if (!existingReservation) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        if (existingReservation.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para modificar esta reserva'
            });
        }
        // Si se está cambiando fecha/hora, validar disponibilidad
        if ((updateData.date || updateData.time) && existingReservation.status !== client_1.ReservationStatus.PENDING) {
            return res.status(400).json({
                success: false,
                message: 'Solo se pueden modificar reservas pendientes'
            });
        }
        if (updateData.date || updateData.time) {
            const newDate = updateData.date || existingReservation.date;
            const newTime = updateData.time || existingReservation.time;
            const isAvailable = await Reservation_1.default.isTimeSlotAvailable(newDate, newTime, reservationId);
            if (!isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: 'El nuevo horario no está disponible'
                });
            }
        }
        // Actualizar la reserva
        const updatedReservation = await Reservation_1.default.update(reservationId, updateData);
        if (!updatedReservation) {
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar la reserva'
            });
        }
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
// DELETE - Cancelar reserva
const cancelReservation = async (req, res) => {
    try {
        const userId = req.userId;
        const reservationId = parseInt(req.params.id);
        // Verificar que la reserva exista y pertenezca al usuario
        const existingReservation = await Reservation_1.default.findById(reservationId);
        if (!existingReservation) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        if (existingReservation.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para cancelar esta reserva'
            });
        }
        // Solo se pueden cancelar reservas pendientes o confirmadas
        if (existingReservation.status === client_1.ReservationStatus.COMPLETED) {
            return res.status(400).json({
                success: false,
                message: 'No se pueden cancelar reservas completadas'
            });
        }
        // Cambiar estado a cancelada
        const updatedReservation = await Reservation_1.default.updateStatus(reservationId, client_1.ReservationStatus.CANCELLED);
        res.json({
            success: true,
            message: 'Reserva cancelada exitosamente',
            data: {
                reservation: updatedReservation
            }
        });
    }
    catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.cancelReservation = cancelReservation;
// READ - Obtener reservas por fecha (para ver disponibilidad)
const getReservationsByDate = async (req, res) => {
    try {
        const { date } = req.params;
        // Validar formato de fecha
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de fecha inválido. Use YYYY-MM-DD'
            });
        }
        const reservations = await Reservation_1.default.findByDate(date);
        res.json({
            success: true,
            data: {
                date,
                reservations
            }
        });
    }
    catch (error) {
        console.error('Error al obtener reservas por fecha:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getReservationsByDate = getReservationsByDate;
