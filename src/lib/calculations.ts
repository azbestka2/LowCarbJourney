export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 16) return 'Wygłodzenie';
  if (bmi < 17) return 'Wychudzenie';
  if (bmi < 18.5) return 'Niedowaga';
  if (bmi < 25) return 'Prawidłowa masa ciała';
  if (bmi < 30) return 'Nadwaga';
  if (bmi < 35) return 'Otyłość I stopnia';
  if (bmi < 40) return 'Otyłość II stopnia';
  return 'Otyłość III stopnia';
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string
): number {
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
}

export function getActivityMultiplier(level: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return multipliers[level] || 1.2;
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  return Math.round(bmr * getActivityMultiplier(activityLevel));
}

export function calculateTargetCalories(
  tdee: number,
  goal: string,
  weeklyGoalKg: number
): number {
  const calorieDeficitPerKg = 7700;
  if (goal === 'lose_weight') {
    const dailyDeficit = (Math.abs(weeklyGoalKg) * calorieDeficitPerKg) / 7;
    return Math.max(1200, Math.round(tdee - dailyDeficit));
  }
  if (goal === 'gain_muscle') {
    return Math.round(tdee + 300);
  }
  return tdee;
}

export function calculateMacros(
  calories: number,
  goal: string
): { protein: number; fat: number; carbs: number } {
  if (goal === 'lose_weight') {
    return {
      protein: Math.round(calories * 0.35 / 4),
      fat: Math.round(calories * 0.50 / 9),
      carbs: Math.round(calories * 0.15 / 4),
    };
  }
  return {
    protein: Math.round(calories * 0.30 / 4),
    fat: Math.round(calories * 0.35 / 9),
    carbs: Math.round(calories * 0.35 / 4),
  };
}
