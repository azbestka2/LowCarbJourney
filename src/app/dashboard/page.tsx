"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

interface UserData {
  name: string;
  profile: {
    weightStart: number;
    weightCurrent: number;
    targetWeight: number;
    bmi: number;
    goal: string;
    weeklyGoalKg: number;
  };
  preferences: {
    dailyCalories: number;
    dailyProtein: number;
    dailyFat: number;
    dailyCarbs: number;
  };
}

interface MealData {
  id: string;
  mealType: string;
  recipe: {
    id: string;
    name: string;
    caloriesPerServing: number;
    proteinPerServing: number;
    fatPerServing: number;
    carbsPerServing: number;
  };
}

interface MealPlanDay {
  id: string;
  date: string;
  dayOfWeek: string;
  summaryCalories: number;
  summaryProtein: number;
  summaryFat: number;
  summaryCarbs: number;
  meals: MealData[];
}

function getGoalLabel(goal: string): string {
  switch (goal) {
    case "lose_weight":
      return "Schudnę";
    case "maintain":
      return "Utrzymam wagę";
    case "gain_muscle":
      return "Zbuduję masę";
    default:
      return "Schudnę";
  }
}

function getMealTypeLabel(type: string): string {
  switch (type) {
    case "breakfast":
      return "Śniadanie";
    case "lunch":
      return "Lunch";
    case "dinner":
      return "Kolacja";
    case "snack":
      return "Przekąska";
    default:
      return type;
  }
}

