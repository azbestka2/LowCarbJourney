import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      include: {
        products: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
