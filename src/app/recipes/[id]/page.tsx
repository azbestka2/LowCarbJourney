"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Ingredient {
  id: string;
  amountG: number;
  product: {
    name: string;
  };
}

interface Recipe {
  id: string;
  name: string;
  description: string | null;
  mealType: string;
  difficulty: string;
  steps: string;
  ketoTip: string | null;
  caloriesPerServing: number;
  proteinPerServing: number;
  fatPerServing: number;
  carbsPerServing: number;
  servingSizeG: number;
  ingredients: Ingredient[];
}

function getMealTypeLabel(type: string): string {
  switch (type) {
    case "breakfast": return "Śniadanie";
    case "lunch": return "Lunch";
    case "dinner": return "Kolacja";
    case "snack": return "Przekąska";
    default: return type;
  }
}

function getDifficultyLabel(diff: string): string {
  switch (diff) {
    case "easy": return "Łatwy";
    case "medium": return "Średni";
    case "hard": return "Trudny";
    default: return diff;
  }
}

function getIngredientEmoji(productName: string): string {
  const name = productName.toLowerCase();
  if (name.includes("kurczak") || name.includes("indyk") || name.includes("mięso") || name.includes("wołow") || name.includes("wieprz") || name.includes("boczek")) return "🥩";
  if (name.includes("jaj")) return "🥚";
  if (name.includes("ser") || name.includes("twaroż") || name.includes("jogurt") || name.includes("śmietan") || name.includes("mozzarell")) return "🧀";
  if (name.includes("awokado")) return "🥑";
  if (name.includes("oliwa") || name.includes("masło") || name.includes("olej")) return "🫒";
  if (name.includes("brokuł")) return "🥦";
  if (name.includes("szpinak") || name.includes("sałat")) return "🥬";
  if (name.includes("pomidor")) return "🍅";
  if (name.includes("ogórek")) return "🥒";
  if (name.includes("cebula")) return "🧅";
  if (name.includes("grzyb") || name.includes("pieczark")) return "🍄";
  if (name.includes("cytryna")) return "🍋";
  if (name.includes("papryka")) return "🌶️";
  if (name.includes("marchew")) return "🥕";
  if (name.includes("orzech") || name.includes("migdał")) return "🥜";
  if (name.includes("chia")) return "🌱";
  if (name.includes("tuńczyk") || name.includes("łosoś") || name.includes("krewet")) return "🐟";
  if (name.includes("kapusta") || name.includes("kimchi")) return "🥬";
  if (name.includes("oliw")) return "🫒";
  if (name.includes("czekolad")) return "🍫";
  if (name.includes("sezam")) return "🌱";
  if (name.includes("cukin")) return "🥒";
  if (name.includes("kalafior")) return "🥦";
  if (name.includes("seler")) return "🥬";
  if (name.includes("rzodkiew")) return "_RADISH_";
  if (name.includes("fazol")) return "🫘";
  if (name.includes("jagod")) return "🫐";
  return "🍽️";
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.push("/login");
          return;
        }

        const id = params.id as string;
        const res = await fetch("/api/recipes");
        if (!res.ok) {
          throw new Error("Nie udało się pobrać przepisów");
        }

        const recipes: Recipe[] = await res.json();
        const found = recipes.find((r) => r.id === id);

        if (!found) {
          setError("Przepis nie znaleziony");
          return;
        }

        setRecipe(found);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Błąd ładowania przepisu");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 rounded-full green-gradient animate-pulse" />
        <p className="text-green-800 mt-4 font-medium">Ładowanie przepisu...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="p-6">
        <button onClick={() => router.back()} className="text-green-700 font-medium mb-6 block">
          ← Wróć
        </button>
        <div className="glass-card p-8 text-center">
          <p className="text-gray-600 text-lg">{error || "Przepis nie znaleziony"}</p>
        </div>
      </div>
    );
  }

  let steps: string[] = [];
  try {
    steps = JSON.parse(recipe.steps);
  } catch {
    steps = [recipe.steps];
  }

  return (
    <div className="p-4 pb-8">
      <button
        onClick={() => router.back()}
        className="text-green-700 font-semibold text-lg mb-4 block hover:text-green-900 transition-colors"
      >
        ← Wróć
      </button>

      <div className="glass-card p-6 mb-4 animate-fadeIn">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
            {getMealTypeLabel(recipe.mealType)}
          </span>
          <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            {getDifficultyLabel(recipe.difficulty)}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-green-900 mb-2">{recipe.name}</h1>
        {recipe.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{recipe.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-2">Porcja: {recipe.servingSizeG}g</p>
      </div>

      <div className="glass-card p-5 mb-4 animate-fadeIn animate-delay-100">
        <h2 className="text-green-800 font-semibold mb-4 text-sm uppercase tracking-wide">Wartości odżywcze</h2>
        <div className="flex justify-around">
          <div className="nutrition-circle bg-gradient-to-br from-orange-100 to-orange-50 text-center">
            <span className="text-lg">🔥</span>
            <span className="text-lg font-bold text-orange-700">{recipe.caloriesPerServing}</span>
            <span className="text-[10px] text-orange-500 font-medium">kcal</span>
          </div>
          <div className="nutrition-circle bg-gradient-to-br from-purple-100 to-purple-50 text-center">
            <span className="text-lg">⚖️</span>
            <span className="text-lg font-bold text-purple-700">{recipe.proteinPerServing}g</span>
            <span className="text-[10px] text-purple-500 font-medium">białko</span>
          </div>
          <div className="nutrition-circle bg-gradient-to-br from-yellow-100 to-yellow-50 text-center">
            <span className="text-lg">💧</span>
            <span className="text-lg font-bold text-yellow-700">{recipe.fatPerServing}g</span>
            <span className="text-[10px] text-yellow-500 font-medium">tłuszcz</span>
          </div>
          <div className="nutrition-circle bg-gradient-to-br from-blue-100 to-blue-50 text-center">
            <span className="text-lg">🧊</span>
            <span className="text-lg font-bold text-blue-700">{recipe.carbsPerServing}g</span>
            <span className="text-[10px] text-blue-500 font-medium">węgle</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 mb-4 animate-fadeIn animate-delay-200">
        <h2 className="text-green-800 font-semibold mb-4 text-sm uppercase tracking-wide">Składniki:</h2>
        <div className="space-y-3">
          {recipe.ingredients.map((ing) => (
            <div key={ing.id} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center flex-shrink-0">
                {getIngredientEmoji(ing.product.name)}
              </span>
              <div className="flex-1">
                <span className="text-gray-800 font-medium text-sm">{ing.product.name}</span>
              </div>
              <span className="text-green-700 font-semibold text-sm bg-green-50 px-2 py-1 rounded-lg">
                {ing.amountG}g
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5 mb-4 animate-fadeIn animate-delay-300">
        <h2 className="text-green-800 font-semibold mb-4 text-sm uppercase tracking-wide">Sposób Przygotowania:</h2>
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="w-7 h-7 rounded-full green-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{idx + 1}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed flex-1">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {recipe.ketoTip && (
        <div className="glass-card p-5 mb-4 animate-fadeIn animate-delay-400 border-l-4 border-green-500">
          <h2 className="text-green-600 font-semibold mb-2 text-sm uppercase tracking-wide">Porada Keto:</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{recipe.ketoTip}</p>
        </div>
      )}

      <button className="w-full py-4 rounded-xl green-gradient text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all animate-fadeIn animate-delay-400">
        Dodaj do Jadłospisu
      </button>
    </div>
  );
}
