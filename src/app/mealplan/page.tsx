"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

interface Recipe {
  id: string;
  name: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  fatPerServing: number;
  carbsPerServing: number;
  mealType: string;
}

interface MealPlanMeal {
  id: string;
  mealType: string;
  sortOrder: number;
  recipe: Recipe;
}

interface MealPlanDay {
  id: string;
  date: string;
  dayOfWeek: string;
  summaryCalories: number;
  summaryProtein: number;
  summaryFat: number;
  summaryCarbs: number;
  meals: MealPlanMeal[];
}

interface MealPlan {
  id: string;
  startDate: string;
  endDate: string;
  days: MealPlanDay[];
}

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Śniadanie",
  lunch: "Lunch",
  dinner: "Kolacja",
  snack: "Przekąska",
};

const MEAL_ICONS: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🥜",
};

const DAY_NAMES: Record<string, string> = {
  Mon: "Pon",
  Tue: "Wt",
  Wed: "Śr",
  Thu: "Czw",
  Fri: "Pt",
  Sat: "Sob",
  Sun: "Nd",
};

const POLISH_DAYS: Record<string, string> = {
  Poniedziałek: "Pon",
  Wtorek: "Wt",
  Środa: "Śr",
  Czwartek: "Czw",
  Piątek: "Pt",
  Sobota: "Sob",
  Niedziela: "Nd",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dow = date.toLocaleDateString("pl-PL", { weekday: "short" });
  const shortDay = POLISH_DAYS[dow] || DAY_NAMES[dow] || dow;
  return `${day}.${month} ${shortDay}`;
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getMealTypeLabel(type: string): string {
  return MEAL_LABELS[type] || type;
}

function getMealTypeIcon(type: string): string {
  return MEAL_ICONS[type] || "🍽️";
}

export default function MealPlanPage() {
  const router = useRouter();
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [targets, setTargets] = useState({
    dailyCalories: 2000,
    dailyProtein: 120,
    dailyFat: 80,
    dailyCarbs: 50,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, planRes, prefRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/mealplan"),
          fetch("/api/preferences"),
        ]);

        if (!userRes.ok) {
          router.push("/login");
          return;
        }

        if (planRes.ok) {
          const planData = await planRes.json();
          setMealPlan(planData.mealPlan || planData);
        }

        if (prefRes.ok) {
          const prefData = await prefRes.json();
          if (prefData.preferences) {
            setTargets({
              dailyCalories: prefData.preferences.dailyCalories || 2000,
              dailyProtein: prefData.preferences.dailyProtein || 120,
              dailyFat: prefData.preferences.dailyFat || 80,
              dailyCarbs: prefData.preferences.dailyCarbs || 50,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching meal plan:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/mealplan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const planRes = await fetch("/api/mealplan");
        if (planRes.ok) {
          const planData = await planRes.json();
          setMealPlan(planData.mealPlan || planData);
          setActiveDayIndex(0);
        }
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="mobile-container flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 rounded-full green-gradient animate-pulse" />
        <p className="mt-4 text-green-800 font-medium">Ładowanie planu...</p>
      </div>
    );
  }

  if (!mealPlan || !mealPlan.days || mealPlan.days.length === 0) {
    return (
      <div className="mobile-container pb-24">
        <div className="green-gradient p-6 pt-12">
          <h1 className="text-2xl font-bold text-white mb-2">Jadłospis</h1>
          <p className="text-green-100 text-sm">Twój plan żywieniowy</p>
        </div>

        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="glass-card p-8 text-center animate-fadeIn">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Brak planu żywieniowego
            </h2>
            <p className="text-green-600 mb-6">
              Wygeneruj swój pierwszy tygodniowy plan posiłków dopasowany do Twoich preferencji.
            </p>
            <button
              onClick={handleGeneratePlan}
              disabled={generating}
              className="btn-green w-full disabled:opacity-50"
            >
              {generating ? "Generowanie..." : "Generuj Nowy Plan"}
            </button>
          </div>
        </div>

        <BottomNav active="plan" />
      </div>
    );
  }

  const currentDay = mealPlan.days[activeDayIndex];
  const caloriePercent = targets.dailyCalories > 0
    ? Math.min(Math.round((currentDay.summaryCalories / targets.dailyCalories) * 100), 100)
    : 0;
  const carbsPercent = targets.dailyCarbs > 0
    ? Math.min(Math.round((currentDay.summaryCarbs / targets.dailyCarbs) * 100), 100)
    : 0;

  return (
    <div className="mobile-container pb-24">
      <div className="green-gradient p-6 pt-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">Jadłospis</h1>
          <button
            onClick={() => {
              const nextIndex = (activeDayIndex + 1) % mealPlan.days.length;
              setActiveDayIndex(nextIndex);
            }}
            className="text-green-200 text-sm font-medium hover:text-white transition-colors"
          >
            Zmień dzień →
          </button>
        </div>
        <p className="text-green-100 text-sm">
          {formatFullDate(currentDay.date)}
        </p>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          {mealPlan.days.map((day, index) => (
            <button
              key={day.id}
              onClick={() => setActiveDayIndex(index)}
              className={`day-tab flex-shrink-0 ${
                activeDayIndex === index ? "active" : ""
              }`}
            >
              {formatDate(day.date)}
            </button>
          ))}
        </div>

        <div className="glass-card p-4 mb-4 animate-fadeIn">
          <h2 className="text-green-800 font-semibold mb-3">Podsumowanie dnia</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-green-700 mb-1">
                <span>Kalorie</span>
                <span>
                  {currentDay.summaryCalories} / {targets.dailyCalories} kcal
                </span>
              </div>
              <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="progress-bar transition-all duration-500"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-green-700 mb-1">
                <span>Węglowodany</span>
                <span>
                  {currentDay.summaryCarbs} / {targets.dailyCarbs} g
                </span>
              </div>
              <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="progress-bar transition-all duration-500"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
            </div>
            <div className="flex justify-around pt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-green-700">
                  {currentDay.summaryProtein}g
                </div>
                <div className="text-xs text-green-600">Białko</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-700">
                  {currentDay.summaryFat}g
                </div>
                <div className="text-xs text-green-600">Tłuszcze</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-700">
                  {currentDay.summaryCarbs}g
                </div>
                <div className="text-xs text-green-600">Węglowodany</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {MEAL_TYPES.map((mealType, idx) => {
            const mealsOfType = currentDay.meals
              .filter((m) => m.mealType === mealType)
              .sort((a, b) => a.sortOrder - b.sortOrder);

            return (
              <div
                key={mealType}
                className={`animate-fadeIn animate-delay-${(idx + 1) * 100}`}
              >
                <h3 className="text-green-800 font-semibold mb-2 flex items-center gap-2">
                  <span className="text-lg">{getMealTypeIcon(mealType)}</span>
                  {getMealTypeLabel(mealType)}
                </h3>

                {mealsOfType.length === 0 ? (
                  <div className="meal-card p-4 text-center text-green-600 text-sm">
                    Brak przepisu w tym terminie
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mealsOfType.map((meal) => (
                      <div key={meal.id} className="meal-card p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl flex-shrink-0 mt-1">
                            {getMealTypeIcon(meal.mealType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-green-900 font-medium truncate">
                              {meal.recipe.name}
                            </h4>
                            <p className="text-green-600 text-xs mt-1">
                              {meal.recipe.caloriesPerServing} kcal •{" "}
                              {meal.recipe.proteinPerServing}g B •{" "}
                              {meal.recipe.fatPerServing}g T •{" "}
                              {meal.recipe.carbsPerServing}g W
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/recipes/${meal.recipe.id}`)}
                          className="mt-3 w-full text-green-700 text-sm font-medium py-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          Zobacz Przepis
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <button
            onClick={handleGeneratePlan}
            disabled={generating}
            className="btn-green w-full disabled:opacity-50"
          >
            {generating ? "Generowanie..." : "Generuj Nowy Plan"}
          </button>
        </div>
      </div>

      <BottomNav active="plan" />
    </div>
  );
}
