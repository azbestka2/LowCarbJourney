import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const payload = getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Nie zalogowano' }, { status: 401 });
    }

    const entries = await prisma.progressEntry.findMany({
      where: { userId: payload.userId },
      orderBy: { date: 'desc' },
      take: 90,
    });

    const profile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
    });

    // Calculate stats
    const latestWeight = entries.length > 0 ? entries[0].weight : profile?.weightCurrent;
    const startWeight = profile?.weightStart;
    const targetWeight = profile?.targetWeight;
    const totalLost = startWeight && latestWeight ? startWeight - latestWeight : 0;
    const remainingToGoal = latestWeight && targetWeight ? latestWeight - targetWeight : 0;

    // Average macros from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLogs = await prisma.dailyLog.findMany({
      where: {
        userId: payload.userId,
        date: { gte: thirtyDaysAgo },
      },
    });

    const avgCalories = recentLogs.length > 0
      ? Math.round(recentLogs.reduce((sum, l) => sum + (l.calories || 0), 0) / recentLogs.length)
      : 0;
    const avgProtein = recentLogs.length > 0
      ? Math.round(recentLogs.reduce((sum, l) => sum + (l.protein || 0), 0) / recentLogs.length)
      : 0;
    const avgFat = recentLogs.length > 0
      ? Math.round(recentLogs.reduce((sum, l) => sum + (l.fat || 0), 0) / recentLogs.length)
      : 0;
    const avgCarbs = recentLogs.length > 0
      ? Math.round(recentLogs.reduce((sum, l) => sum + (l.carbs || 0), 0) / recentLogs.length)
      : 0;

    return NextResponse.json({
      entries,
      stats: {
        startWeight,
        currentWeight: latestWeight,
        targetWeight,
        totalLost: Math.round(totalLost * 10) / 10,
        remainingToGoal: Math.round(remainingToGoal * 10) / 10,
        avgMacros: { calories: avgCalories, protein: avgProtein, fat: avgFat, carbs: avgCarbs },
      },
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Nie zalogowano' }, { status: 401 });
    }

    const { weight, caloriesEaten, notes } = await request.json();

    const entry = await prisma.progressEntry.create({
      data: {
        userId: payload.userId,
        date: new Date(),
        weight: weight ? parseFloat(weight) : null,
        caloriesEaten: caloriesEaten ? parseInt(caloriesEaten) : null,
        notes: notes || null,
      },
    });

    // Update current weight in profile
    if (weight) {
      await prisma.userProfile.updateMany({
        where: { userId: payload.userId },
        data: { weightCurrent: parseFloat(weight) },
      });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Add progress error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
