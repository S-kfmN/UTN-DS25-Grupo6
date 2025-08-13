// Interfaces para el CRUD de Administración del Sistema
// Permite gestionar usuarios, vehículos, reservas y servicios desde un panel central

// ========================================
// INTERFACES PARA GESTIÓN DE USUARIOS
// ========================================

// Interface para listar usuarios (versión resumida para admin)
export interface AdminUserSummary {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'mechanic' | 'user';
  isActive: boolean;
  createdAt: string;
  vehicleCount: number;        // Número de vehículos del usuario
  reservationCount: number;    // Número de reservas del usuario
}

// Interface para detalles completos de usuario (admin)
export interface AdminUserDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'mechanic' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Datos relacionados
  vehicles: AdminVehicleSummary[];
  reservations: AdminReservationSummary[];
}

// Interface para actualizar usuario desde admin
export interface AdminUpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'mechanic' | 'user';
  isActive?: boolean;
}

// ========================================
// INTERFACES PARA GESTIÓN DE VEHÍCULOS
// ========================================

// Interface para listar vehículos (versión resumida para admin)
export interface AdminVehicleSummary {
  id: number;
  license: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  isActive: boolean;
  createdAt: string;
  // Datos del propietario
  ownerName: string;
  ownerEmail: string;
  reservationCount: number;    // Número de reservas para este vehículo
}

// Interface para detalles completos de vehículo (admin)
export interface AdminVehicleDetails {
  id: number;
  license: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Datos del propietario
  owner: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  // Reservas del vehículo
  reservations: AdminReservationSummary[];
}

// ========================================
// INTERFACES PARA GESTIÓN DE RESERVAS
// ========================================

// Interface para listar reservas (versión resumida para admin)
export interface AdminReservationSummary {
  id: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  serviceType: string;
  price: number;
  createdAt: string;
  // Datos del cliente
  customerName: string;
  customerEmail: string;
  // Datos del vehículo
  vehicleLicense: string;
  vehicleBrand: string;
  vehicleModel: string;
}

// Interface para detalles completos de reserva (admin)
export interface AdminReservationDetails {
  id: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  serviceType: string;
  price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Datos del cliente
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  // Datos del vehículo
  vehicle: {
    id: number;
    license: string;
    brand: string;
    model: string;
    year: number;
    color: string;
  };
}

// Interface para actualizar reserva desde admin
export interface AdminUpdateReservationRequest {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date?: string;
  time?: string;
  notes?: string;
}

// ========================================
// INTERFACES PARA GESTIÓN DE SERVICIOS
// ========================================

// Interface para listar servicios (versión resumida para admin)
export interface AdminServiceSummary {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: number;
  isActive: boolean;
  reservationCount: number;    // Número de reservas para este servicio
  createdAt: string;
}

// Interface para detalles completos de servicio (admin)
export interface AdminServiceDetails {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Estadísticas del servicio
  totalReservations: number;
  totalRevenue: number;        // Ingresos totales por este servicio
  averageRating?: number;      // Calificación promedio (futuro)
}

// ========================================
// INTERFACES PARA ESTADÍSTICAS DEL SISTEMA
// ========================================

// Interface para estadísticas generales del sistema
export interface SystemStats {
  // Usuarios
  totalUsers: number;
  activeUsers: number;
  usersByRole: {
    admin: number;
    mechanic: number;
    user: number;
  };
  
  // Vehículos
  totalVehicles: number;
  activeVehicles: number;
  
  // Reservas
  totalReservations: number;
  reservationsByStatus: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  reservationsByMonth: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
  
  // Servicios
  totalServices: number;
  activeServices: number;
  topServices: Array<{
    serviceId: number;
    serviceName: string;
    reservationCount: number;
    revenue: number;
  }>;
  
  // Financiero
  totalRevenue: number;
  averageReservationValue: number;
  
  // Sistema
  serverUptime: string;
  lastBackup: string;
  systemVersion: string;
}

// ========================================
// INTERFACES PARA OPERACIONES ADMIN
// ========================================

// Interface para respuesta de operación admin
export interface AdminOperationResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
  operation: string;
  adminId: number;
}

// Interface para filtros de búsqueda admin
export interface AdminSearchFilters {
  // Filtros generales
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  
  // Filtros de fecha
  startDate?: string;
  endDate?: string;
  
  // Filtros de estado
  status?: string;
  isActive?: boolean;
  
  // Filtros de rol
  role?: string;
  
  // Filtros de categoría
  category?: string;
  
  // Filtros de precio
  minPrice?: number;
  maxPrice?: number;
}

// Interface para paginación
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Interface para respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  success: boolean;
  message: string;
}

