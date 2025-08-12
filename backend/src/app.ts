import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import vehicleRoutes from './routes/vehicles';
import reservationRoutes from './routes/reservations';
import serviceRoutes from './routes/services';
import adminRoutes from './routes/admin';

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Puerto donde correrá el servidor
const PORT = process.env.PORT || 3000;

// MIDDLEWARES GLOBALES - Se ejecutan en todas las peticiones
app.use(helmet());        // Seguridad básica (headers de seguridad)
app.use(cors());          // Permite peticiones desde el frontend
app.use(morgan('dev'));   // Logs de peticiones HTTP (para debugging)
app.use(express.json());  // Permite recibir JSON en el body de las peticiones

// RUTAS DE LA API
app.use('/api/auth', authRoutes);           // /api/auth/register, /api/auth/login
app.use('/api/users', userRoutes);          // /api/users/profile, /api/users/change-password
app.use('/api/vehicles', vehicleRoutes);    // /api/vehicles (CRUD de vehículos)
app.use('/api/reservations', reservationRoutes); // CRUD de reservas
console.log('✅ Ruta /api/reservations registrada');
app.use('/api/services', serviceRoutes);    // CRUD de servicios
console.log('✅ Ruta /api/services registrada');
app.use('/api/admin', adminRoutes);         // Panel de administración
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

export default app;