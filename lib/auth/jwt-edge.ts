import { jwtVerify } from 'jose';
import { config } from '../config';
import { Role } from '@prisma/client/edge';

const JWT_SECRET = new TextEncoder().encode(config.jwt.secret);

export const verifyJwtEdge = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      role: payload.role as Role,
    };
  } catch (err) {
    console.error('Edge JWT verification failed:', err);
    return null;
  }
};
