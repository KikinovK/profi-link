/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/login/route';
import { db } from '@/lib/db';
import { comparePasswords } from '@/lib/auth/hash';
import { signJwt } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';


jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock('@/lib/auth/hash');
jest.mock('@/lib/auth/jwt');
jest.mock('@/lib/auth/cookies');


const mockedFindUnique = db.user.findUnique as jest.Mock;

const mockedComparePasswords = comparePasswords as jest.Mock;
const mockedSignJwt = signJwt as jest.Mock;
const mockedSetAuthCookie = setAuthCookie as jest.Mock;

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return 400 if request body is invalid', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({}),
    } as unknown as Request;

    const response = await POST(mockRequest);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it('should return 401 if user with provided email does not exist', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'password123' }),
    } as unknown as Request;

    mockedFindUnique.mockResolvedValue(null);

    const response = await POST(mockRequest);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toEqual(['Invalid email or password']);
  });

  it('should return 401 if password is incorrect', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'wrongpassword' }),
    } as unknown as Request;

    const mockUser = { id: 'user-id', email: 'test@example.com', password: 'hashedpassword', role: 'user' };
    mockedFindUnique.mockResolvedValue(mockUser);
    mockedComparePasswords.mockResolvedValue(false);

    const response = await POST(mockRequest);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toEqual(['Invalid email or password']);
  });

  it('should return 200 and user data with a token cookie on successful login', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'password123' }),
    } as unknown as Request;

    const mockUser = { id: 'user-id', email: 'test@example.com', password: 'hashedpassword', role: 'user' };
    mockedFindUnique.mockResolvedValue(mockUser);
    mockedComparePasswords.mockResolvedValue(true);
    mockedSignJwt.mockReturnValue('mocked-jwt-token');

    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.user).toEqual({ id: 'user-id', email: 'test@example.com', role: 'user' });
    expect(mockedSetAuthCookie).toHaveBeenCalledWith('mocked-jwt-token');
  });

  it('should return 500 on internal server error', async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Database error')),
    } as unknown as Request;

    const response = await POST(mockRequest);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toEqual(['Internal Server Error']);
  });
});
