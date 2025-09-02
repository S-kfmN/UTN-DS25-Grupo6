"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ReservationModel {
    // private reservations: Reservation[] = [];
    // private nextId = 1;
    // CREATE - Crear reserva
    async create(reservationData, userId) {
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
                status: client_1.ReservationStatus.PENDING, // Cambiado a ReservationStatus.PENDING
            },
        });
        return newReservation;
    }
    // READ - Obtener reservas de un usuario específico
    async findByUserId(userId) {
        // return this.reservations.filter(reservation => reservation.userId === userId);
        return await prisma.reservation.findMany({
            where: { userId: userId },
        });
    }
    // READ - Obtener reserva por ID
    async findById(id) {
        // return this.reservations.find(reservation => reservation.id === id) || null;
        return await prisma.reservation.findUnique({
            where: { id: id },
        });
    }
    // READ - Obtener todas las reservas (para admin)
    async findAll() {
        // return this.reservations;
        return await prisma.reservation.findMany();
    }
    // READ - Obtener reservas por fecha
    async findByDate(date) {
        // return this.reservations.filter(reservation => reservation.date === date);
        return await prisma.reservation.findMany({
            where: { date: date },
        });
    }
    // UPDATE - Actualizar reserva
    async update(id, updateData) {
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
        }
        catch (error) {
            console.error("Error updating reservation:", error);
            return null;
        }
    }
    // UPDATE - Cambiar estado de reserva
    async updateStatus(id, status) {
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
        }
        catch (error) {
            console.error("Error updating reservation status:", error);
            return null;
        }
    }
    // DELETE - Eliminar reserva
    async delete(id) {
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
        }
        catch (error) {
            console.error("Error deleting reservation:", error);
            return false;
        }
    }
    // VALIDACIONES - Verificar disponibilidad de horario (PÚBLICO)
    async isTimeSlotAvailable(date, time, excludeReservationId) {
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
                status: { not: client_1.ReservationStatus.CANCELLED }, // Usar enum de Prisma
                NOT: excludeReservationId ? { id: excludeReservationId } : undefined,
            },
        });
        return conflictingReservations.length === 0;
    }
}
exports.default = new ReservationModel();
