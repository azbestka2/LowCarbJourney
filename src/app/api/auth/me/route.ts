import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const payload = getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Nie zalogowano' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
        preferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
