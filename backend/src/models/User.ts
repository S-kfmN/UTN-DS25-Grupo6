import { User, RegisterRequest } from '../types/user';

// Por ahora usaremos un array en memoria, después lo conectaremos a una base de datos
class UserModel {
  private users: User[] = [];        // Array en memoria para almacenar usuarios
  private nextId = 1;               // Contador para generar IDs únicos

  // CREATE - Crear usuario
  async create(userData: RegisterRequest): Promise<User> {
    const newUser: User = {
      id: this.nextId++,
      ...userData,
      role: 'user', // Por defecto todos son usuarios
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    return newUser;
  }

  // READ - Obtener usuario por ID
  async findById(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  // READ - Obtener usuario por email
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  // UPDATE - Actualizar usuario
  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return this.users[userIndex];
  }

  // DELETE - Eliminar usuario
  async delete(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  // READ - Obtener todos los usuarios (para admin)
  async findAll(): Promise<User[]> {
    return [...this.users];
  }
}

export default new UserModel();