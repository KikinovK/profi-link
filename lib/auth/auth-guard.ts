import { verifyJwt } from './jwt';
import { Role } from '@prisma/client';
import { getAuthTokenFromCookie } from './cookies';


export const authGuard = async (allowedRoles: Role[] = []) => {
  const token = await getAuthTokenFromCookie();

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
