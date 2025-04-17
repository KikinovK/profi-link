import { roleSchema } from '@/lib/schema-validation';
import { Role } from '@prisma/client';

describe('roleSchema', () => {
  it('should pass with a valid role', () => {
    const result = roleSchema.safeParse(Role.ADMIN);
    expect(result.success).toBe(true);
  });

  it('should fail if role is missing', () => {
    const result = roleSchema.safeParse(undefined);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Role is required');
    }
  });

  it('should fail if role is not a string (invalid type)', () => {
    const result = roleSchema.safeParse(123);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Role must be a string');
    }
  });

  it('should fail if role is an invalid string', () => {
    const result = roleSchema.safeParse('SUPER_ADMIN');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid role value');
    }
  });
});
