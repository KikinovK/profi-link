import { emailSchema } from '@/lib/schema-validation';

describe('emailSchema', () => {
  it('should pass validation with a valid email', () => {
    const result = emailSchema.safeParse('test@example.com');
    expect(result.success).toBe(true);
  });

  it('should fail if email is missing', () => {
    const result = emailSchema.safeParse(undefined);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email is required');
    }
  });

  it('should fail if email is not a string', () => {
    const result = emailSchema.safeParse(123);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email must be a string');
    }
  });

  it('should fail if email format is invalid', () => {
    const result = emailSchema.safeParse('not-an-email');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address');
    }
  });
});
