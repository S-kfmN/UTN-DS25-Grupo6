import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { LoginRequest, LoginResponse } from '../types/auth.types';

export async function login(
  req: Request<{}, {}, LoginRequest>, // Ajusta el tipo aquí
  res: Response<LoginResponse>,
  next: NextFunction
) {
  try {
    const result = await authService.login(req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado'
      });
    }

    const result = await authService.changePassword(userId, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  // En JWT, el logout se maneja principalmente en el cliente
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
}
