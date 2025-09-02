import { Request, Response } from 'express';
import UserModel from '../models/User';
import VehicleModel from '../models/Vehicle';
import ReservationModel from '../models/Reservation';
import ServiceModel from '../models/Service';
import { AdminUserSummary, AdminVehicleSummary, AdminReservationSummary, AdminServiceSummary, AdminUpdateUserRequest, SystemStats, AdminSearchFilters, PaginatedResponse, AdminUpdateReservationRequest } from '../types/admin'; // Agregado AdminUpdateReservationRequest
import { UserRole, VehicleStatus, ServiceCategory, ReservationStatus } from '@prisma/client'; // Importar enums de Prisma

// Controlador para el CRUD de Administración del Sistema
// Maneja todas las operaciones administrativas: usuarios, vehículos, reservas, servicios

// ========================================
// GESTIÓN DE USUARIOS (ADMIN)
// ========================================

// READ - Obtener lista de usuarios para admin
export const getUsersList = async (req: Request, res: Response) => {
  try {
    // Extraer parámetros de query para filtros
    const { role, isActive, limit = 50, offset = 0 } = req.query;
    
    // Obtener todos los usuarios del modelo
    const allUsers = await UserModel.findAll();
    
    // Aplicar filtros
    let filteredUsers = allUsers;
    
    // Filtrar por rol si se especifica
    if (role && typeof role === 'string') {
      const roleFilter = role.toUpperCase() as UserRole;
      if (Object.values(UserRole).includes(roleFilter)) {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }
    }
    
    // Filtrar por estado activo si se especifica
    if (isActive !== undefined) {
      const activeFilter = isActive === 'true';
      filteredUsers = filteredUsers.filter(user => user.isActive === activeFilter);
    }
    
    // Aplicar paginación
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    // Enriquecer datos con conteos
    const enrichedUsers: AdminUserSummary[] = await Promise.all(
      paginatedUsers.map(async (user) => {
        // Contar vehículos del usuario
        const userVehicles = await VehicleModel.findByUserId(user.id);
        
        // Contar reservas del usuario
        const userReservations = await ReservationModel.findByUserId(user.id);
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt, // No usar toISOString()
          vehicleCount: userVehicles.length,
          reservationCount: userReservations.length
        };
      })
    );
    
    // Respuesta exitosa
    res.json({
      success: true,
      data: {
        users: enrichedUsers,
        total: filteredUsers.length,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: filteredUsers.length
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener lista de usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// READ - Obtener detalles completos de un usuario
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    // Extraer el ID del usuario de los parámetros
    const userId = parseInt(req.params.id);
    
    // Validar que el ID sea un número válido
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    // Buscar el usuario por ID
    const user = await UserModel.findById(userId);
    
    // Si no se encuentra el usuario
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Obtener vehículos del usuario
    const userVehicles = await VehicleModel.findByUserId(userId);
    
    // Obtener reservas del usuario
    const userReservations = await ReservationModel.findByUserId(userId);
    
    // Construir respuesta enriquecida
    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt, // No usar toISOString()
      updatedAt: user.updatedAt, // No usar toISOString()
      vehicles: userVehicles.map(vehicle => ({
        id: vehicle.id,
        license: vehicle.license,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        isActive: vehicle.status === VehicleStatus.ACTIVE, // Mapear estado a isActive booleano
        createdAt: vehicle.createdAt // No usar toISOString()
      })),
      reservations: userReservations.map(reservation => ({
        id: reservation.id,
        date: reservation.date,
        time: reservation.time,
        status: reservation.status,
        serviceId: reservation.serviceId, // Usar serviceId
        // TODO: Cargar el nombre del servicio para mostrar serviceType
        createdAt: reservation.createdAt // No usar toISOString()
      }))
    };
    
    // Respuesta exitosa
    res.json({
      success: true,
      data: {
        user: userDetails
      }
    });

  } catch (error) {
    console.error('Error al obtener detalles de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// UPDATE - Actualizar usuario desde admin
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Extraer el ID del usuario y los datos de actualización
    const userId = parseInt(req.params.id);
    const updateData: AdminUpdateUserRequest = req.body;
    
    // Validar que el ID sea un número válido
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    // Validar que al menos un campo se proporcione para actualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }
    
    // Validar rol si se proporciona
    if (updateData.role && !Object.values(UserRole).includes(updateData.role)) {
      return res.status(400).json({
        success: false,
        message: `Rol inválido. Use: ${Object.values(UserRole).join(', ')}`
      });
    }
    
    // Buscar el usuario existente
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Actualizar el usuario
    const updatedUser = await UserModel.update(userId, updateData);
    
    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// DELETE - Desactivar usuario (admin)
export const deactivateUser = async (req: Request, res: Response) => {
  try {
    // Extraer el ID del usuario
    const userId = parseInt(req.params.id);
    
    // Validar que el ID sea un número válido
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    // Buscar el usuario existente
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // No permitir desactivar al último admin
    if (existingUser.role === UserRole.ADMIN) {
      const allAdmins = (await UserModel.findAll()).filter(u => u.role === UserRole.ADMIN && u.isActive);
      if (allAdmins.length === 1) {
        return res.status(400).json({
          success: false,
          message: 'No se puede desactivar al último administrador del sistema'
        });
      }
    }
    
    // Desactivar el usuario
    const updatedUser = await UserModel.update(userId, { isActive: false });
    
    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Usuario desactivado exitosamente',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ========================================
// GESTIÓN DE VEHÍCULOS (ADMIN)
// ========================================

// READ - Obtener lista de vehículos para admin
export const getVehiclesList = async (req: Request, res: Response) => {
  try {
    // Extraer parámetros de query para filtros
    const { brand, isActive, limit = 50, offset = 0 } = req.query;
    
    // Obtener todos los vehículos del modelo
    const allVehicles = await VehicleModel.findAll();
    
    // Aplicar filtros
    let filteredVehicles = allVehicles;
    
    // Filtrar por marca si se especifica
    if (brand && typeof brand === 'string') {
      filteredVehicles = filteredVehicles.filter(vehicle => 
        vehicle.brand.toLowerCase().includes(brand.toLowerCase())
      );
    }
    
    // Filtrar por estado activo si se especifica
    if (isActive !== undefined) {
      const activeFilter = isActive === 'true'; // Query param es string
      filteredVehicles = filteredVehicles.filter(vehicle => 
        (activeFilter && vehicle.status === VehicleStatus.ACTIVE) ||
        (!activeFilter && vehicle.status === VehicleStatus.INACTIVE)
      );
    }
    
    // Aplicar paginación
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);
    
    // Enriquecer datos con información del propietario y conteos
    const enrichedVehicles: AdminVehicleSummary[] = await Promise.all(
      paginatedVehicles.map(async (vehicle) => {
        // Obtener información del propietario
        const owner = await UserModel.findById(vehicle.userId);
        
        // Contar reservas del vehículo
        const vehicleReservations = await ReservationModel.findByUserId(vehicle.userId);
        const vehicleReservationCount = vehicleReservations.filter(r => 
          r.vehicleId === vehicle.id
        ).length;
        
        return {
          id: vehicle.id,
          license: vehicle.license,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color,
          isActive: vehicle.status === VehicleStatus.ACTIVE, // Mapear estado a isActive booleano
          createdAt: vehicle.createdAt, // No usar toISOString()
          ownerName: owner?.name || 'Usuario no encontrado',
          ownerEmail: owner?.email || 'Email no disponible',
          reservationCount: vehicleReservationCount
        };
      })
    );
    
    // Respuesta exitosa
    res.json({
      success: true,
      data: {
        vehicles: enrichedVehicles,
        total: filteredVehicles.length,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: filteredVehicles.length
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener lista de vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ========================================
// GESTIÓN DE RESERVAS (ADMIN)
// ========================================

// READ - Obtener lista de reservas para admin
export const getReservationsList = async (req: Request, res: Response) => {
  try {
    // Extraer parámetros de query para filtros
    const { status, date, limit = 50, offset = 0 } = req.query;
    
    // Obtener todas las reservas del modelo
    const allReservations = await ReservationModel.findAll();
    
    // Aplicar filtros
    let filteredReservations = allReservations;
    
    // Filtrar por estado si se especifica
    if (status && typeof status === 'string') {
      const statusFilter = status.toUpperCase() as ReservationStatus;
      if (Object.values(ReservationStatus).includes(statusFilter)) {
        filteredReservations = filteredReservations.filter(reservation => 
          reservation.status === statusFilter
        );
      }
    }
    
    // Filtrar por fecha si se especifica
    if (date && typeof date === 'string') {
      filteredReservations = filteredReservations.filter(reservation => 
        reservation.date === date
      );
    }
    
    // Aplicar paginación
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedReservations = filteredReservations.slice(startIndex, endIndex);
    
    // Enriquecer datos con información del cliente y vehículo
    const enrichedReservations: AdminReservationSummary[] = await Promise.all(
      paginatedReservations.map(async (reservation) => {
        // Obtener información del cliente
        const customer = await UserModel.findById(reservation.userId);
        
        // Obtener información del vehículo
        const vehicle = await VehicleModel.findById(reservation.vehicleId);
        
        // TODO: Obtener información del servicio para mostrar serviceType y price
        const service = await ServiceModel.findById(reservation.serviceId);
        
        return {
          id: reservation.id,
          date: reservation.date,
          time: reservation.time,
          status: reservation.status,
          serviceType: service?.name || 'Servicio no encontrado', // Usar el nombre del servicio
          price: service?.price || 0, // Usar el precio del servicio
          createdAt: reservation.createdAt, // No usar toISOString()
          customerName: customer?.name || 'Usuario no encontrado',
          customerEmail: customer?.email || 'Email no disponible',
          vehicleLicense: vehicle?.license || 'Placa no disponible',
          vehicleBrand: vehicle?.brand || 'Marca no disponible',
          vehicleModel: vehicle?.model || 'Modelo no disponible'
        };
      })
    );
    
    // Respuesta exitosa
    res.json({
      success: true,
      data: {
        reservations: enrichedReservations,
        total: filteredReservations.length,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: filteredReservations.length
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener lista de reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// UPDATE - Actualizar reserva desde admin
export const updateReservation = async (req: Request, res: Response) => {
  try {
    // Extraer el ID de la reserva y los datos de actualización
    const reservationId = parseInt(req.params.id);
    const updateData: AdminUpdateReservationRequest = req.body;
    
    // Validar que el ID sea un número válido
    if (isNaN(reservationId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de reserva inválido'
      });
    }
    
    // Validar que al menos un campo se proporcione para actualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }
    
    // Validar estado si se proporciona
    if (updateData.status && !Object.values(ReservationStatus).includes(updateData.status)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Use: ${Object.values(ReservationStatus).join(', ')}`
      });
    }
    
    // Buscar la reserva existente
    const existingReservation = await ReservationModel.findById(reservationId);
    if (!existingReservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }
    
    // Actualizar la reserva
    const updatedReservation = await ReservationModel.update(reservationId, updateData);
    
    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Reserva actualizada exitosamente',
      data: {
        reservation: updatedReservation
      }
    });

  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ========================================
// GESTIÓN DE SERVICIOS (ADMIN)
// ========================================

// READ - Obtener lista de servicios para admin
export const getServicesList = async (req: Request, res: Response) => {
  try {
    // Extraer parámetros de query para filtros
    const { category, isActive, limit = 50, offset = 0 } = req.query;
    
    // Obtener todos los servicios del modelo
    const allServices = await ServiceModel.findAll();
    
    // Aplicar filtros
    let filteredServices = allServices;
    
    // Filtrar por categoría si se especifica
    if (category && typeof category === 'string') {
      const categoryFilter = category.toUpperCase() as ServiceCategory;
      if (Object.values(ServiceCategory).includes(categoryFilter)) {
        filteredServices = filteredServices.filter(service => 
          service.category === categoryFilter
        );
      }
    }
    
    // Filtrar por estado activo si se especifica
    if (isActive !== undefined) {
      const activeFilter = isActive === 'true';
      filteredServices = filteredServices.filter(service => service.isActive === activeFilter);
    }
    
    // Aplicar paginación
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedServices = filteredServices.slice(startIndex, endIndex);
    
    // Enriquecer datos con conteo de reservas
    const enrichedServices: AdminServiceSummary[] = await Promise.all(
      paginatedServices.map(async (service) => {
        // Por ahora el conteo es 0, se puede implementar en el futuro
        const reservationCount = 0; // TODO: Implementar conteo de reservas para el servicio
        
        return {
          id: service.id,
          name: service.name,
          category: service.category,
          price: service.price,
          duration: service.duration,
          isActive: service.isActive,
          reservationCount,
          createdAt: service.createdAt // No usar toISOString()
        };
      })
    );
    
    // Respuesta exitosa
    res.json({
      success: true,
      data: {
        services: enrichedServices,
        total: filteredServices.length,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: filteredServices.length
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener lista de servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ========================================
// ESTADÍSTICAS DEL SISTEMA
// ========================================

// READ - Obtener estadísticas generales del sistema
export const getSystemStats = async (req: Request, res: Response) => {
  try {
    // Obtener todos los datos del sistema
    const allUsers = await UserModel.findAll();
    const allVehicles = await VehicleModel.findAll();
    const allReservations = await ReservationModel.findAll();
    const allServices = await ServiceModel.findAll();
    
    // Calcular estadísticas de usuarios
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(user => user.isActive).length;
    const usersByRole: Record<UserRole, number> = { [UserRole.ADMIN]: 0, [UserRole.MECHANIC]: 0, [UserRole.USER]: 0 };
    allUsers.forEach(user => {
      usersByRole[user.role]++;
    });
    
    // Calcular estadísticas de vehículos
    const totalVehicles = allVehicles.length;
    const activeVehicles = allVehicles.filter(vehicle => vehicle.status === VehicleStatus.ACTIVE).length;
    
    // Calcular estadísticas de reservas
    const totalReservations = allReservations.length;
    const reservationsByStatus: Record<ReservationStatus, number> = {
      [ReservationStatus.PENDING]: allReservations.filter(r => r.status === ReservationStatus.PENDING).length,
      [ReservationStatus.CONFIRMED]: allReservations.filter(r => r.status === ReservationStatus.CONFIRMED).length,
      [ReservationStatus.COMPLETED]: allReservations.filter(r => r.status === ReservationStatus.COMPLETED).length,
      [ReservationStatus.CANCELLED]: allReservations.filter(r => r.status === ReservationStatus.CANCELLED).length
    };
    
    // Calcular estadísticas de servicios
    const totalServices = allServices.length;
    const activeServices = allServices.filter(service => service.isActive).length;
    
    // Construir objeto de estadísticas
    const systemStats: SystemStats = {
      // Usuarios
      totalUsers,
      activeUsers,
      usersByRole,
      
      // Vehículos
      totalVehicles,
      activeVehicles,
      
      // Reservas
      totalReservations,
      reservationsByStatus,
      reservationsByMonth: [], // Por implementar en el futuro
      
      // Servicios
      totalServices,
      activeServices,
      topServices: [], // Por implementar en el futuro
      
      // Financiero
      totalRevenue: 0, // Por implementar en el futuro
      averageReservationValue: 0, // Por implementar en el futuro
      
      // Sistema
      serverUptime: process.uptime().toString(),
      lastBackup: new Date().toISOString(), // Por implementar en el futuro
      systemVersion: '1.0.0'
    };
    
    // Respuesta exitosa
    res.json({
      success: true,
      data: {
        stats: systemStats
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del sistema:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ========================================
// OPERACIONES DEL SISTEMA
// ========================================

// READ - Obtener información del sistema
export const getSystemInfo = async (req: Request, res: Response) => {
  try {
    const systemInfo = {
      name: 'API del Lubricentro Renault',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };
    
    // Respuesta exitosa
    res.json({
      success: true,
      data: {
        system: systemInfo
      }
    });

  } catch (error) {
    console.error('Error al obtener información del sistema:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

