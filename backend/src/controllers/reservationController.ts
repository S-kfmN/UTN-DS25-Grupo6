import { Request, Response } from 'express';
import ReservationModel from '../models/Reservation';
import VehicleModel from '../models/Vehicle';
import { CreateReservationRequest, UpdateReservationRequest } from '../types/reservation';
import { ReservationStatus } from '@prisma/client'; // Importar el enum de Prisma

// CREATE - Crear reserva
export const createReservation = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!; // Del middleware de autenticación
    const reservationData: CreateReservationRequest = req.body;

    // Validaciones básicas
    if (!reservationData.vehicleId || !reservationData.serviceId || !reservationData.date || !reservationData.time) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos (vehicleId, serviceId, date, time)'
      });
    }

    // Validar que el vehículo pertenezca al usuario
    const vehicle = await VehicleModel.findById(reservationData.vehicleId);
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
    const isAvailable = await ReservationModel.isTimeSlotAvailable(reservationData.date, reservationData.time);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Este horario no está disponible'
      });
    }

    // Crear la reserva
    const newReservation = await ReservationModel.create(reservationData, userId);

    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: {
        reservation: newReservation
      }
    });

  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// READ - Obtener reservas del usuario
export const getUserReservations = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const reservations = await ReservationModel.findByUserId(userId);

    res.json({
      success: true,
      data: {
        reservations
      }
    });

  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// READ - Obtener reserva específica
export const getReservation = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const reservationId = parseInt(req.params.id);

    const reservation = await ReservationModel.findById(reservationId);
    
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

  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// UPDATE - Actualizar reserva
export const updateReservation = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const reservationId = parseInt(req.params.id);
    const updateData: UpdateReservationRequest = req.body;

    // Verificar que la reserva exista y pertenezca al usuario
    const existingReservation = await ReservationModel.findById(reservationId);
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
    if ((updateData.date || updateData.time) && existingReservation.status !== ReservationStatus.PENDING) {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden modificar reservas pendientes'
      });
    }

    if (updateData.date || updateData.time) {
      const newDate = updateData.date || existingReservation.date;
      const newTime = updateData.time || existingReservation.time;
      
      const isAvailable = await ReservationModel.isTimeSlotAvailable(newDate, newTime, reservationId);
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'El nuevo horario no está disponible'
        });
      }
    }

    // Actualizar la reserva
    const updatedReservation = await ReservationModel.update(reservationId, updateData);

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

  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// DELETE - Cancelar reserva
export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const reservationId = parseInt(req.params.id);

    // Verificar que la reserva exista y pertenezca al usuario
    const existingReservation = await ReservationModel.findById(reservationId);
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
    if (existingReservation.status === ReservationStatus.COMPLETED) {
      return res.status(400).json({
        success: false,
        message: 'No se pueden cancelar reservas completadas'
      });
    }

    // Cambiar estado a cancelada
    const updatedReservation = await ReservationModel.updateStatus(reservationId, ReservationStatus.CANCELLED);

    res.json({
      success: true,
      message: 'Reserva cancelada exitosamente',
      data: {
        reservation: updatedReservation
      }
    });

  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// READ - Obtener reservas por fecha (para ver disponibilidad)
export const getReservationsByDate = async (req: Request, res: Response) => {
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

    const reservations = await ReservationModel.findByDate(date);

    res.json({
      success: true,
      data: {
        date,
        reservations
      }
    });

  } catch (error) {
    console.error('❌ Error en getReservationsByDate:', error); // Añadido para imprimir el error completo
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: (error as Error).message // Opcional: enviar el mensaje de error al cliente
    });
  }
};
