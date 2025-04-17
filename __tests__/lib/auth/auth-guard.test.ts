import { authGuard } from '@/lib/auth/auth-guard';
import { Role } from '@prisma/client';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/lib/auth/jwt', () => ({
  verifyJwt: jest.fn(),
}));

import { verifyJwt } from '@/lib/auth/jwt';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockedCookies = require('next/headers').cookies as jest.Mock;

describe('authGuard', () => {
  const fakeUser = {
    userId: 123,
    email: 'user@example.com',
    role: Role.CUSTOMER,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw if no token is provided', async () => {
    mockedCookies.mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    await expect(authGuard()).rejects.toThrow('Not authenticated');
  });

  it('should throw if token is invalid', async () => {
    mockedCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'invalid-token' }),
    });

    (verifyJwt as jest.Mock).mockReturnValue(null);

    await expect(authGuard()).rejects.toThrow('Invalid token');
  });

  it('should return user if valid token and no roles specified', async () => {
    mockedCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    });

    (verifyJwt as jest.Mock).mockReturnValue(fakeUser);

    const result = await authGuard();
    expect(result).toEqual(fakeUser);
  });

  it('should return user if role is allowed', async () => {
    mockedCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    });

    (verifyJwt as jest.Mock).mockReturnValue(fakeUser);

    const result = await authGuard([Role.CUSTOMER]);
    expect(result).toEqual(fakeUser);
  });

  it('should throw if role is not allowed', async () => {
    mockedCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    });

    (verifyJwt as jest.Mock).mockReturnValue(fakeUser);

    await expect(authGuard([Role.ADMIN])).rejects.toThrow('Forbidden: insufficient permissions');
  });
});
