import { z, ZodSchema } from 'zod';

export const validateEmail = z.string().email('Invalid email format');

export const validatePassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const validateUsername = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain alphanumeric characters, underscores, and hyphens');

export const validatePhoneNumber = z
  .string()
  .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number');

export const validatePagination = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});

export const validate = <T>(schema: ZodSchema, data: unknown): T => {
  return schema.parse(data) as T;
};

export const safeValidate = <T>(schema: ZodSchema, data: unknown): { data?: T; error?: string } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { data: result.data as T };
  }
  return { error: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ') };
};
