import jwt from 'jsonwebtoken';
import { signJwt, verifyJwt } from '@/lib/auth/jwt';
import { Role } from '@prisma/client';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('JWT Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  const payload = {
    userId: 1,
    email: 'test@example.com',
    role: Role.CUSTOMER,
  };

  const fakeToken = 'fake.jwt.token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signJwt should call jwt.sign with correct arguments', () => {
    (jwt.sign as jest.Mock).mockReturnValue(fakeToken);

    const token = signJwt(payload);

    expect(jwt.sign).toHaveBeenCalledWith(
      payload,
      expect.any(String), // secret
      { expiresIn: expect.any(String) } // expires
    );
    expect(token).toBe(fakeToken);
  });

  it('verifyJwt should return payload if token is valid', () => {
    (jwt.verify as jest.Mock).mockReturnValue(payload);

    const result = verifyJwt(fakeToken);

    expect(jwt.verify).toHaveBeenCalledWith(fakeToken, expect.any(String));
    expect(result).toEqual(payload);
  });

  it('verifyJwt should return null if verification fails', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const result = verifyJwt(fakeToken);

    expect(result).toBeNull();
  });
});
