import { Request, Response } from 'express';
import VehicleModel from '../models/Vehicle';
import { CreateVehicleRequest, UpdateVehicleRequest } from '../types/vehicle';

// CREATE - Crear vehículo
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Del middleware de autenticación
    const vehicleData: CreateVehicleRequest = req.body;

    // Validaciones básicas
    if (!vehicleData.license || !vehicleData.brand || !vehicleData.model || !vehicleData.year || !vehicleData.color) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Validar año del vehículo
    if (vehicleData.year < 1900 || vehicleData.year > new Date().getFullYear() + 1) {
      return res.status(400).json({
        success: false,
        message: 'Año del vehículo inválido'
      });
    }

    // Verificar si la patente ya existe
    const existingVehicle = await VehicleModel.findByLicense(vehicleData.license);
    if (existingVehicle) {
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
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// READ - Obtener vehículos del usuario
export const getUserVehicles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const vehicles = await VehicleModel.findByUserId(userId);

    res.json({
      success: true,
      data: vehicles
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// READ - Obtener vehículo específico
export const getVehicle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
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

// UPDATE - Actualizar vehículo
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
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
      const existingVehicle = await VehicleModel.findByLicense(updateData.license);
      if (existingVehicle) {
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
    const userId = (req as any).userId;
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


