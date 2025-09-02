"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrMechanic = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Clave secreta para firmar y verificar tokens JWT
// En producción, esto debe estar en variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';
// Middleware principal de autenticación
// Se ejecuta antes de llegar al controlador para verificar el token
const authenticateToken = (req, res, next) => {
    // Obtener el token del header Authorization
    // Formato esperado: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Divide "Bearer TOKEN" y toma solo el TOKEN
    // Si no hay token, retornar error 401 (No autorizado)
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token de acceso requerido'
        });
    }
    try {
        // Verificar que el token sea válido usando la clave secreta
        // jwt.verify() decodifica el token y retorna la información del usuario
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Agregar la información del usuario a la request
        // Esto permite que el controlador sepa qué usuario está haciendo la petición
        req.userId = decoded.userId; // ID del usuario
        req.userRole = decoded.role; // Rol del usuario
        // next() permite que la petición continúe hacia el controlador
        next();
    }
    catch (error) {
        // Si el token es inválido o expiró, retornar error 403 (Prohibido)
        return res.status(403).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};
exports.authenticateToken = authenticateToken;
// Middleware para verificar si el usuario es administrador
// Se usa en rutas que solo los admins pueden acceder
const requireAdmin = (req, res, next) => {
    // Verificar si el rol del usuario es 'admin'
    if (req.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Se requieren permisos de administrador'
        });
    }
    // Si es admin, continuar hacia el controlador
    next();
};
exports.requireAdmin = requireAdmin;
// Middleware para verificar si el usuario es admin o mecánico
// Se usa en rutas que requieren permisos elevados
const requireAdminOrMechanic = (req, res, next) => {
    // Verificar si el rol es 'admin' O 'mechanic'
    if (req.userRole !== 'admin' && req.userRole !== 'mechanic') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Se requieren permisos de administrador o mecánico'
        });
    }
    // Si tiene permisos, continuar
    next();
};
exports.requireAdminOrMechanic = requireAdminOrMechanic;
