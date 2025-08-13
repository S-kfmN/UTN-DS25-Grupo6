import { Service, CreateServiceRequest, UpdateServiceRequest } from '../types/service';

// Modelo para el CRUD de Servicios
// Maneja la lógica de datos y operaciones CRUD para servicios
class ServiceModel {
  // Array en memoria para almacenar servicios (temporal hasta implementar base de datos)
  private services: Service[] = [];
  private nextId = 1;

  constructor() {
    // Inicializar con algunos servicios de ejemplo para testing
    this.createExampleServices();
  }

  // ========================================
  // OPERACIONES CRUD BÁSICAS
  // ========================================

  // CREATE - Crear un nuevo servicio
  async create(serviceData: CreateServiceRequest): Promise<Service> {
    // Validar datos requeridos
    if (!serviceData.name || !serviceData.description || !serviceData.category || 
        serviceData.price <= 0 || serviceData.duration <= 0) {
      throw new Error('Todos los campos son requeridos y deben ser válidos');
    }

    // Crear nuevo servicio
    const newService: Service = {
      id: this.nextId++,
      ...serviceData,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Agregar al array
    this.services.push(newService);
    
    console.log(`✅ Servicio creado: ${newService.name} (ID: ${newService.id})`);
    return newService;
  }

  // READ - Obtener todos los servicios (con filtro opcional)
  async findAll(onlyActive: boolean = false): Promise<Service[]> {
    if (onlyActive) {
      return this.services.filter(service => service.isActive);
    }
    return [...this.services];
  }

  // READ - Obtener servicio por ID
  async findById(id: number): Promise<Service | null> {
    return this.services.find(service => service.id === id) || null;
  }

  // READ - Obtener servicios por categoría
  async findByCategory(category: string): Promise<Service[]> {
    return this.services.filter(service => 
      service.category === category && service.isActive
    );
  }

  // READ - Buscar servicios por nombre o descripción
  async searchServices(searchTerm: string): Promise<Service[]> {
    const term = searchTerm.toLowerCase();
    return this.services.filter(service => 
      service.isActive && (
        service.name.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term)
      )
    );
  }

  // UPDATE - Actualizar servicio existente
  async update(id: number, updateData: UpdateServiceRequest): Promise<Service | null> {
    const serviceIndex = this.services.findIndex(service => service.id === id);
    
    if (serviceIndex === -1) {
      return null;
    }

    // Actualizar campos proporcionados
    const updatedService = {
      ...this.services[serviceIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Validar precio y duración si se proporcionan
    if (updateData.price !== undefined && updateData.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }
    if (updateData.duration !== undefined && updateData.duration <= 0) {
      throw new Error('La duración debe ser mayor a 0');
    }

    this.services[serviceIndex] = updatedService;
    
    console.log(`✅ Servicio actualizado: ${updatedService.name} (ID: ${id})`);
    return updatedService;
  }

  // DELETE - Eliminación lógica (soft delete)
  async delete(id: number): Promise<boolean> {
    const service = await this.findById(id);
    if (!service) {
      return false;
    }

    // Soft delete: marcar como inactivo
    service.isActive = false;
    service.updatedAt = new Date().toISOString();
    
    console.log(`✅ Servicio desactivado: ${service.name} (ID: ${id})`);
    return true;
  }

  // DELETE - Eliminación física (hard delete)
  async hardDelete(id: number): Promise<boolean> {
    const initialLength = this.services.length;
    this.services = this.services.filter(service => service.id !== id);
    
    if (this.services.length < initialLength) {
      console.log(`🗑️ Servicio eliminado permanentemente (ID: ${id})`);
      return true;
    }
    return false;
  }

  // ========================================
  // OPERACIONES ESPECIALIZADAS
  // ========================================

  // Obtener estadísticas básicas de servicios
  async getServiceStats(): Promise<{
    total: number;
    active: number;
    byCategory: Record<string, number>;
    averagePrice: number;
  }> {
    const total = this.services.length;
    const active = this.services.filter(s => s.isActive).length;
    
    // Contar por categoría
    const byCategory: Record<string, number> = {};
    this.services.forEach(service => {
      byCategory[service.category] = (byCategory[service.category] || 0) + 1;
    });

    // Calcular precio promedio
    const totalPrice = this.services.reduce((sum, service) => sum + service.price, 0);
    const averagePrice = total > 0 ? totalPrice / total : 0;

    return {
      total,
      active,
      byCategory,
      averagePrice: Math.round(averagePrice * 100) / 100
    };
  }

  // ========================================
  // DATOS DE EJEMPLO PARA TESTING
  // ========================================

  private createExampleServices(): void {
    const exampleServices: CreateServiceRequest[] = [
      {
        name: 'Cambio de Aceite',
        description: 'Cambio completo de aceite del motor con filtro incluido',
        category: 'mantenimiento',
        price: 25000,
        duration: 45
      },
      {
        name: 'Cambio de Filtros',
        description: 'Cambio de filtros de aire, combustible y aceite',
        category: 'mantenimiento',
        price: 18000,
        duration: 30
      },
      {
        name: 'Diagnóstico Computarizado',
        description: 'Análisis completo del sistema electrónico del vehículo',
        category: 'diagnostico',
        price: 15000,
        duration: 60
      },
      {
        name: 'Limpieza de Inyectores',
        description: 'Limpieza y calibración de inyectores de combustible',
        category: 'reparacion',
        price: 35000,
        duration: 90
      },
      {
        name: 'Lavado de Motor',
        description: 'Limpieza profunda del compartimento del motor',
        category: 'limpieza',
        price: 12000,
        duration: 45
      }
    ];

    // Crear servicios de ejemplo
    exampleServices.forEach(serviceData => {
      try {
        this.create(serviceData);
      } catch (error) {
        console.error('Error al crear servicio de ejemplo:', error);
      }
    });

    console.log(`📋 ${exampleServices.length} servicios de ejemplo creados`);
  }
}

// Exportar una instancia única del modelo (Singleton pattern)
export default new ServiceModel();
