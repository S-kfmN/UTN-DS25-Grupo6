import { Reservation, CreateReservationRequest, UpdateReservationRequest } from '../types/reservation';
import { PrismaClient, ReservationStatus } from '@prisma/client';
import prisma from '../config/prisma';

class ReservationModel {
  // private reservations: Reservation[] = [];
  // private nextId = 1;

  // CREATE - Crear reserva
  async create(reservationData: CreateReservationRequest, userId: number): Promise<Reservation> {
    // const newReservation: Reservation = {
    //   id: this.nextId++,
    //   ...reservationData,
    //   userId,
    //   status: 'pending', // Por defecto pendiente
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString()
    // };
    
    // this.reservations.push(newReservation);
    // return newReservation;
    const newReservation = await prisma.reservation.create({
      data: {
        vehicleId: reservationData.vehicleId,
        serviceId: reservationData.serviceId,
        date: reservationData.date,
        time: reservationData.time,
        notes: reservationData.notes,
        userId,
        status: ReservationStatus.PENDING, // Cambiado a ReservationStatus.PENDING
      },
    });
    return newReservation;
  }

  // READ - Obtener reservas de un usuario específico
  async findByUserId(userId: number): Promise<Reservation[]> {
    // return this.reservations.filter(reservation => reservation.userId === userId);
    return await prisma.reservation.findMany({
      where: { userId: userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        vehicle: {
          select: { id: true, license: true, brand: true, model: true, year: true, color: true }
        },
        service: {
          select: { id: true, name: true, description: true, price: true }
        }
      }
    });
  }

  // READ - Obtener reserva por ID
  async findById(id: number): Promise<Reservation | null> {
    // return this.reservations.find(reservation => reservation.id === id) || null;
    return await prisma.reservation.findUnique({
      where: { id: id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        vehicle: {
          select: { id: true, license: true, brand: true, model: true, year: true, color: true }
        },
        service: {
          select: { id: true, name: true, description: true, price: true }
        }
      }
    });
  }

  // READ - Obtener todas las reservas (para admin)
  async findAll(): Promise<Reservation[]> {
    // return this.reservations;
    return await prisma.reservation.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        vehicle: {
          select: { id: true, license: true, brand: true, model: true, year: true, color: true }
        },
        service: {
          select: { id: true, name: true, description: true, price: true }
        }
      }
    });
  }

  // READ - Obtener reservas por fecha
  async findByDate(date: string): Promise<Reservation[]> {
    // return this.reservations.filter(reservation => reservation.date === date);
    return await prisma.reservation.findMany({
      where: { date: date },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        vehicle: {
          select: { id: true, license: true, brand: true, model: true, year: true, color: true }
        },
        service: {
          select: { id: true, name: true, description: true, price: true }
        }
      }
    });
  }

  // READ - Obtener reservas por mes
  async findByMonth(year: number, month: number): Promise<Reservation[]> {
    const mm = String(month).padStart(2, '0');
    return await prisma.reservation.findMany({
      where: { date: { startsWith: `${year}-${mm}-` } },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        vehicle: { select: { id: true, license: true, brand: true, model: true, year: true, color: true } },
        service: { select: { id: true, name: true, description: true, price: true } }
      }
    });
  }

  // UPDATE - Actualizar reserva
  async update(id: number, updateData: UpdateReservationRequest): Promise<Reservation | null> {
    // const reservationIndex = this.reservations.findIndex(r => r.id === id);
    
    // if (reservationIndex === -1) {
    //   return null;
    // }

    // this.reservations[reservationIndex] = {
    //   ...this.reservations[reservationIndex],
    //   ...updateData,
    //   updatedAt: new Date().toISOString()
    // };

    // return this.reservations[reservationIndex];
    try {
      const updatedReservation = await prisma.reservation.update({
        where: { id: id },
        data: {
          ...updateData,
          status: updateData.status, // Asegurarse de que el enum se mapea correctamente
          updatedAt: new Date(),
        },
      });
      return updatedReservation;
    } catch (error) {
      console.error("Error updating reservation:", error);
      return null;
    }
  }

  // UPDATE - Cambiar estado de reserva
  async updateStatus(id: number, status: ReservationStatus): Promise<Reservation | null> {
    // return this.update(id, { status });
    try {
      const updatedReservation = await prisma.reservation.update({
        where: { id: id },
        data: {
          status: status,
          updatedAt: new Date(),
        },
      });
      return updatedReservation;
    } catch (error) {
      console.error("Error updating reservation status:", error);
      return null;
    }
  }

  // DELETE - Eliminar reserva
  async delete(id: number): Promise<boolean> {
    // const reservationIndex = this.reservations.findIndex(r => r.id === id);
    
    // if (reservationIndex === -1) {
    //   return false;
    // }

    // this.reservations.splice(reservationIndex, 1);
    // return true;
    try {
      await prisma.reservation.delete({
        where: { id: id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting reservation:", error);
      return false;
    }
  }

  // VALIDACIONES - Verificar disponibilidad de horario (PÚBLICO)
  public async isTimeSlotAvailable(date: string, time: string, excludeReservationId?: number): Promise<boolean> {
    // const conflictingReservations = this.reservations.filter(reservation => 
    //   reservation.date === date && 
    //   reservation.time === time && 
    //   reservation.status !== 'cancelled' &&
    //   (!excludeReservationId || reservation.id !== excludeReservationId)
    // );

    // return conflictingReservations.length === 0;
    const conflictingReservations = await prisma.reservation.findMany({
      where: {
        date: date,
        time: time,
        status: { not: ReservationStatus.CANCELLED }, // Usar enum de Prisma
        NOT: excludeReservationId ? { id: excludeReservationId } : undefined,
      },
    });
    return conflictingReservations.length === 0;
  }
}

export default new ReservationModel();

