import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePasswords } from '@/lib/auth/hash';
import { signJwt } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';
import { emailSchema, passwordSchema } from '@/lib/schema-validation';
import { z } from 'zod';

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export  const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const formattedErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: [formattedErrors] }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: ['Invalid email or password'] }, { status: 401 });
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: ['Invalid email or password'] }, { status: 401 });
    }

    const token = signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
      message: ['Login successful'],
      user: { id: user.id, email: user.email, role: user.role }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: ['Internal Server Error'] }, { status: 500 });
  }
}
