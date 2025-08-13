import { Reservation, CreateReservationRequest, UpdateReservationRequest } from '../types/reservation';

class ReservationModel {
  private reservations: Reservation[] = [];
  private nextId = 1;

  // CREATE - Crear reserva
  async create(reservationData: CreateReservationRequest, userId: number): Promise<Reservation> {
    const newReservation: Reservation = {
      id: this.nextId++,
      ...reservationData,
      userId,
      status: 'pending', // Por defecto pendiente
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.reservations.push(newReservation);
    return newReservation;
  }

  // READ - Obtener reservas de un usuario específico
  async findByUserId(userId: number): Promise<Reservation[]> {
    return this.reservations.filter(reservation => reservation.userId === userId);
  }

  // READ - Obtener reserva por ID
  async findById(id: number): Promise<Reservation | null> {
    return this.reservations.find(reservation => reservation.id === id) || null;
  }

  // READ - Obtener todas las reservas (para admin)
  async findAll(): Promise<Reservation[]> {
    return this.reservations;
  }

  // READ - Obtener reservas por fecha
  async findByDate(date: string): Promise<Reservation[]> {
    return this.reservations.filter(reservation => reservation.date === date);
  }

  // UPDATE - Actualizar reserva
  async update(id: number, updateData: UpdateReservationRequest): Promise<Reservation | null> {
    const reservationIndex = this.reservations.findIndex(r => r.id === id);
    
    if (reservationIndex === -1) {
      return null;
    }

    this.reservations[reservationIndex] = {
      ...this.reservations[reservationIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return this.reservations[reservationIndex];
  }

  // UPDATE - Cambiar estado de reserva
  async updateStatus(id: number, status: 'pending' | 'confirmed' | 'completed' | 'cancelled'): Promise<Reservation | null> {
    return this.update(id, { status });
  }

  // DELETE - Eliminar reserva
  async delete(id: number): Promise<boolean> {
    const reservationIndex = this.reservations.findIndex(r => r.id === id);
    
    if (reservationIndex === -1) {
      return false;
    }

    this.reservations.splice(reservationIndex, 1);
    return true;
  }

  // VALIDACIONES - Verificar disponibilidad de horario (PÚBLICO)
  public async isTimeSlotAvailable(date: string, time: string, excludeReservationId?: number): Promise<boolean> {
    const conflictingReservations = this.reservations.filter(reservation => 
      reservation.date === date && 
      reservation.time === time && 
      reservation.status !== 'cancelled' &&
      (!excludeReservationId || reservation.id !== excludeReservationId)
    );

    return conflictingReservations.length === 0;
  }
}

export default new ReservationModel();

