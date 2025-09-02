"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Modelo para el CRUD de Servicios
// Maneja la lógica de datos y operaciones CRUD para servicios
class ServiceModel {
    // Array en memoria para almacenar servicios (temporal hasta implementar base de datos)
    // private services: Service[] = [];
    // private nextId = 1;
    constructor() {
        // No necesitamos crear servicios de ejemplo en memoria si usamos una DB
        // this.createExampleServices();
    }
    // ========================================
    // OPERACIONES CRUD BÁSICAS
    // ========================================
    // CREATE - Crear un nuevo servicio
    async create(serviceData) {
        // Validar datos requeridos (la base de datos también hará esto si se configura NOT NULL)
        if (!serviceData.name || !serviceData.description || !serviceData.category ||
            serviceData.price <= 0 || serviceData.duration <= 0) {
            throw new Error('Todos los campos son requeridos y deben ser válidos');
        }
        const newService = await prisma.service.create({
            data: {
                ...serviceData,
                category: serviceData.category, // Asegurarse de que el enum se mapea correctamente
                isActive: true,
            },
        });
        console.log(`✅ Servicio creado: ${newService.name} (ID: ${newService.id})`);
        return newService;
    }
    // READ - Obtener todos los servicios (con filtro opcional)
    async findAll(onlyActive = false) {
        const whereClause = onlyActive ? { isActive: true } : {};
        const services = await prisma.service.findMany({
            where: whereClause,
        });
        // Mapear de PrismaServiceCategory a TypeServiceCategory si es necesario para la interfaz de salida
        return services;
    }
    // READ - Obtener servicio por ID
    async findById(id) {
        const service = await prisma.service.findUnique({
            where: { id: id },
        });
        return service;
    }
    // READ - Obtener servicios por categoría
    async findByCategory(category) {
        const services = await prisma.service.findMany({
            where: {
                category: category, // Ahora category es PrismaServiceCategory directamente
                isActive: true,
            },
        });
        return services;
    }
    // READ - Buscar servicios por nombre o descripción
    async searchServices(searchTerm) {
        const services = await prisma.service.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
        });
        return services;
    }
    // UPDATE - Actualizar servicio existente
    async update(id, updateData) {
        // Validar precio y duración si se proporcionan
        if (updateData.price !== undefined && updateData.price <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }
        if (updateData.duration !== undefined && updateData.duration <= 0) {
            throw new Error('La duración debe ser mayor a 0');
        }
        try {
            const updatedService = await prisma.service.update({
                where: { id: id },
                data: {
                    ...updateData,
                    category: updateData.category, // category ya es PrismaServiceCategory si se proporciona
                    updatedAt: new Date(),
                },
            });
            console.log(`✅ Servicio actualizado: ${updatedService.name} (ID: ${id})`);
            return updatedService;
        }
        catch (error) {
            console.error("Error updating service:", error);
            return null;
        }
    }
    // DELETE - Eliminación lógica (soft delete)
    async delete(id) {
        try {
            await prisma.service.update({
                where: { id: id },
                data: {
                    isActive: false,
                    updatedAt: new Date(),
                },
            });
            console.log(`✅ Servicio desactivado (soft delete): (ID: ${id})`);
            return true;
        }
        catch (error) {
            console.error("Error soft deleting service:", error);
            return false;
        }
    }
    // DELETE - Eliminación física (hard delete)
    async hardDelete(id) {
        try {
            await prisma.service.delete({
                where: { id: id },
            });
            console.log(`🗑️ Servicio eliminado permanentemente (ID: ${id})`);
            return true;
        }
        catch (error) {
            console.error("Error hard deleting service:", error);
            return false;
        }
    }
    // ========================================
    // OPERACIONES ESPECIALIZADAS
    // ========================================
    // Obtener estadísticas básicas de servicios
    async getServiceStats() {
        const total = await prisma.service.count();
        const active = await prisma.service.count({
            where: { isActive: true },
        });
        const services = await prisma.service.findMany({
            select: { category: true, price: true },
        });
        const byCategory = {};
        services.forEach(service => {
            byCategory[service.category] = (byCategory[service.category] || 0) + 1;
        });
        const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
        const averagePrice = total > 0 ? totalPrice / total : 0;
        return {
            total,
            active,
            byCategory,
            averagePrice: Math.round(averagePrice * 100) / 100
        };
    }
}
// Exportar una instancia única del modelo (Singleton pattern)
exports.default = new ServiceModel();
