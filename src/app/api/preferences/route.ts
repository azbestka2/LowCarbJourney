import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const payload = getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Nie zalogowano' }, { status: 401 });
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: payload.userId },
    });

    const selectedProducts = await prisma.userProduct.findMany({
      where: { userId: payload.userId },
      include: { product: true },
    });

    return NextResponse.json({ preferences, selectedProducts });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Nie zalogowano' }, { status: 401 });
    }

    const data = await request.json();
    const { complexityLevel, lactoseFree, glutenFree, vegetarian, ketoFriendly, mealReminders, macroWarnings, selectedProductIds, excludedProductIds } = data;

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: payload.userId },
      update: {
        complexityLevel: complexityLevel || 'moderate',
        lactoseFree: lactoseFree || false,
        glutenFree: glutenFree || false,
        vegetarian: vegetarian || false,
        ketoFriendly: ketoFriendly || false,
        mealReminders: mealReminders !== false,
        macroWarnings: macroWarnings !== false,
      },
      create: {
        userId: payload.userId,
        complexityLevel: complexityLevel || 'moderate',
        lactoseFree: lactoseFree || false,
        glutenFree: glutenFree || false,
        vegetarian: vegetarian || false,
        ketoFriendly: ketoFriendly || false,
        mealReminders: mealReminders !== false,
        macroWarnings: macroWarnings !== false,
      },
    });

    // Handle product selections
    if (selectedProductIds || excludedProductIds) {
      await prisma.userProduct.deleteMany({
        where: { userId: payload.userId },
      });

      const allProductIds = new Set([
        ...(selectedProductIds || []),
        ...(excludedProductIds || []),
      ]);

      for (const productId of allProductIds) {
        const isExcluded = (excludedProductIds || []).includes(productId);
        await prisma.userProduct.create({
          data: {
            userId: payload.userId,
            productId,
            isExcluded,
          },
        });
      }
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Save preferences error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
