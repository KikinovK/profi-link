import { cookies } from 'next/headers';
import { parseExpiresInToSeconds } from '../utils/parse-expiration';
import { ACCESS_TOKEN_NAME } from '../constants';
import { config, isProduction } from '../config';

const maxAge = parseExpiresInToSeconds(config.jwt.expiresIn);

/**
 * Sets the access token cookie.
 *
 * @param token - The access token to set in the cookie.
 */
export const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    path: '/',
    maxAge,
    sameSite: 'lax',
  });
};

/**
 * Removes the access token cookie.
 */
export const removeAuthCookie = async() => {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_NAME);
};

/**
 * Retrieves the access token from the HTTP cookie.
 *
 * @returns The access token if it is set in the cookie, or null if it is not.
 */
export const getAuthTokenFromCookie = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_NAME)?.value || null;
};
