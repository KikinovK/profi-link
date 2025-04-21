import { isProduction } from '@/lib/config';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const DELETE = async (
  _req: Request,
  { params }: { params: { email: string } }
) => {
  if (isProduction) {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);

  try {
    const user = await db.user.deleteMany({
      where: { email: decodedEmail },
    });

    return NextResponse.json({ deleted: user.count }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
};
