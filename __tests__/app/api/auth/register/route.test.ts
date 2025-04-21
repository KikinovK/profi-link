/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/register/route';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth/hash';
import { signJwt } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@/lib/auth/hash', () => ({
  hashPassword: jest.fn(),
}));

jest.mock('@/lib/auth/jwt', () => ({
  signJwt: jest.fn(),
}));

jest.mock('@/lib/auth/cookies', () => ({
  setAuthCookie: jest.fn((res) => res),
}));

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  const mockUserData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'StrongP@ssw0rd!',
    role: 'CUSTOMER',
  };

  const createRequest = (data: object) =>
    new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

  it('should return 400 if validation fails', async () => {
    const response = await POST(createRequest({}));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  it('should return 409 if user already exists', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    const response = await POST(createRequest(mockUserData));
    expect(response.status).toBe(409);
    const body = await response.json();
    expect(body.error).toEqual(['Email already in use']);
  });

  it('should create a user and return 201', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);
    (hashPassword as jest.Mock).mockResolvedValue('hashed-password');
    (db.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: mockUserData.email,
      role: mockUserData.role,
    });
    (signJwt as jest.Mock).mockReturnValue('jwt-token');

    const response = await POST(createRequest(mockUserData));
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body.user).toEqual({
      id: 1,
      email: mockUserData.email,
      role: mockUserData.role,
    });
    expect(body.message).toEqual(['User created successfully']);
    expect(setAuthCookie).toHaveBeenCalledWith(expect.any(Object), 'jwt-token');
  });

  it('should return 500 if an unexpected error occurs', async () => {
    (db.user.findUnique as jest.Mock).mockRejectedValue(new Error('Unexpected DB error'));

    const response = await POST(createRequest(mockUserData));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toEqual(['Internal Server Error']);
  });
});
