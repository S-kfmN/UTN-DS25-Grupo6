"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Importar rutas
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const reservations_1 = __importDefault(require("./routes/reservations"));
const services_1 = __importDefault(require("./routes/services"));
const admin_1 = __importDefault(require("./routes/admin"));
// Cargar variables de entorno
dotenv_1.default.config();
// Crear la aplicación Express
const app = (0, express_1.default)();
// Puerto donde correrá el servidor
const PORT = process.env.PORT || 3000;
// MIDDLEWARES GLOBALES - Se ejecutan en todas las peticiones
app.use((0, helmet_1.default)()); // Seguridad básica (headers de seguridad)
app.use((0, cors_1.default)()); // Permite peticiones desde el frontend
app.use((0, morgan_1.default)('dev')); // Logs de peticiones HTTP (para debugging)
app.use(express_1.default.json()); // Permite recibir JSON en el body de las peticiones
// RUTAS DE LA API
app.use('/api/auth', auth_1.default); // /api/auth/register, /api/auth/login
app.use('/api/users', users_1.default); // /api/users/profile, /api/users/change-password
app.use('/api/vehicles', vehicles_1.default); // /api/vehicles (CRUD de vehículos)
app.use('/api/reservations', reservations_1.default); // CRUD de reservas
console.log('✅ Ruta /api/reservations registrada');
app.use('/api/services', services_1.default); // CRUD de servicios
console.log('✅ Ruta /api/services registrada');
app.use('/api/admin', admin_1.default); // Panel de administración
console.log('✅ Ruta /api/admin registrada');
// RUTA DE PRUEBA - Para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.json({
        message: 'API del Lubricentro Renault funcionando!',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            vehicles: '/api/vehicles',
            reservations: '/api/reservations',
            services: '/api/services',
            admin: '/api/admin'
        }
    });
});
// MANEJADOR DE ERRORES - Para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});
// INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📱 API disponible en: http://localhost:${PORT}`);
    console.log(`🔐 Endpoints de autenticación: http://localhost:${PORT}/api/auth`);
    console.log(`👤 Endpoints de usuarios: http://localhost:${PORT}/api/users`);
    console.log(`🚗 Endpoints de vehículos: http://localhost:${PORT}/api/vehicles`);
    console.log(`📅 Endpoints de reservas: http://localhost:${PORT}/api/reservations`);
    console.log(`🛠️ Endpoints de servicios: http://localhost:${PORT}/api/services`);
    console.log(`🏢 Panel de administración: http://localhost:${PORT}/api/admin`);
});
exports.default = app;
