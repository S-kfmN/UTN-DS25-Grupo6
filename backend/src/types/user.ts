// Interfaces de Usuario
export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin' | 'mechanic';
    createdAt: string;
    updatedAt: string;
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
    phone?: string;
  }