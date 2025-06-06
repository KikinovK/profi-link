import { z } from 'zod';

export const passwordSchema = z.string({
  required_error: 'Password is required',
  invalid_type_error: 'Password must be a string',
}).min(6, 'Password must be at least 6 characters long');
