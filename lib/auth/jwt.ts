import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { Role } from '@prisma/client';

const JWT_SECRET = config.jwt.secret;
const rawExpiresIn = config.jwt.expiresIn;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

type JwtExpiresIn = `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}` | `${number}`;

const isValidExpiresIn = (val: string): val is JwtExpiresIn => {
  return /^(\d+)([smhdwy])?$/.test(val);
};

if (!isValidExpiresIn(rawExpiresIn)) {
  throw new Error(`Invalid JWT_EXPIRES_IN format: ${rawExpiresIn}`);
}

const JWT_EXPIRES_IN: SignOptions['expiresIn'] = rawExpiresIn;;

interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}

/**
 * Signs a JSON Web Token (JWT) with the provided payload.
 *
 * @param payload - The payload data to include in the JWT, including userId, email, and role.
 * @returns The signed JWT as a string.
 */

export const signJwt = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verifies the provided JSON Web Token (JWT) and returns the payload data if valid.
 *
 * @param token - The JWT to verify.
 * @returns The payload data if the JWT is valid, or null if the verification fails.
 */
export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}
