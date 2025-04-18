import { NextResponse } from 'next/server';
import { z } from 'zod';
import {  db } from '@/lib/db';
import { hashPassword } from '@/lib/auth/hash';
import { signJwt } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';
import { emailSchema, nameSchema, passwordSchema, roleSchema } from '@/lib/schema-validation';

const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
});

export  const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const formattedErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: formattedErrors }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    const existingUser = await  db.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: ['Email already in use'] }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await  db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
      },
    });

    const token = signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
        user: { id: user.id, email: user.email, role: user.role },
        message: ['User created successfully'],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: ['Internal Server Error'] }, { status: 500 });
  }
}
