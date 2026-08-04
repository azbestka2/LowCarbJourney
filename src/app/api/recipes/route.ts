import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