function getMealTypeIcon(type: string): string {
  switch (type) {
    case "breakfast":
      return "🌅";
    case "lunch":
      return "☀️";
    case "dinner":
      return "🌙";
    case "snack":
      return "🥜";
    default:
      return "🍽️";
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [mealPlanDay, setMealPlanDay] = useState<MealPlanDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("breakfast");
  const [swappingMealId, setSwappingMealId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, planRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/mealplan"),
        ]);

        if (!userRes.ok) {
          router.push("/login");
          return;
        }

        const userData = await userRes.json();

        if (!userData.profile) {
          router.push("/onboarding");
          return;
        }

        setUser(userData);

        if (planRes.ok) {
          const planData = await planRes.json();
          const days: MealPlanDay[] = planData.days || planData;

          if (Array.isArray(days) && days.length > 0) {
            const today = new Date().toISOString().split("T")[0];
            const todayPlan = days.find(
              (d: MealPlanDay) => d.date === today
            );
            setMealPlanDay(todayPlan || days[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSwapMeal = async (mealPlanMealId: string) => {
    setSwappingMealId(mealPlanMealId);
    try {
      const res = await fetch("/api/mealplan/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealPlanMealId }),
      });

      if (res.ok) {
        const planRes = await fetch("/api/mealplan");
        if (planRes.ok) {
          const planData = await planRes.json();
          const days: MealPlanDay[] = planData.days || planData;

          if (Array.isArray(days) && days.length > 0) {
            const today = new Date().toISOString().split("T")[0];
            const todayPlan = days.find(
              (d: MealPlanDay) => d.date === today
            );
            setMealPlanDay(todayPlan || days[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error swapping meal:", error);
    } finally {
      setSwappingMealId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
        <div className="w-16 h-16 rounded-full bg-green-500/20 animate-pulse" />
      </div>
    );
  }

  if (!user || !mealPlanDay) {
    return null;
  }

  const { profile, preferences } = user;

  const weightLost = profile.weightStart - profile.weightCurrent;
  const weightToLose = profile.weightStart - profile.targetWeight;
  const weightProgress =
    weightToLose > 0
      ? Math.min(Math.round((weightLost / weightToLose) * 100), 100)
      : 0;

  const caloriesRemaining = Math.max(
    0,
    preferences.dailyCalories - mealPlanDay.summaryCalories
  );
  const carbsRemaining = Math.max(
    0,
    preferences.dailyCarbs - mealPlanDay.summaryCarbs
  );
  const proteinRemaining = Math.max(
    0,
    preferences.dailyProtein - mealPlanDay.summaryProtein
  );

  const caloriePercent = Math.min(
    Math.round((mealPlanDay.summaryCalories / preferences.dailyCalories) * 100),
    100
  );
  const proteinPercent = Math.min(
    Math.round((mealPlanDay.summaryProtein / preferences.dailyProtein) * 100),
    100
  );
  const fatPercent = Math.min(
    Math.round((mealPlanDay.summaryFat / preferences.dailyFat) * 100),
    100
  );
  const carbsPercent = Math.min(
    Math.round((mealPlanDay.summaryCarbs / preferences.dailyCarbs) * 100),
    100
  );

  const tabs = ["breakfast", "lunch", "dinner", "snack"];

  const filteredMeals = mealPlanDay.meals.filter(
    (m) => m.mealType === activeTab
  );

  const tips = [
    "Pij dużo wody w ciągu dnia",
    "Jedz powoli i dokładnie przeżuwaj",
    "Dodaj więcej warzyw do posiłków",
    "Nie pomijaj śniadania",
  ];

  return (
    <div className="min-h-screen bg-gray-950 pb-24">
      <div className="green-gradient p-6 pt-12">
        <h1 className="text-2xl font-bold text-white mb-2">
          Witaj, {user.name}!
        </h1>
        <p className="text-green-100 text-sm mb-4">
          Cel: {getGoalLabel(profile.goal)}
        </p>
        <div className="bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${weightProgress}%` }}
          />
        </div>
        <p className="text-green-100 text-xs mt-2">
          {profile.weightCurrent} kg → {profile.targetWeight} kg
          {profile.weeklyGoalKg > 0 && ` (${profile.weeklyGoalKg} kg/tydzień)`}
        </p>
      </div>

      <div className="p-4">
        <div className="glass-card p-4 animate-fadeIn">
          <h2 className="text-white font-semibold mb-4">Dzienny bilans</h2>
          <div className="flex justify-around">
            <div className="nutrition-circle text-center">
              <div className="text-2xl font-bold text-green-400">
                {caloriesRemaining}
              </div>
              <div className="text-gray-400 text-xs">kcal</div>
            </div>
            <div className="nutrition-circle text-center">
              <div className="text-2xl font-bold text-blue-400">
                {carbsRemaining}
              </div>
              <div className="text-gray-400 text-xs">węgle</div>
            </div>
            <div className="nutrition-circle text-center">
              <div className="text-2xl font-bold text-purple-400">
                {proteinRemaining}
              </div>
              <div className="text-gray-400 text-xs">białko</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 mt-4 animate-fadeIn">
          <h2 className="text-white font-semibold mb-4">Postęp dzisiaj</h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Kalorie</span>
                <span>
                  {mealPlanDay.summaryCalories} / {preferences.dailyCalories} kcal
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Białko</span>
                <span>
                  {mealPlanDay.summaryProtein} / {preferences.dailyProtein} g
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Tłuszcze</span>
                <span>
                  {mealPlanDay.summaryFat} / {preferences.dailyFat} g
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Węglowodany</span>
                <span>
                  {mealPlanDay.summaryCarbs} / {preferences.dailyCarbs} g
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 mt-4 animate-fadeIn">
          <h2 className="text-white font-semibold mb-4">Posiłki</h2>
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`day-tab flex items-center gap-1 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <span>{getMealTypeIcon(tab)}</span>
                <span>{getMealTypeLabel(tab)}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredMeals.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Brak posiłków w tym terminie
              </p>
            ) : (
              filteredMeals.map((meal) => (
                <div key={meal.id} className="meal-card p-4 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">
                        {meal.recipe.name}
                      </h3>
                      <div className="flex gap-4 mt-2 text-xs text-gray-400">
                        <span>{meal.recipe.caloriesPerServing} kcal</span>
                        <span>{meal.recipe.carbsPerServing}g węgli</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSwapMeal(meal.id)}
                      disabled={swappingMealId === meal.id}
                      className="text-green-400 text-sm font-medium hover:text-green-300 disabled:opacity-50 transition-colors"
                    >
                      {swappingMealId === meal.id
                        ? "Wymieniam..."
                        : "Wymień"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card p-4 mt-4 animate-fadeIn">
          <h2 className="text-white font-semibold mb-3">Szybkie wskazówki</h2>
          <ul className="space-y-2">
            {tips.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-gray-300 text-sm"
              >
                <span className="text-green-400">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
