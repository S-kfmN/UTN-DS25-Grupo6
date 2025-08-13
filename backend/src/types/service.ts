// Interfaces para el CRUD de Servicios del Lubricentro
// Define los tipos para gestionar los servicios ofrecidos

// ========================================
// INTERFACES PRINCIPALES
// ========================================

// Interface para la entidad Service
export interface Service {
  id: number;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: number;        // Duración en minutos
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Categorías de servicios disponibles
export type ServiceCategory = 'mantenimiento' | 'reparacion' | 'diagnostico' | 'limpieza' | 'otros';

// ========================================
// INTERFACES PARA REQUEST/RESPONSE
// ========================================

// Interface para crear un nuevo servicio
export interface CreateServiceRequest {
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: number;
}

// Interface para actualizar un servicio existente
export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  category?: ServiceCategory;
  price?: number;
  duration?: number;
  isActive?: boolean;
}

// ========================================
// INTERFACES PARA FILTROS Y BÚSQUEDAS
// ========================================

// Interface para filtros de búsqueda
export interface ServiceFilters {
  category?: ServiceCategory;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Interface para respuesta de búsqueda
export interface ServiceSearchResponse {
  services: Service[];
  total: number;
  filters: ServiceFilters;
}

// ========================================
// INTERFACES PARA ESTADÍSTICAS
// ========================================

// Interface para estadísticas de servicio
export interface ServiceStats {
  serviceId: number;
  serviceName: string;
  totalReservations: number;
  totalRevenue: number;
  averageRating?: number;
  popularity: 'bajo' | 'medio' | 'alto';
}

// Interface para categorías con conteo
export interface CategoryStats {
  category: ServiceCategory;
  count: number;
  averagePrice: number;
  totalServices: number;
}
