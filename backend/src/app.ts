import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Importar rutas
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { vehicleRoutes } from './routes/vehicles';
import { reservationRoutes } from './routes/reservations';
import { serviceRoutes } from './routes/services';
import adminRoutes from './routes/admin';

// Cargar variables de entorno
dotenv.config();

// Inicializar Prisma Client
import prisma, { disconnectPrisma } from './config/prisma';

// Crear la aplicación Express
const app = express();

// Puerto donde correrá el servidor
const PORT = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// MIDDLEWARES GLOBALES - Se ejecutan en todas las peticiones
app.use(helmet());        // Seguridad básica (headers de seguridad)
app.use(cors(corsOptions)); // Permite peticiones desde el frontend con configuración específica
app.use(morgan('dev'));   // Logs de peticiones HTTP (para debugging)
app.use(express.json());  // Permite recibir JSON en el body de las peticiones

// Middleware para hacer Prisma disponible en todas las rutas
app.use((req, res, next) => {
  (req as any).prisma = prisma;
  next();
});

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

// Función para probar la conexión a la base de datos
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

// INICIAR EL SERVIDOR
const server = app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 API disponible en: http://localhost:${PORT}`);
  console.log(`🔐 Endpoints de autenticación: http://localhost:${PORT}/api/auth`);
  console.log(`👤 Endpoints de usuarios: http://localhost:${PORT}/api/users`);
  console.log(`🚗 Endpoints de vehículos: http://localhost:${PORT}/api/vehicles`);
  console.log(`📅 Endpoints de reservas: http://localhost:${PORT}/api/reservations`);
  console.log(`🛠️ Endpoints de servicios: http://localhost:${PORT}/api/services`);
  console.log(`🏢 Panel de administración: http://localhost:${PORT}/api/admin`);
  
  // Probar conexión a la base de datos
  await testDatabaseConnection();
});

// Manejo graceful de cierre
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await disconnectPrisma();
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await disconnectPrisma();
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

export default app;