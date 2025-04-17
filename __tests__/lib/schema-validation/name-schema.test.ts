import { nameSchema } from '@/lib/schema-validation';

describe('nameSchema', () => {
  it('should pass validation with a valid name', () => {
    const result = nameSchema.safeParse('John Doe');
    expect(result.success).toBe(true);
  });

  it('should fail if name is missing', () => {
    const result = nameSchema.safeParse(undefined);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required');
    }
  });

  it('should fail if name is not a string', () => {
    const result = nameSchema.safeParse(42);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name must be a string');
    }
  });

  it('should fail if name is an empty string', () => {
    const result = nameSchema.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name cannot be empty');
    }
  });
});
