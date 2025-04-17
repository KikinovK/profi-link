import { hashPassword, comparePasswords } from '@/lib/auth/hash';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockedBcrypt = bcrypt as unknown as {
  hash: jest.Mock<Promise<string>, [string, number]>;
  compare: jest.Mock<Promise<boolean>, [string, string]>;
};

describe('hash.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash the password with bcrypt and return it', async () => {
      mockedBcrypt.hash.mockResolvedValue('hashed-password');

      const result = await hashPassword('my-password');

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('my-password', 10);
      expect(result).toBe('hashed-password');
    });
  });

  describe('comparePasswords', () => {
    it('should return true if passwords match', async () => {
      mockedBcrypt.compare.mockResolvedValue(true);

      const result = await comparePasswords('plain', 'hashed');

      expect(mockedBcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      mockedBcrypt.compare.mockResolvedValue(false);

      const result = await comparePasswords('plain', 'wrong-hash');

      expect(result).toBe(false);
    });
  });
});
