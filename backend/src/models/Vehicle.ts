import { Vehicle, CreateVehicleRequest, UpdateVehicleRequest } from '../types/vehicle';

class VehicleModel {
  private vehicles: Vehicle[] = [];
  private nextId = 1;

  // CREATE - Crear vehículo
  async create(vehicleData: CreateVehicleRequest, userId: number): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      id: this.nextId++,
      ...vehicleData,
      userId,                    // Asociar al usuario
      status: 'active',          // Por defecto activo
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.vehicles.push(newVehicle);
    return newVehicle;
  }

  // READ - Obtener vehículos de un usuario específico
  async findByUserId(userId: number): Promise<Vehicle[]> {
    return this.vehicles.filter(vehicle => vehicle.userId === userId);
  }

  // READ - Obtener vehículo por ID
  async findById(id: number): Promise<Vehicle | null> {
    return this.vehicles.find(vehicle => vehicle.id === id) || null;
  }

  // READ - Obtener vehículo por patente
  async findByLicense(license: string): Promise<Vehicle | null> {
    return this.vehicles.find(vehicle => vehicle.license === license) || null;
  }

  // UPDATE - Actualizar vehículo
  async update(id: number, updateData: UpdateVehicleRequest): Promise<Vehicle | null> {
    const vehicleIndex = this.vehicles.findIndex(vehicle => vehicle.id === id);
    if (vehicleIndex === -1) return null;

    this.vehicles[vehicleIndex] = {
      ...this.vehicles[vehicleIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return this.vehicles[vehicleIndex];
  }

  // DELETE - Eliminar vehículo
  async delete(id: number): Promise<boolean> {
    const vehicleIndex = this.vehicles.findIndex(vehicle => vehicle.id === id);
    if (vehicleIndex === -1) return false;

    this.vehicles.splice(vehicleIndex, 1);
    return true;
  }

  // READ - Obtener todos los vehículos (para admin)
  async findAll(): Promise<Vehicle[]> {
    return [...this.vehicles];
  }

  // Verificar si un vehículo pertenece a un usuario
  async belongsToUser(vehicleId: number, userId: number): Promise<boolean> {
    const vehicle = await this.findById(vehicleId);
    return vehicle ? vehicle.userId === userId : false;
  }
}

export default new VehicleModel();


