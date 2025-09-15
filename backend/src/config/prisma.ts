import { PrismaClient } from "@prisma/client";

// Configuración simple para evitar prepared statements
const prisma = new PrismaClient({
  log: ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Función para cerrar conexiones
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export default prisma;
