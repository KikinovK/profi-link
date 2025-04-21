import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth/jwt';
import { getAuthTokenFromCookie } from '@/lib/auth/cookies';

export  const GET = async () => {
  try {
    const token = await getAuthTokenFromCookie();

    if (!token) {
      return NextResponse.json({ error: ['Not authenticated'] }, { status: 401 });
    }

    const user = verifyJwt(token);

    if (!user) {
      return NextResponse.json({ error: ['Invalid or expired token'] }, { status: 401 });
    }

    return NextResponse.json({ user, message: ['Authenticated'] }, { status: 200 });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json({ error: ['Internal Server Error'] }, { status: 500 });
  }
}
