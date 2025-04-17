import { z } from 'zod';
import { Role } from '@prisma/client';

export const roleSchema = z.string({
  required_error: 'Role is required',
  invalid_type_error: 'Role must be a string',
}).refine(
  (val): val is Role => Object.values(Role).includes(val as Role),
  {
    message: 'Invalid role value',
  }
);
