"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  icon?: string;
}

interface ProductCategory {
  id: string;
  name: string;
  icon?: string;
  products: Product[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 - Health data
  const [gender, setGender] = useState("female");
  const [birthYear, setBirthYear] = useState("1990");
  const [heightCm, setHeightCm] = useState("170");
  const [weightStart, setWeightStart] = useState("80");
  const [activityLevel, setActivityLevel] = useState("moderate");

  // Step 2 - Goal
  const [goal, setGoal] = useState("lose_weight");
  const [targetWeight, setTargetWeight] = useState("65");
  const [weeklyGoalKg, setWeeklyGoalKg] = useState("-0.5");

  // Step 3 - Products
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [excludedProducts, setExcludedProducts] = useState<string[]>([]);

  // Step 4 - Complexity
  const [complexityLevel, setComplexityLevel] = useState("moderate");
  const [dietaryPrefs, setDietaryPrefs] = useState({
    lactoseFree: false,
    glutenFree: false,
    vegetarian: false,
    ketoFriendly: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserName(data.user.name);
        }
      } catch {}
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (step === 3) {
      fetchProducts();
    }
  }, [step]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setCategories(data.categories);
    } catch {
      console.error("Failed to fetch products");
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleExclude = (productId: string) => {
    setExcludedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const allProductIds = categories.flatMap((cat) => cat.products.map((p) => p.id));
  const allSelected = allProductIds.length > 0 && allProductIds.every((id) => selectedProducts.includes(id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts([...allProductIds]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Save profile
      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender,
          birthYear: parseInt(birthYear),
          heightCm: parseFloat(heightCm),
          weightStart: parseFloat(weightStart),
          activityLevel,
          goal,
          targetWeight: goal === "lose_weight" ? parseFloat(targetWeight) : null,
          weeklyGoalKg: goal === "lose_weight" ? parseFloat(weeklyGoalKg) : null,
        }),
      });

      if (!profileRes.ok) throw new Error("Błąd zapisu profilu");

      // Save preferences
      const prefRes = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complexityLevel,
          ...dietaryPrefs,
          selectedProductIds: selectedProducts,
          excludedProductIds: excludedProducts,
        }),
      });

      if (!prefRes.ok) throw new Error("Błąd zapisu preferencji");

      // Generate meal plan
      const planRes = await fetch("/api/mealplan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!planRes.ok) throw new Error("Błąd generowania planu");

      router.push("/dashboard");
    } catch (err) {
      setError("Wystąpił błąd. Spróbuj ponownie.");
      setLoading(false);
    }
  };

  const totalSteps = 4;

  const getActivityLabel = (level: string) => {
    const labels: Record<string, string> = {
      sedentary: "Siedzący (biurowa)",
      light: "Lekko aktywny (1-2 treningi/tydz.)",
      moderate: "Umiarkowanie aktywny (3-4 treningi/tydz.)",
      active: "Aktywny (5-6 treningów/tydz.)",
      very_active: "Bardzo aktywny (codziennie trening)",
    };
    return labels[level] || level;
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto animate-fadeIn">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-900">
              Witaj, {userName || "..."}!
            </span>
            <span className="text-sm text-gray-600">
              Krok {step}/{totalSteps}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full green-gradient-light transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Health Data */}
        {step === 1 && (
          <div className="glass-card p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Twoje dane</h2>
            <p className="text-sm text-gray-600 mb-6">Potrzebujemy tych informacji, aby obliczyć Twoje zapotrzebowanie</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Płeć</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "female", label: "Kobieta" },
                    { value: "male", label: "Mężczyzna" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setGender(opt.value)}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        gender === opt.value
                          ? "green-gradient text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rok urodzenia</label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  min="1920"
                  max="2010"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wzrost (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    min="100"
                    max="250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waga (kg)</label>
                  <input
                    type="number"
                    value={weightStart}
                    onChange={(e) => setWeightStart(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    min="30"
                    max="300"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poziom aktywności</label>
                <div className="space-y-2">
                  {["sedentary", "light", "moderate", "active", "very_active"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setActivityLevel(level)}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                        activityLevel === level
                          ? "green-gradient text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-sm font-medium">{getActivityLabel(level)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="glass-card p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Twój cel</h2>
            <p className="text-sm text-gray-600 mb-6">Co chcesz osiągnąć?</p>

            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  { value: "lose_weight", label: "Schudnąć", desc: "Redukcja masy ciała" },
                  { value: "maintain", label: "Utrzymać wagę", desc: "Zdrowe odżywianie bez redukcji" },
                  { value: "gain_muscle", label: "Zbudować masę", desc: "Przyrost masy mięśniowej" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setGoal(opt.value)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      goal === opt.value
                        ? "green-gradient text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <p className={`text-xs mt-1 ${goal === opt.value ? "text-green-100" : "text-gray-600"}`}>
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>

              {goal === "lose_weight" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Waga docelowa (kg)</label>
                    <input
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                      min="30"
                      max="300"
                      step="0.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo: <span className="text-green-600 font-bold">{weeklyGoalKg} kg/tydzień</span>
                    </label>
                    <input
                      type="range"
                      min="-2"
                      max="-0.25"
                      step="0.25"
                      value={weeklyGoalKg}
                      onChange={(e) => setWeeklyGoalKg(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Wolniej (-0.25)</span>
                      <span>Szybciej (-2.0)</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Products */}
        {step === 3 && (
          <div className="glass-card p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Wybierz produkty</h2>
            <p className="text-sm text-gray-600 mb-4">Zaznacz produkty, które chcesz mieć w jadłospisie</p>
            <p className="text-xs text-gray-500 mb-4">Tip: Kliknij dwukrotnie, aby wykluczyć produkt</p>

            <button
              onClick={toggleSelectAll}
              className="w-full mb-4 py-2 px-4 rounded-xl text-sm font-semibold border-2 border-green-300 text-green-700 bg-green-50 hover:bg-green-100 transition-all"
            >
              {allSelected ? "Odznacz wszystko" : "Zaznacz wszystko"}
            </button>

            <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-2">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.products.map((product) => {
                      const isSelected = selectedProducts.includes(product.id);
                      const isExcluded = excludedProducts.includes(product.id);
                      return (
                        <button
                          key={product.id}
                          onClick={() => toggleProduct(product.id)}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            toggleExclude(product.id);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isExcluded
                              ? "bg-red-100 text-red-600 border border-red-300 line-through"
                              : isSelected
                              ? "green-gradient text-white shadow-sm"
                               : "bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {product.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span> Wybrane
              <span className="inline-block w-3 h-3 rounded-full bg-red-300 ml-2"></span> Wykluczone
            </div>
          </div>
        )}

        {/* Step 4: Preferences */}
        {step === 4 && (
          <div className="glass-card p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Preferencje</h2>
            <p className="text-sm text-gray-600 mb-6">Dostosuj dietę do swoich potrzeb</p>

            <div className="space-y-6">
              {/* Complexity */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Poziom skomplikowania</label>
                <div className="space-y-2">
                  {[
                    { value: "low", label: "Niski", desc: "Proste posiłki, te same dania" },
                    { value: "moderate", label: "Umiarkowany", desc: "Różnorodne posiłki" },
                    { value: "high", label: "Wykwintny", desc: "Duża różnorodność, skomplikowane dania" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setComplexityLevel(opt.value)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        complexityLevel === opt.value
                          ? "green-gradient text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <p className={`text-xs ${complexityLevel === opt.value ? "text-green-100" : "text-gray-600"}`}>
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Ograniczenia żywieniowe</label>
                <div className="space-y-2">
                  {[
                    { key: "lactoseFree", label: "Bez laktozy" },
                    { key: "glutenFree", label: "Bez glutenu" },
                    { key: "vegetarian", label: "Wegetariańskie opcje" },
                    { key: "ketoFriendly", label: "Opcje keto" },
                  ].map((opt) => (
                    <label
                      key={opt.key}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={dietaryPrefs[opt.key as keyof typeof dietaryPrefs]}
                        onChange={(e) =>
                          setDietaryPrefs((prev) => ({
                            ...prev,
                            [opt.key]: e.target.checked,
                          }))
                        }
                        className="checkbox-green"
                      />
                      <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
            >
              Wstecz
            </button>
          )}
          <button
            onClick={() => {
              if (step < totalSteps) {
                setStep((s) => s + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={loading}
            className="flex-1 btn-green text-lg py-3 disabled:opacity-50"
          >
            {loading
              ? "Zapisywanie..."
              : step === totalSteps
              ? "Zakończ i generuj plan"
              : "Dalej"}
          </button>
        </div>
      </div>
    </div>
  );
}
