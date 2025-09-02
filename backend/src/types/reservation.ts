import { ReservationStatus } from "@prisma/client";

// Interfaces de Reserva
export interface Reservation {
  id: number;
  userId: number;           // ID del usuario que hace la reserva
  vehicleId: number;        // ID del vehículo para la reserva
  serviceId: number;        // ID del servicio solicitado (Cambiado de serviceType a serviceId)
  date: string;             // Fecha de la reserva (YYYY-MM-DD)
  time: string;             // Hora de la reserva (HH:MM)
  status: ReservationStatus; // Cambiado a ReservationStatus
  notes: string | null;     // Cambiado a string | null para coincidir con Prisma
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationRequest {
  vehicleId: number;
  serviceId: number; // Cambiado de serviceType a serviceId
  date: string;
  time: string;
  notes?: string | null; // Cambiado a string | null para coincidir con Prisma
}

export interface UpdateReservationRequest {
  vehicleId?: number;
  serviceId?: number; // Cambiado de serviceType a serviceId
  date?: string;
  time?: string;
  status?: ReservationStatus; // Cambiado a ReservationStatus
  notes?: string | null; // Cambiado a string | null para coincidir con Prisma
}

export interface ReservationResponse {
  id: number;
  userId: number;
  vehicleId: number;
  serviceId: number; // Cambiado de serviceType a serviceId
  date: string;
  time: string;
  status: ReservationStatus; // Cambiado a ReservationStatus
  notes?: string | null; // Cambiado a string | null para coincidir con Prisma
  createdAt: Date;
  updatedAt: Date;
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

