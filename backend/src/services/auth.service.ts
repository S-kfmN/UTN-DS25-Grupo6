import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ChangePasswordRequest, ChangePasswordResponse, JWTPayload } from '../types/auth.types';

export async function login(data: LoginRequest): Promise<LoginResponse['data']> {
  // 1. Buscar usuario
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // 2. Verificar password
  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) {
    throw new Error('Credenciales inválidas');
  }

  // 3. Generar JWT
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET no está configurado');
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role } as JWTPayload,
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' } as SignOptions
  );

  // 4. Retornar sin password
  const { password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token
  };
}

export async function register(data: RegisterRequest): Promise<RegisterResponse['data']> {
  // 1. Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error('Email ya registrado');
  }

  // 2. Hashear contraseña
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 3. Crear usuario
  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
      role: data.role || 'USER'
    }
  });

  // 4. Generar JWT
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET no está configurado');
  }
  
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role } as JWTPayload,
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' } as SignOptions
  );

  // 5. Retornar sin password
  const { password, ...userWithoutPassword } = newUser;
  return {
    user: userWithoutPassword,
    token
  };
}

export async function changePassword(userId: number, data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
  // 1. Buscar usuario
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // 2. Verificar contraseña actual
  const validPassword = await bcrypt.compare(data.oldPassword, user.password);
  if (!validPassword) {
    throw new Error('Contraseña actual incorrecta');
  }

  // 3. Hashear nueva contraseña
  const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

  // 4. Actualizar contraseña
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword }
  });

  return {
    success: true,
    message: 'Contraseña actualizada exitosamente'
  };
}
