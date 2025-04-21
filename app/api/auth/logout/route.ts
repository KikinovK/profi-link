import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_NAME } from '@/lib/constants';
import { isProduction } from '@/lib/config';

export const POST = async () => {
  try {
    const response = NextResponse.json({ message: ['Logged out successfully'] }, { status: 200 });

    response.cookies.set(ACCESS_TOKEN_NAME, '', {
      httpOnly: true,
      secure: isProduction,
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: ['Logout failed'] }, { status: 500 });
  }
};
