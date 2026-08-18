"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

interface Profile {
  gender: string;
  birthYear: number;
  heightCm: number;
  weightStart: number;
  weightCurrent: number;
  activityLevel: string;
  goal: string;
  targetWeight: number;
  weeklyGoalKg: number;
  bmi: number;
  bmr: number;
  tdee: number;
}

interface Preferences {
  complexityLevel: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyFat: number;
  dailyCarbs: number;
  lactoseFree: boolean;
  glutenFree: boolean;
  vegetarian: boolean;
  ketoFriendly: boolean;
  mealReminders: boolean;
  macroWarnings: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }
        const meData = await meRes.json();
        setUserEmail(meData.user.email);

        const [profileRes, preferencesRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/preferences"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.profile);
        }

        if (preferencesRes.ok) {
          const prefData = await preferencesRes.json();
          setPreferences(prefData.preferences);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSave = async () => {
    if (!profile || !preferences) return;
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading || !profile || !preferences) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 rounded-full bg-green-500/20 animate-pulse" />
      </div>
    );
  }

  const goalLabel: Record<string, string> = {
    lose_weight: "Schudnąć",
    maintain: "Utrzymać wagę",
    gain_muscle: "Zbudować masę",
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="green-gradient p-6 pt-12">
        <h1 className="text-2xl font-bold text-white">
          Twoje Cele i Preferencje
        </h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="glass-card p-4 animate-fadeIn">
          <h2 className="text-gray-900 font-semibold mb-3">Twój Cel:</h2>
          <div className="space-y-2">
            {(["lose_weight", "maintain", "gain_muscle"] as const).map(
              (goal) => (
                <label
                  key={goal}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    profile.goal === goal
                      ? "bg-green-600/20 border border-green-500/40"
                      : "bg-gray-100/50 border border-gray-200/40 hover:border-gray-300/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={goal}
                    checked={profile.goal === goal}
                    onChange={(e) =>
                      setProfile({ ...profile, goal: e.target.value })
                    }
                    className="accent-green-500"
                  />
                  <span className="text-gray-900 text-sm">{goalLabel[goal]}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div className="glass-card p-4 animate-fadeIn">
          <h2 className="text-gray-900 font-semibold mb-3">Docelowa Waga</h2>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={profile.targetWeight}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  targetWeight: parseFloat(e.target.value) || 0,
                })
              }
              className="flex-1 bg-gray-100 text-gray-900 rounded-xl px-4 py-3 border border-gray-200 focus:border-green-500 focus:outline-none"
            />
            <span className="text-gray-600 text-sm">kg</span>
          </div>
          <p className="text-gray-600 text-xs mt-2">
            Tempo: {Math.abs(profile.weeklyGoalKg)} kg / tydzień
          </p>
        </div>

        <div className="glass-card p-4 animate-fadeIn">
          <h2 className="text-gray-900 font-semibold mb-3">Dzienne Makro:</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Kalorie</span>
                <span className="text-green-400 font-medium">
                  {preferences.dailyCalories} kcal
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={4000}
                step={50}
                value={preferences.dailyCalories}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    dailyCalories: parseInt(e.target.value),
                  })
                }
                className="w-full accent-green-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Białko</span>
                <span className="text-purple-400 font-medium">
                  {preferences.dailyProtein} g
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={300}
                step={5}
                value={preferences.dailyProtein}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    dailyProtein: parseInt(e.target.value),
                  })
                }
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Tłuszcz</span>
                <span className="text-yellow-400 font-medium">
                  {preferences.dailyFat} g
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                step={5}
                value={preferences.dailyFat}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    dailyFat: parseInt(e.target.value),
                  })
                }
                className="w-full accent-yellow-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Węglowodany</span>
                <span className="text-blue-400 font-medium">
                  {preferences.dailyCarbs} g
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={400}
                step={5}
                value={preferences.dailyCarbs}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    dailyCarbs: parseInt(e.target.value),
                  })
                }
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-4 animate-fadeIn">
          <h2 className="text-gray-900 font-semibold mb-3">
            Preferencje Żywieniowe:
          </h2>
          <div className="space-y-2">
            {[
              { key: "lactoseFree" as const, label: "Bez laktozy" },
              { key: "glutenFree" as const, label: "Bez glutenu" },
              { key: "vegetarian" as const, label: "Opcje wegetariańskie" },
              { key: "ketoFriendly" as const, label: "Opcje keto" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-100/50 border border-gray-200/40 cursor-pointer hover:border-gray-300/60 transition-all"
              >
                <span className="text-gray-900 text-sm">{label}</span>
                <input
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={(e) =>
                    setPreferences({ ...preferences, [key]: e.target.checked })
                  }
                  className="accent-green-500 w-5 h-5"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 animate-fadeIn">
          <h2 className="text-gray-900 font-semibold mb-3">Powiadomienia:</h2>
          <div className="space-y-2">
            {[
              {
                key: "mealReminders" as const,
                label: "Przypominaj o posiłkach",
              },
              {
                key: "macroWarnings" as const,
                label: "Powiadom o przekroczeniu makr",
              },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-100/50 border border-gray-200/40 cursor-pointer hover:border-gray-300/60 transition-all"
              >
                <span className="text-gray-900 text-sm">{label}</span>
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    preferences[key] ? "bg-green-600" : "bg-gray-600"
                  }`}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      [key]: !preferences[key],
                    })
                  }
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      preferences[key] ? "translate-x-5" : ""
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 animate-fadeIn">
          <h2 className="text-gray-900 font-semibold mb-3">
            Informacje o Koncie:
          </h2>
          <div className="p-3 rounded-xl bg-gray-100/50 border border-gray-200/40">
            <span className="text-gray-600 text-xs">Email</span>
            <p className="text-gray-900 text-sm mt-0.5">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-green w-full py-3 rounded-xl text-white font-semibold transition-opacity disabled:opacity-50"
        >
          {saving ? "Zapisywanie..." : "Zapisz Zmiany"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors"
        >
          Wyloguj się
        </button>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
