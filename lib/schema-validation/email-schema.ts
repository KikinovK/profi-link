import { z } from "zod";

export const emailSchema = z.string({
  required_error: 'Email is required',
  invalid_type_error: 'Email must be a string',
}).email('Invalid email address')
