import { prisma } from './db';

interface MealSelection {
  recipeId: string;
  mealType: string;
}

export async function generateWeeklyPlan(
  userId: string,
  startDate: Date
): Promise<string> {
  const preferences = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  const userProducts = await prisma.userProduct.findMany({
    where: { userId },
    select: { productId: true, isExcluded: true },
  });

  const selectedIds = userProducts
    .filter((up) => !up.isExcluded)
    .map((up) => up.productId);

  const excludedIds = userProducts
    .filter((up) => up.isExcluded)
    .map((up) => up.productId);

  let allRecipes = await prisma.recipe.findMany({
    include: {
      ingredients: {
        include: { product: true },
      },
    },
  });

  // If user selected specific products, only use recipes with those products
  if (selectedIds.length > 0) {
    allRecipes = allRecipes.filter((recipe) =>
      recipe.ingredients.every((ing) => selectedIds.includes(ing.productId))
    );
  }

  // Also filter out any excluded products (safety net)
  if (excludedIds.length > 0) {
    allRecipes = allRecipes.filter((recipe) =>
      !recipe.ingredients.some((ing) => excludedIds.includes(ing.productId))
    );
  }

  const complexityLevel = preferences?.complexityLevel || 'moderate';
  let filteredRecipes = allRecipes;

  if (complexityLevel === 'low') {
    filteredRecipes = allRecipes.filter((r) => r.difficulty === 'easy');
  } else if (complexityLevel === 'moderate') {
    filteredRecipes = allRecipes.filter(
      (r) => r.difficulty === 'easy' || r.difficulty === 'medium'
    );
  }

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
  const mealCalorieRatios: Record<string, number> = {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.30,
    snack: 0.10,
  };
  const targetDailyCalories = preferences?.dailyCalories || 1500;

  const existingPlan = await prisma.mealPlan.findFirst({
    where: { userId, isActive: true },
  });

  if (existingPlan) {
    await prisma.mealPlan.update({
      where: { id: existingPlan.id },
      data: { isActive: false },
    });
  }

  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId,
      startDate,
      endDate: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  const daysOfWeek = [
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
    'Niedziela',
  ];

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const dayDate = new Date(startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);

    const day = await prisma.mealPlanDay.create({
      data: {
        mealPlanId: mealPlan.id,
        date: dayDate,
        dayOfWeek: daysOfWeek[dayOffset],
      },
    });

    let dayCalories = 0;
    let dayProtein = 0;
    let dayFat = 0;
    let dayCarbs = 0;

    const usedRecipes: string[] = [];

    for (let mealIdx = 0; mealIdx < mealTypes.length; mealIdx++) {
      const mealType = mealTypes[mealIdx];
      const targetMealCalories = Math.round(targetDailyCalories * mealCalorieRatios[mealType]);
      const caloriesRemaining = targetDailyCalories - dayCalories;

      let typeRecipes = filteredRecipes.filter(
        (r) =>
          r.mealType === mealType && !usedRecipes.includes(r.id)
      );

      // Low complexity: repeat previous day's meals
      if (complexityLevel === 'low' && dayOffset > 0) {
        const prevDay = await prisma.mealPlanDay.findFirst({
          where: {
            mealPlanId: mealPlan.id,
            date: new Date(startDate.getTime() + (dayOffset - 1) * 24 * 60 * 60 * 1000),
          },
          include: { meals: true },
        });
        if (prevDay) {
          const prevMeal = prevDay.meals.find((m) => m.mealType === mealType);
          if (prevMeal) {
            const repeatRecipe = typeRecipes.find((r) => r.id === prevMeal.recipeId);
            if (repeatRecipe) {
              typeRecipes = [repeatRecipe];
            }
          }
        }
      }

      let selectedRecipe = null;

      if (typeRecipes.length > 0) {
        // Pick recipe closest to target calories for this meal
        const lastMeal = mealIdx === mealTypes.length - 1;
        if (lastMeal && typeRecipes.length > 0) {
          // Last meal: pick closest to remaining calories
          selectedRecipe = typeRecipes.reduce((best, curr) => {
            const bestDiff = Math.abs(best.caloriesPerServing - caloriesRemaining);
            const currDiff = Math.abs(curr.caloriesPerServing - caloriesRemaining);
            return currDiff < bestDiff ? curr : best;
          });
        } else {
          // Pick closest to this meal's target calories
          selectedRecipe = typeRecipes.reduce((best, curr) => {
            const bestDiff = Math.abs(best.caloriesPerServing - targetMealCalories);
            const currDiff = Math.abs(curr.caloriesPerServing - targetMealCalories);
            return currDiff < bestDiff ? curr : best;
          });
        }
      } else {
        // Fallback: any recipe of this type
        const fallbackRecipes = filteredRecipes.filter(
          (r) => r.mealType === mealType && !usedRecipes.includes(r.id)
        );
        if (fallbackRecipes.length > 0) {
          selectedRecipe = fallbackRecipes.reduce((best, curr) => {
            const bestDiff = Math.abs(best.caloriesPerServing - targetMealCalories);
            const currDiff = Math.abs(curr.caloriesPerServing - targetMealCalories);
            return currDiff < bestDiff ? curr : best;
          });
        }
      }

      if (selectedRecipe) {
        usedRecipes.push(selectedRecipe.id);

        await prisma.mealPlanMeal.create({
          data: {
            mealPlanDayId: day.id,
            recipeId: selectedRecipe.id,
            mealType,
            sortOrder: mealIdx,
          },
        });

        dayCalories += selectedRecipe.caloriesPerServing;
        dayProtein += selectedRecipe.proteinPerServing;
        dayFat += selectedRecipe.fatPerServing;
        dayCarbs += selectedRecipe.carbsPerServing;
      }
    }

    await prisma.mealPlanDay.update({
      where: { id: day.id },
      data: {
        summaryCalories: dayCalories,
        summaryProtein: dayProtein,
        summaryFat: dayFat,
        summaryCarbs: dayCarbs,
      },
    });
  }

  return mealPlan.id;
}

