/**
 * @jest-environment node
 */

import { GET } from '@/app/api/auth/me/route';
import { verifyJwt } from '@/lib/auth/jwt';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/lib/auth/jwt', () => ({
  verifyJwt: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockCookies = require('next/headers').cookies as jest.Mock;

describe('GET /api/auth/me', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return 401 if no token is present', async () => {
    mockCookies.mockReturnValueOnce({
      get: () => undefined,
    });

    const response = await GET();
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.error).toEqual(['Not authenticated']);
  });

  it('should return 401 if token is invalid', async () => {
    mockCookies.mockReturnValueOnce({
      get: () => ({ value: 'invalid-token' }),
    });
    (verifyJwt as jest.Mock).mockReturnValueOnce(null);

    const response = await GET();
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.error).toEqual(['Invalid or expired token']);
  });

  it('should return 200 with user if token is valid', async () => {
    const user = { id: '123', name: 'John' };

    mockCookies.mockReturnValueOnce({
      get: () => ({ value: 'valid-token' }),
    });
    (verifyJwt as jest.Mock).mockReturnValueOnce(user);

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.message).toEqual(['Authenticated']);
    expect(data.user).toEqual(user);
  });

  it('should return 500 if an unexpected error occurs', async () => {
    mockCookies.mockImplementationOnce(() => {
      throw new Error('Unexpected error');
    });

    const response = await GET();
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toEqual(['Internal Server Error']);
  });
});
