import { verifyJwt } from './jwt';
import { Role } from '@prisma/client';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_NAME } from '../constants';


export const authGuard = async (allowedRoles: Role[] = []) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const user = verifyJwt(token);

  if (!user) {
    throw new Error('Invalid token');
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as Role)) {
    throw new Error('Forbidden: insufficient permissions');
  }

  return user;
};
