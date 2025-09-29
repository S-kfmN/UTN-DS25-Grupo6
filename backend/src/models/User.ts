import { RegisterRequest } from '../types/user';
import { PrismaClient, User, UserRole } from '@prisma/client';

// Usar la instancia compartida de Prisma
const prisma = new PrismaClient();

// Implementación inicial con un array en memoria, pendiente de conexión a base de datos.
class UserModel {
  // private users: User[] = [];        // Array en memoria para almacenar usuarios
  // private nextId = 1;               // Contador para generar IDs únicos

  // CREATE - Crear usuario
  async create(userData: RegisterRequest): Promise<User> {
    // const newUser: User = {
    //   id: this.nextId++,
    //   ...userData,
    //   role: 'user', // Por defecto todos son usuarios
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString()
    // };
    
    // this.users.push(newUser);
    // return newUser;
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password, // Consideración: Hashear la contraseña antes de guardar en un entorno de producción.
        phone: userData.phone,
        role: UserRole.USER, // Cambiado a UserRole.USER
      },
    });
    return newUser;
  }

  // READ - Obtener usuario por ID
  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // READ - Obtener usuario por email
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // UPDATE - Actualizar usuario
  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    try {
      if (updateData.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: updateData.email },
        });
        if (existingUser && existingUser.id !== id) {
          throw new Error('El email ya está en uso por otro usuario.');
        }
      }

      const dataToUpdate: any = { updatedAt: new Date() };

      if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
      if (updateData.email !== undefined) dataToUpdate.email = updateData.email;
      if (updateData.phone !== undefined) dataToUpdate.phone = updateData.phone;
      if (updateData.password !== undefined) dataToUpdate.password = updateData.password;
      if (updateData.isActive !== undefined) dataToUpdate.isActive = updateData.isActive;
      // Solo actualiza el rol si viene en el payload
      if (Object.prototype.hasOwnProperty.call(updateData, 'role')) {
        dataToUpdate.role = updateData.role;
      }

      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: dataToUpdate,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  // DELETE - Eliminar usuario
  async delete(id: number): Promise<boolean> {
    // const userIndex = this.users.findIndex(user => user.id === id);
    // if (userIndex === -1) return false;

    // this.users.splice(userIndex, 1);
    // return true;
    try {
      await prisma.user.delete({
        where: { id: id },
      });
      return true;
    } catch (error) {
      // Si el usuario no existe, Prisma lanzará un error (P2025)
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // READ - Obtener todos los usuarios (para admin)
  async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export default new UserModel();