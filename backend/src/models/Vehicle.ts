import { Vehicle, CreateVehicleRequest, UpdateVehicleRequest } from '../types/vehicle';
import { PrismaClient, VehicleStatus } from '../generated/prisma';
import prisma from '../config/prisma'; // Usar la instancia compartida

class VehicleModel {
  // private vehicles: Vehicle[] = [];
  // private nextId = 1;

  // Función helper para normalizar patentes
  private normalizarPatente(patente: string): string {
    if (!patente.includes('-')) {
      return patente.slice(0, 3) + '-' + patente.slice(3);
    }
    return patente;
  }

  // Validar si una patente ya existe (excluyendo un ID específico para edición)
  async validarPatenteUnica(patente: string, excludeId?: number): Promise<boolean> {
    const patenteNormalizada = this.normalizarPatente(patente);
    const existingVehicle = await this.findByLicense(patenteNormalizada);
    
    // Si no hay vehículo existente, la patente es única
    if (!existingVehicle) return true;
    
    // Si estamos editando y es el mismo vehículo, la patente es única
    if (excludeId && existingVehicle.id === excludeId) return true;
    
    // La patente ya existe
    return false;
  }

  // CREATE - Crear vehículo
  async create(vehicleData: CreateVehicleRequest, userId: number): Promise<Vehicle> {
    // Normalizar patente
    const patenteNormalizada = this.normalizarPatente(vehicleData.license);
    
    const newVehicle = await prisma.vehicle.create({
      data: {
        ...vehicleData,
        license: patenteNormalizada, // Usar patente normalizada
        color: vehicleData.color || null, // Manejar color vacío
        userId,
        status: VehicleStatus.ACTIVE,
      },
    });
    return newVehicle;
  }

  // READ - Obtener vehículos de un usuario específico
  async findByUserId(userId: number): Promise<Vehicle[]> {
    // return this.vehicles.filter(vehicle => vehicle.userId === userId);
    return await prisma.vehicle.findMany({
      where: { userId: userId },
    });
  }

  // READ - Obtener vehículo por ID
  async findById(id: number): Promise<Vehicle | null> {
    // return this.vehicles.find(vehicle => vehicle.id === id) || null;
    return await prisma.vehicle.findUnique({
      where: { id: id },
    });
  }

  // READ - Obtener vehículo por patente
  async findByLicense(license: string): Promise<Vehicle | null> {
    // return this.vehicles.find(vehicle => vehicle.license === license) || null;
    return await prisma.vehicle.findUnique({
      where: { license: license },
    });
  }

  // UPDATE - Actualizar vehículo
  async update(id: number, updateData: UpdateVehicleRequest): Promise<Vehicle | null> {
    try {
      // Si se está actualizando la patente, normalizarla
      if (updateData.license) {
        updateData.license = this.normalizarPatente(updateData.license);
      }

      const updatedVehicle = await prisma.vehicle.update({
        where: { id: id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });
      return updatedVehicle;
    } catch (error) {
      console.error("Error updating vehicle:", error);
      return null;
    }
  }

  // DELETE - Eliminar vehículo
  async delete(id: number): Promise<boolean> {
    // const vehicleIndex = this.vehicles.findIndex(vehicle => vehicle.id === id);
    // if (vehicleIndex === -1) return false;

    // this.vehicles.splice(vehicleIndex, 1);
    // return true;
    try {
      await prisma.vehicle.delete({
        where: { id: id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      return false;
    }
  }

  // READ - Obtener todos los vehículos (para admin)
  async findAll(): Promise<Vehicle[]> {
    // return [...this.vehicles];
    return await prisma.vehicle.findMany();
  }

  // Verificar si un vehículo pertenece a un usuario
  async belongsToUser(vehicleId: number, userId: number): Promise<boolean> {
    // const vehicle = await this.findById(vehicleId);
    // return vehicle ? vehicle.userId === userId : false;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    return vehicle ? vehicle.userId === userId : false;
  }
}

export default new VehicleModel();


