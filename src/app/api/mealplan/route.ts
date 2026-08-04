import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const payload = getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Nie zalogowano' }, { status: 401 });
    }

    const activePlan = await prisma.mealPlan.findFirst({
      where: { userId: payload.userId, isActive: true },
      include: {
        days: {
          include: {
            meals: {
              include: { recipe: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ mealPlan: activePlan });
  } catch (error) {
    console.error('Get mealplan error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