export async function swapMeal(mealPlanMealId: string, userId: string) {
  const meal = await prisma.mealPlanMeal.findUnique({
    where: { id: mealPlanMealId },
    include: {
      day: {
        include: {
          meals: true,
          mealPlan: true,
        },
      },
    },
  });

  if (!meal || meal.day.mealPlan.userId !== userId) {
    throw new Error('Meal not found');
  }

  const excludedProducts = await prisma.userProduct.findMany({
    where: { userId, isExcluded: true },
    select: { productId: true },
  });

  const selectedProducts = await prisma.userProduct.findMany({
    where: { userId, isExcluded: false },
    select: { productId: true },
  });

  const excludedIds = excludedProducts.map((ep) => ep.productId);
  const selectedIds = selectedProducts.map((sp) => sp.productId);

  let availableRecipes = await prisma.recipe.findMany({
    where: {
      mealType: meal.mealType,
      id: { not: meal.recipeId },
    },
    include: {
      ingredients: true,
    },
  });

  // Only use recipes with selected products
  if (selectedIds.length > 0) {
    availableRecipes = availableRecipes.filter((recipe) =>
      recipe.ingredients.every((ing) => selectedIds.includes(ing.productId))
    );
  }

  // Also filter out excluded products
  if (excludedIds.length > 0) {
    availableRecipes = availableRecipes.filter((recipe) =>
      !recipe.ingredients.some((ing) => excludedIds.includes(ing.productId))
    );
  }

  if (availableRecipes.length === 0) {
    throw new Error('No alternative recipes available');
  }

  const usedInDay = meal.day.meals
    .filter((m) => m.id !== mealPlanMealId)
    .map((m) => m.recipeId);

  const currentDayTotal = meal.day.meals
    .filter((m) => m.id !== mealPlanMealId)
    .reduce((sum, m) => sum + m.recipe.caloriesPerServing, 0);

  const unusedRecipes = availableRecipes.filter(
    (r) => !usedInDay.includes(r.id)
  );

  const candidates = unusedRecipes.length > 0 ? unusedRecipes : availableRecipes;

  // Get user's target calories
  const userPrefs = await prisma.userPreferences.findUnique({ where: { userId } });
  const targetCalories = userPrefs?.dailyCalories || 1500;
  const caloriesNeeded = targetCalories - currentDayTotal;

  // Pick recipe closest to remaining calories
  const newRecipe = candidates.reduce((best, curr) => {
    const bestDiff = Math.abs(best.caloriesPerServing - caloriesNeeded);
    const currDiff = Math.abs(curr.caloriesPerServing - caloriesNeeded);
    return currDiff < bestDiff ? curr : best;
  });

  await prisma.mealPlanMeal.update({
    where: { id: mealPlanMealId },
    data: { recipeId: newRecipe.id },
  });

  // Recalculate day summary
  const dayMeals = await prisma.mealPlanMeal.findMany({
    where: { mealPlanDayId: meal.mealPlanDayId },
    include: { recipe: true },
  });

  let dayCalories = 0;
  let dayProtein = 0;
  let dayFat = 0;
  let dayCarbs = 0;

  for (const m of dayMeals) {
    dayCalories += m.recipe.caloriesPerServing;
    dayProtein += m.recipe.proteinPerServing;
    dayFat += m.recipe.fatPerServing;
    dayCarbs += m.recipe.carbsPerServing;
  }

  await prisma.mealPlanDay.update({
    where: { id: meal.mealPlanDayId },
    data: {
      summaryCalories: dayCalories,
      summaryProtein: dayProtein,
      summaryFat: dayFat,
      summaryCarbs: dayCarbs,
    },
  });

  return newRecipe;
}
