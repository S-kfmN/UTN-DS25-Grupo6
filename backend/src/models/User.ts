import { RegisterRequest } from '../types/user';
import { PrismaClient, User, UserRole } from '../generated/prisma';

// Usar la instancia compartida de Prisma
const prisma = new PrismaClient();

// Por ahora usaremos un array en memoria, después lo conectaremos a una base de datos
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
        password: userData.password, // ! IMPORTANTE: Hashear la contraseña antes de guardar en un entorno real
        phone: userData.phone,
        role: UserRole.USER, // Cambiado a UserRole.USER
      },
    });
    return newUser;
  }

  // READ - Obtener usuario por ID
  async findById(id: number): Promise<User | null> {
    // return this.users.find(user => user.id === id) || null;
    return await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true, // Incluir fecha de creación
      },
    });
  }

  // READ - Obtener usuario por email
  async findByEmail(email: string): Promise<User | null> {
    // return this.users.find(user => user.email === email) || null;
    return await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true, // Incluir password para login
        phone: true,
        role: true,
        createdAt: true, // Incluir fecha de creación
      },
    });
  }

  // UPDATE - Actualizar usuario
  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    // const userIndex = this.users.findIndex(user => user.id === id);
    // if (userIndex === -1) return null;

    // this.users[userIndex] = {
    //   ...this.users[userIndex],
    //   ...updateData,
    //   updatedAt: new Date().toISOString()
    // };

    try {
      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: {
          ...updateData,
          role: updateData.role, // Asegurarse de que el enum se mapea correctamente
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true, // Incluir fecha de creación
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
    // return [...this.users];
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true, // Incluir fecha de creación
      },
    });
  }
}

export default new UserModel();