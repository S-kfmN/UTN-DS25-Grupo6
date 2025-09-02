import { UserRole } from "@prisma/client";

// Interfaces de Usuario
export interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null; // Cambiado a string | null
    password?: string;
    role: UserRole; // Cambiado a UserRole
    isActive: boolean; // Añadido campo isActive
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
  }
  
  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }
  
  export interface UpdateProfileRequest {
    name?: string;
    email?: string;
    phone?: string | null; // Cambiado a string | null
    role?: UserRole; // Añadido campo role para actualización
    isActive?: boolean; // Añadido campo isActive
  }