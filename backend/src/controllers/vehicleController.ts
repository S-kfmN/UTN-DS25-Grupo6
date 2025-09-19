import { Request, Response } from 'express';
import VehicleModel from '../models/Vehicle';
import { CreateVehicleRequest, UpdateVehicleRequest, Vehicle } from '../types/vehicle';
import { VehicleStatus } from '../types/vehicle'; // Added import for VehicleStatus

// CREATE - Crear vehículo
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Del middleware de autenticación
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const vehicleData: CreateVehicleRequest = req.body;

    // Validaciones básicas
    if (!vehicleData.license || !vehicleData.brand || !vehicleData.model || !vehicleData.year) {
      return res.status(400).json({
        success: false,
        message: 'Los campos patente, marca, modelo y año son requeridos'
      });
    }

    // Validar formato de patente
    const patenteRegex = /^[A-Z]{3}-?[0-9]{3}$/;
    if (!patenteRegex.test(vehicleData.license)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de patente inválido. Use: ABC-123 o ABC123'
      });
    }

    // Validar año del vehículo
    if (vehicleData.year < 1900 || vehicleData.year > new Date().getFullYear() + 1) {
      return res.status(400).json({
        success: false,
        message: 'Año del vehículo inválido'
      });
    }

    // Verificar si la patente ya existe (validación centralizada)
    const esPatenteUnica = await VehicleModel.validarPatenteUnica(vehicleData.license);
    if (!esPatenteUnica) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un vehículo con esa patente'
      });
    }

    // Crear vehículo
    const newVehicle = await VehicleModel.create(vehicleData, userId);

    res.status(201).json({
      success: true,
      data: newVehicle
    });

  } catch (error) {
    console.error('❌ Error en createVehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: (error as Error).message
    });
  }
};

// READ - Obtener vehículos del usuario
export const getUserVehicles = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role; // Obtener el rol del usuario
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const statusFilter = req.query.status === 'active' ? VehicleStatus.ACTIVE : undefined; 
    
    let vehicles: Vehicle[];

    // Si se proporciona un userId (es decir, la solicitud viene de MisVehiculos o similar)
    // La función debe devolver los vehículos asociados a este usuario, sin importar su rol.
    // La lógica para que los administradores vean TODOS los vehículos se maneja en cargarTodosLosVehiculos
    // en el frontend, que llama a la API sin un userId específico.
    if (userId) {
      console.log('👤 vehicleController: Obteniendo vehículos para userId:', userId);
      vehicles = await VehicleModel.findByUserId(userId, statusFilter);
    } else if (userRole === 'ADMIN') {
      // Si NO se proporciona userId y es admin, entonces se pide ALLVehicles
      console.log('👑 vehicleController: ADMIN detectado, obteniendo todos los vehículos...');
      vehicles = await VehicleModel.findAll();
    } else {
      // Caso por defecto para usuarios normales sin userId (esto no debería ocurrir con el middleware)
      console.log('⚠️ vehicleController: Caso no esperado: No userId y no ADMIN. Devolviendo vacío.');
      vehicles = [];
    }

    console.log('🚗 getUserVehicles - vehicles found:', vehicles.length);

    res.json({
      success: true,
      data: vehicles
    });

  } catch (error) {
    console.error('❌ Error en getUserVehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// READ - Obtener vehículo específico
export const getVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const vehicleId = parseInt(req.params.id);

    const vehicle = await VehicleModel.findById(vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Verificar que el vehículo pertenece al usuario
    if (vehicle.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este vehículo'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// READ - Obtener todos los vehículos (para admin)
export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver todos los vehículos.'
      });
    }

    const vehicles = await VehicleModel.findAll();
    
    console.log('👑 vehicleController: ADMIN - Obteniendo TODOS los vehículos. Encontrados:', vehicles.length);

    res.json({
      success: true,
      data: vehicles
    });

  } catch (error) {
    console.error('❌ Error en getAllVehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// UPDATE - Actualizar vehículo
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const vehicleId = parseInt(req.params.id);
    const updateData: UpdateVehicleRequest = req.body;

    // Verificar que el vehículo existe y pertenece al usuario
    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    if (vehicle.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar este vehículo'
      });
    }

    // Si se está actualizando la patente, verificar que no exista
    if (updateData.license && updateData.license !== vehicle.license) {
      // Verificar si la patente ya existe (validación centralizada)
      const esPatenteUnica = await VehicleModel.validarPatenteUnica(updateData.license, vehicleId);
      if (!esPatenteUnica) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un vehículo con esa patente'
        });
      }
    }

    // Actualizar vehículo
    const updatedVehicle = await VehicleModel.update(vehicleId, updateData);

    res.json({
      success: true,
      data: updatedVehicle
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// DELETE - Eliminar vehículo
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const vehicleId = parseInt(req.params.id);

    // Verificar que el vehículo existe y pertenece al usuario
    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    if (vehicle.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este vehículo'
      });
    }

    // Eliminar vehículo
    const deleted = await VehicleModel.delete(vehicleId);

    if (deleted) {
      res.json({
        success: true,
        message: 'Vehículo eliminado correctamente'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el vehículo'
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};


