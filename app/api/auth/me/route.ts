import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth/jwt';
import { ACCESS_TOKEN_NAME } from '@/lib/constants';

export  const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

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
