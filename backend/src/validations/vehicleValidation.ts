
import { z } from 'zod';
import { VehicleStatus } from '@prisma/client';

export const createVehicleSchema = z.object({
  license: z.string().min(3, 'License must be at least 3 characters long').max(10, 'License must be at most 10 characters long'),
  brand: z.string().min(2, 'Brand must be at least 2 characters long'),
  model: z.string().min(1, 'Model must be at least 1 character long'),
  year: z.number().int().min(1900, 'Year must be after 1900').max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  color: z.string().optional(),
  status: z.nativeEnum(VehicleStatus).default(VehicleStatus.ACTIVE).optional(),
  userId: z.number().int().positive('User ID must be a positive integer'),
});

export const updateVehicleSchema = z.object({
  license: z.string().min(3, 'License must be at least 3 characters long').max(10, 'License must be at most 10 characters long').optional(),
  brand: z.string().min(2, 'Brand must be at least 2 characters long').optional(),
  model: z.string().min(1, 'Model must be at least 1 character long').optional(),
  year: z.number().int().min(1900, 'Year must be after 1900').max(new Date().getFullYear() + 1, 'Year cannot be in the future').optional(),
  color: z.string().optional(),
  status: z.nativeEnum(VehicleStatus).optional(),
  userId: z.number().int().positive('User ID must be a positive integer').optional(),
});

export const vehicleIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
});
