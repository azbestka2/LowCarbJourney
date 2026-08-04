import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest } from '@/lib/auth';
import { calculateBMI, calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacros } from '@/lib/calculations';

export async function GET(request: Request) {
  try {
    const payload = getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Nie zalogowano' }, { status: 401 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: payload.userId },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
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
    const { gender, birthYear, heightCm, weightStart, weightCurrent, activityLevel, goal, targetWeight, weeklyGoalKg } = data;

    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    const bmi = calculateBMI(weightStart, heightCm);
    const bmr = calculateBMR(weightStart, heightCm, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const targetCalories = calculateTargetCalories(tdee, goal, weeklyGoalKg || -0.5);
    const macros = calculateMacros(targetCalories, goal);

    const profile = await prisma.userProfile.upsert({
      where: { userId: payload.userId },
      update: {
        gender,
        birthYear,
        heightCm,
        weightStart,
        weightCurrent: weightCurrent || weightStart,
        activityLevel,
        bmi,
        bmr,
        tdee,
        goal,
        targetWeight,
        weeklyGoalKg: weeklyGoalKg || -0.5,
      },
      create: {
        userId: payload.userId,
        gender,
        birthYear,
        heightCm,
        weightStart,
        weightCurrent: weightStart,
        activityLevel,
        bmi,
        bmr,
        tdee,
        goal,
        targetWeight,
        weeklyGoalKg: weeklyGoalKg || -0.5,
      },
    });

    // Also set macro targets in preferences
    await prisma.userPreferences.upsert({
      where: { userId: payload.userId },
      update: {
        dailyCalories: targetCalories,
        dailyProtein: macros.protein,
        dailyFat: macros.fat,
        dailyCarbs: macros.carbs,
      },
      create: {
        userId: payload.userId,
        dailyCalories: targetCalories,
        dailyProtein: macros.protein,
        dailyFat: macros.fat,
        dailyCarbs: macros.carbs,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Save profile error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
