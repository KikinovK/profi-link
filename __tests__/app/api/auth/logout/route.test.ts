/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/logout/route';
import { ACCESS_TOKEN_NAME } from '@/lib/constants';
import { NextResponse } from 'next/server';



jest.mock('@/lib/config', () => ({
  isProduction: false,
}));

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should clear the access token cookie and return 200', async () => {
    const response = await POST();

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.message).toBe('Logged out successfully');

    const cookies = response.cookies.get(ACCESS_TOKEN_NAME);

    expect(cookies).toBeDefined();
    expect(cookies?.name).toBe(ACCESS_TOKEN_NAME);
    expect(cookies?.value).toBe('');
    expect(cookies?.httpOnly).toBe(true);
    expect(cookies?.secure).toBe(false);
    expect(cookies?.path).toBe('/');
    expect(cookies?.sameSite).toBe('lax');

    const expires = new Date(cookies?.expires ?? '');
    expect(expires.getTime()).toBe(0);
  });

  it('should return 500 if cookies.set throws an error', async () => {
    const mockSet = jest.fn(() => {
      throw new Error('Failed to set cookie');
    });

    const mockResponse = {
      cookies: {
        set: mockSet,
        get: jest.fn(),
      },
      status: 500,
      json: async () => ({ error: 'Logout failed' }),
    };

    const mockNextResponseJson = jest.spyOn(NextResponse, 'json').mockReturnValue(mockResponse as unknown as NextResponse);

    const response = await POST();

    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBe('Logout failed');

    mockNextResponseJson.mockRestore();
  });
});
