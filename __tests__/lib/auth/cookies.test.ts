import { setAuthCookie, removeAuthCookie, getAuthTokenFromCookie, authCookieOptions } from '@/lib/auth/cookies';
import { ACCESS_TOKEN_NAME } from '@/lib/constants';


jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

  it('should set the access token cookie with correct options and return the response', () => {
    const token = 'test-token';
    const mockResponse = {
      cookies: {
        set: jest.fn(),
      },
    } as unknown as NextResponse;

    const result = setAuthCookie(mockResponse, token);

    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      ACCESS_TOKEN_NAME,
      token,
      authCookieOptions
    );

    expect(result).toBe(mockResponse);
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
