import { passwordSchema } from '@/lib/schema-validation';

describe('passwordSchema', () => {
  it('should pass with a valid password', () => {
    const result = passwordSchema.safeParse('secure123');
    expect(result.success).toBe(true);
  });

  it('should fail if password is missing', () => {
    const result = passwordSchema.safeParse(undefined);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password is required');
    }
  });

  it('should fail if password is not a string', () => {
    const result = passwordSchema.safeParse(123456);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be a string');
    }
  });

  it('should fail if password is too short', () => {
    const result = passwordSchema.safeParse('123');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 6 characters long');
    }
  });
});
