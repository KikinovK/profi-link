import { setAuthCookie, removeAuthCookie, getAuthTokenFromCookie } from '@/lib/auth/cookies';
import { ACCESS_TOKEN_NAME } from '@/lib/constants';


jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { cookies } from 'next/headers';

describe('auth cookie helpers', () => {
  const mockCookieStore = {
    set: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
  });

  describe('setAuthCookie', () => {
    it('should set the access token cookie with correct options', async () => {
      const token = 'test-token';

      await setAuthCookie(token);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        ACCESS_TOKEN_NAME,
        token,
        {
          httpOnly: true,
          secure: expect.any(Boolean),
          path: '/',
          maxAge: expect.any(Number),
          sameSite: 'lax',
        }
      );
    });
  });

  describe('removeAuthCookie', () => {
    it('should delete the access token cookie', async () => {
      await removeAuthCookie();
      expect(mockCookieStore.delete).toHaveBeenCalledWith(ACCESS_TOKEN_NAME);
    });
  });

  describe('getAuthTokenFromCookie', () => {
    it('should return token value if cookie is set', async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: 'token-value' });

      const result = await getAuthTokenFromCookie();
      expect(result).toBe('token-value');
    });

    it('should return null if cookie is not set', async () => {
      mockCookieStore.get.mockReturnValueOnce(undefined);

      const result = await getAuthTokenFromCookie();
      expect(result).toBeNull();
    });
  });
});
