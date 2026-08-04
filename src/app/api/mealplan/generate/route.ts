import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth';
import { generateWeeklyPlan } from '@/lib/mealplan';

export async function POST(request: Request) {
  try {
    const payload = getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Nie zalogowano' }, { status: 401 });
    }

    const { startDate } = await request.json();
    const start = startDate ? new Date(startDate) : getTomorrow();

    const planId = await generateWeeklyPlan(payload.userId, start);

    return NextResponse.json({ planId, message: 'Plan został wygenerowany' });
  } catch (error) {
    console.error('Generate mealplan error:', error);
    return NextResponse.json({ error: 'Błąd generowania planu' }, { status: 500 });
  }
}

function getTomorrow(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}
