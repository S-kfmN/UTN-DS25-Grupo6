// Interfaces de Reserva
export interface Reservation {
  id: number;
  userId: number;           // ID del usuario que hace la reserva
  vehicleId: number;        // ID del vehículo para la reserva
  serviceType: string;      // Tipo de servicio solicitado
  date: string;             // Fecha de la reserva (YYYY-MM-DD)
  time: string;             // Hora de la reserva (HH:MM)
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;           // Notas adicionales del usuario
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  vehicleId: number;
  serviceType: string;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateReservationRequest {
  vehicleId?: number;
  serviceType?: string;
  date?: string;
  time?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ReservationResponse {
  id: number;
  userId: number;
  vehicleId: number;
  serviceType: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Datos relacionados (para respuestas completas)
  vehicle?: {
    license: string;
    brand: string;
    model: string;
  };
  service?: {
    name: string;
    description: string;
    price: number;
  };
}

