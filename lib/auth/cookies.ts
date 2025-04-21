import { cookies } from 'next/headers';
import { parseExpiresInToSeconds } from '../utils/parse-expiration';
import { ACCESS_TOKEN_NAME } from '../constants';
import { config, isProduction } from '../config';
import { NextResponse } from 'next/server';

const maxAge = parseExpiresInToSeconds(config.jwt.expiresIn);

export const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  path: '/',
  maxAge,
  sameSite: 'lax' as const,
};


/**
 * Sets the access token cookie on the given response.
 *
 * @param response the response that will have the cookie set
 * @param token the value of the access token cookie
 */
export const setAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set(ACCESS_TOKEN_NAME, token, authCookieOptions);
  return response;
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
