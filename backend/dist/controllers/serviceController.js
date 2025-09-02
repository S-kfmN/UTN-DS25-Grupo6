"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceStats = exports.hardDeleteService = exports.deleteService = exports.updateService = exports.searchServices = exports.getServicesByCategory = exports.getServiceById = exports.getAllServices = exports.createService = void 0;
const Service_1 = __importDefault(require("../models/Service"));
const client_1 = require("@prisma/client"); // Importar el enum de Prisma
// Controlador para el CRUD de Servicios
// Maneja la lógica de negocio y validaciones para servicios
// ========================================
// OPERACIONES CRUD BÁSICAS
// ========================================
// CREATE - Crear un nuevo servicio
const createService = async (req, res) => {
    try {
        // Extraer datos del body de la request
        const serviceData = req.body;
        // Validar que todos los campos requeridos estén presentes
        if (!serviceData.name || !serviceData.description || !serviceData.category ||
            serviceData.price === undefined || serviceData.duration === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos: name, description, category, price, duration'
            });
        }
        // Validar que el precio sea positivo
        if (serviceData.price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio debe ser mayor a 0'
            });
        }
        // Validar que la duración sea positiva
        if (serviceData.duration <= 0) {
            return res.status(400).json({
                success: false,
                message: 'La duración debe ser mayor a 0'
            });
        }
        // Validar que la categoría sea válida
        if (!Object.values(client_1.ServiceCategory).includes(serviceData.category)) {
            return res.status(400).json({
                success: false,
                message: `Categoría inválida. Use una de: ${Object.values(client_1.ServiceCategory).join(', ')}`
            });
        }
        // Crear el servicio usando el modelo
        const newService = await Service_1.default.create(serviceData);
        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Servicio creado exitosamente',
            data: {
                service: newService
            }
        });
    }
    catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear el servicio'
        });
    }
};
exports.createService = createService;
// READ - Obtener todos los servicios
const getAllServices = async (req, res) => {
    try {
        // Extraer parámetros de query
        const { onlyActive = 'true' } = req.query;
        // Convertir string a boolean
        const activeOnly = onlyActive === 'true';
        // Obtener servicios del modelo
        const services = await Service_1.default.findAll(activeOnly);
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                services,
                total: services.length,
                filters: {
                    onlyActive: activeOnly
                }
            }
        });
    }
    catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener los servicios'
        });
    }
};
exports.getAllServices = getAllServices;
// READ - Obtener servicio por ID
const getServiceById = async (req, res) => {
    try {
        // Extraer ID de los parámetros de la URL
        const serviceId = parseInt(req.params.id);
        // Validar que el ID sea un número válido
        if (isNaN(serviceId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de servicio inválido'
            });
        }
        // Buscar el servicio por ID
        const service = await Service_1.default.findById(serviceId);
        // Si no se encuentra el servicio
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                service
            }
        });
    }
    catch (error) {
        console.error('Error al obtener servicio por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener el servicio'
        });
    }
};
exports.getServiceById = getServiceById;
// READ - Obtener servicios por categoría
const getServicesByCategory = async (req, res) => {
    try {
        // Extraer categoría de los parámetros de la URL
        const { category } = req.params;
        // Validar que la categoría esté presente
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Categoría requerida'
            });
        }
        const categoryFilter = category.toUpperCase();
        if (!Object.values(client_1.ServiceCategory).includes(categoryFilter)) {
            return res.status(400).json({
                success: false,
                message: `Categoría inválida. Use una de: ${Object.values(client_1.ServiceCategory).join(', ')}`
            });
        }
        // Obtener servicios por categoría
        const services = await Service_1.default.findByCategory(categoryFilter);
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                services,
                total: services.length,
                category
            }
        });
    }
    catch (error) {
        console.error('Error al obtener servicios por categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener servicios por categoría'
        });
    }
};
exports.getServicesByCategory = getServicesByCategory;
// READ - Buscar servicios por término de búsqueda
const searchServices = async (req, res) => {
    try {
        // Extraer término de búsqueda de los query parameters
        const { q: searchTerm } = req.query;
        // Validar que el término de búsqueda esté presente
        if (!searchTerm || typeof searchTerm !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Término de búsqueda requerido'
            });
        }
        // Validar que el término tenga al menos 2 caracteres
        if (searchTerm.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'El término de búsqueda debe tener al menos 2 caracteres'
            });
        }
        // Buscar servicios
        const services = await Service_1.default.searchServices(searchTerm);
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                services,
                total: services.length,
                searchTerm
            }
        });
    }
    catch (error) {
        console.error('Error al buscar servicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al buscar servicios'
        });
    }
};
exports.searchServices = searchServices;
// UPDATE - Actualizar servicio existente
const updateService = async (req, res) => {
    try {
        // Extraer ID y datos de actualización
        const serviceId = parseInt(req.params.id);
        const updateData = req.body;
        // Validar que el ID sea un número válido
        if (isNaN(serviceId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de servicio inválido'
            });
        }
        // Validar que al menos un campo se proporcione para actualizar
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar al menos un campo para actualizar'
            });
        }
        // Validar precio si se proporciona
        if (updateData.price !== undefined && updateData.price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio debe ser mayor a 0'
            });
        }
        // Validar duración si se proporciona
        if (updateData.duration !== undefined && updateData.duration <= 0) {
            return res.status(400).json({
                success: false,
                message: 'La duración debe ser mayor a 0'
            });
        }
        // Validar categoría si se proporciona
        if (updateData.category) {
            if (!Object.values(client_1.ServiceCategory).includes(updateData.category)) {
                return res.status(400).json({
                    success: false,
                    message: `Categoría inválida. Use una de: ${Object.values(client_1.ServiceCategory).join(', ')}`
                });
            }
        }
        // Actualizar el servicio
        const updatedService = await Service_1.default.update(serviceId, updateData);
        // Si no se encuentra el servicio
        if (!updatedService) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }
        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Servicio actualizado exitosamente',
            data: {
                service: updatedService
            }
        });
    }
    catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar el servicio'
        });
    }
};
exports.updateService = updateService;
// DELETE - Eliminar servicio (soft delete)
const deleteService = async (req, res) => {
    try {
        // Extraer ID del servicio
        const serviceId = parseInt(req.params.id);
        // Validar que el ID sea un número válido
        if (isNaN(serviceId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de servicio inválido'
            });
        }
        // Eliminar el servicio (soft delete)
        const deleted = await Service_1.default.delete(serviceId);
        // Si no se encuentra el servicio
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }
        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Servicio eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar el servicio'
        });
    }
};
exports.deleteService = deleteService;
// DELETE - Eliminación física (hard delete)
const hardDeleteService = async (req, res) => {
    try {
        // Extraer ID del servicio
        const serviceId = parseInt(req.params.id);
        // Validar que el ID sea un número válido
        if (isNaN(serviceId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de servicio inválido'
            });
        }
        // Eliminar el servicio permanentemente
        const deleted = await Service_1.default.hardDelete(serviceId);
        // Si no se encuentra el servicio
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }
        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Servicio eliminado permanentemente'
        });
    }
    catch (error) {
        console.error('Error al eliminar servicio permanentemente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar el servicio'
        });
    }
};
exports.hardDeleteService = hardDeleteService;
// ========================================
// OPERACIONES ESPECIALIZADAS
// ========================================
// READ - Obtener estadísticas de servicios
const getServiceStats = async (req, res) => {
    try {
        // Obtener estadísticas del modelo
        const stats = await Service_1.default.getServiceStats();
        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                stats
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas de servicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener estadísticas'
        });
    }
};
exports.getServiceStats = getServiceStats;
