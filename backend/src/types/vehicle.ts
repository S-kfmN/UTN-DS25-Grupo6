import { VehicleStatus } from "@prisma/client";

// Interfaces de Vehículo
export interface Vehicle {
  id: number;
  license: string;        // Patente del vehículo
  brand: string;          // Marca (Renault, Ford, etc.)
  model: string;          // Modelo específico
  year: number;           // Año de fabricación
  color: string;          // Color del vehículo
  userId: number;         // ID del usuario propietario
  status: VehicleStatus;  // Estado del vehículo (cambiado a VehicleStatus)
  createdAt: Date; // Cambiado de string a Date
  updatedAt: Date; // Cambiado de string a Date
}

export interface CreateVehicleRequest {
  license: string;
  brand: string;
  model: string;
  year: number;
  color: string;
}

export interface UpdateVehicleRequest {
  license?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  status?: VehicleStatus;  // Estado del vehículo (cambiado a VehicleStatus)
}

export interface VehicleResponse {
  success: boolean;
  data?: Vehicle | Vehicle[];
  message?: string;
}


