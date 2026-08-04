import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth';
import { swapMeal } from '@/lib/mealplan';

export async function POST(request: Request) {
  try {
    const payload = getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Nie zalogowano' }, { status: 401 });
    }

    const { mealPlanMealId } = await request.json();

    if (!mealPlanMealId) {
      return NextResponse.json({ error: 'Brak ID posiłku' }, { status: 400 });
    }

    const newRecipe = await swapMeal(mealPlanMealId, payload.userId);

    return NextResponse.json({ recipe: newRecipe });
  } catch (error) {
    console.error('Swap meal error:', error);
    return NextResponse.json(
      { error: 'Nie udało się zamienić posiłku' },
      { status: 500 }
    );
  }
}
