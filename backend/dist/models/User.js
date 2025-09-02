"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Por ahora usaremos un array en memoria, después lo conectaremos a una base de datos
class UserModel {
    // private users: User[] = [];        // Array en memoria para almacenar usuarios
    // private nextId = 1;               // Contador para generar IDs únicos
    // CREATE - Crear usuario
    async create(userData) {
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
                role: client_1.UserRole.USER, // Cambiado a UserRole.USER
            },
        });
        return newUser;
    }
    // READ - Obtener usuario por ID
    async findById(id) {
        // return this.users.find(user => user.id === id) || null;
        return await prisma.user.findUnique({
            where: { id: id },
        });
    }
    // READ - Obtener usuario por email
    async findByEmail(email) {
        // return this.users.find(user => user.email === email) || null;
        return await prisma.user.findUnique({
            where: { email: email },
        });
    }
    // UPDATE - Actualizar usuario
    async update(id, updateData) {
        // const userIndex = this.users.findIndex(user => user.id === id);
        // if (userIndex === -1) return null;
        // this.users[userIndex] = {
        //   ...this.users[userIndex],
        //   ...updateData,
        //   updatedAt: new Date().toISOString()
        // };
        // return this.users[userIndex];
        try {
            const updatedUser = await prisma.user.update({
                where: { id: id },
                data: {
                    ...updateData,
                    role: updateData.role, // Asegurarse de que el enum se mapea correctamente
                    updatedAt: new Date(),
                },
            });
            return updatedUser;
        }
        catch (error) {
            console.error("Error updating user:", error);
            return null;
        }
    }
    // DELETE - Eliminar usuario
    async delete(id) {
        // const userIndex = this.users.findIndex(user => user.id === id);
        // if (userIndex === -1) return false;
        // this.users.splice(userIndex, 1);
        // return true;
        try {
            await prisma.user.delete({
                where: { id: id },
            });
            return true;
        }
        catch (error) {
            // Si el usuario no existe, Prisma lanzará un error (P2025)
            console.error("Error deleting user:", error);
            return false;
        }
    }
    // READ - Obtener todos los usuarios (para admin)
    async findAll() {
        // return [...this.users];
        return await prisma.user.findMany();
    }
}
exports.default = new UserModel();
