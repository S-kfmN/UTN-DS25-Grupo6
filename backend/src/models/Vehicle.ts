import { Vehicle, CreateVehicleRequest, UpdateVehicleRequest } from '../types/vehicle';
import { PrismaClient, VehicleStatus } from '@prisma/client';

const prisma = new PrismaClient();

class VehicleModel {
  // private vehicles: Vehicle[] = [];
  // private nextId = 1;

  // CREATE - Crear vehículo
  async create(vehicleData: CreateVehicleRequest, userId: number): Promise<Vehicle> {
    // const newVehicle: Vehicle = {
    //   id: this.nextId++,
    //   ...vehicleData,
    //   userId,                    // Asociar al usuario
    //   status: 'active',          // Por defecto activo
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString()
    // };
    
    // this.vehicles.push(newVehicle);
    // return newVehicle;
    const newVehicle = await prisma.vehicle.create({
      data: {
        ...vehicleData,
        userId,
        status: VehicleStatus.ACTIVE, // Cambiado de 'active' a VehicleStatus.ACTIVE
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
    // const vehicleIndex = this.vehicles.findIndex(vehicle => vehicle.id === id);
    // if (vehicleIndex === -1) return null;

    // this.vehicles[vehicleIndex] = {
    //   ...this.vehicles[vehicleIndex],
    //   ...updateData,
    //   updatedAt: new Date().toISOString()
    // };

    // return this.vehicles[vehicleIndex];
    try {
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


