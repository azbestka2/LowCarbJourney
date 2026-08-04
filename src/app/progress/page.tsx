"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

interface ProgressEntry {
  id: string;
  date: string;
  weight: number;
  caloriesEaten: number;
  notes: string;
}

interface Stats {
  startWeight: number;
  currentWeight: number;
  targetWeight: number;
  totalLost: number;
  remainingToGoal: number;
  avgMacros: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

interface Preferences {
  targetCalories: number;
  targetProtein: number;
  targetFat: number;
  targetCarbs: number;
}

export default function ProgressPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWeight, setNewWeight] = useState<number>(0);
  const [newNotes, setNewNotes] = useState("");
  const [preferences, setPreferences] = useState<Preferences>({
    targetCalories: 2000,
    targetProtein: 150,
    targetFat: 70,
    targetCarbs: 20,
  });
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayProtein, setTodayProtein] = useState(0);
  const [todayFat, setTodayFat] = useState(0);
  const [todayCarbs, setTodayCarbs] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.push("/login");
          return;
        }

        const progressRes = await fetch("/api/progress");
        if (progressRes.ok) {
          const data = await progressRes.json();
          setEntries(data.entries || []);
          setStats(data.stats || null);
          setTodayCalories(data.todayCalories || 0);
          setTodayProtein(data.todayProtein || 0);
          setTodayFat(data.todayFat || 0);
          setTodayCarbs(data.todayCarbs || 0);
        }

        const prefRes = await fetch("/api/preferences");
        if (prefRes.ok) {
          const prefData = await prefRes.json();
          setPreferences(prefData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: newWeight, notes: newNotes }),
      });

      if (res.ok) {
        setShowAddForm(false);
        setNewWeight(0);
        setNewNotes("");
        const progressRes = await fetch("/api/progress");
        if (progressRes.ok) {
          const data = await progressRes.json();
          setEntries(data.entries || []);
          setStats(data.stats || null);
          setTodayCalories(data.todayCalories || 0);
          setTodayProtein(data.todayProtein || 0);
          setTodayFat(data.todayFat || 0);
          setTodayCarbs(data.todayCarbs || 0);
        }
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-green-600 text-lg">Ładowanie...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const maxWeight = Math.max(...entries.map((e) => e.weight), stats?.startWeight || 0);
  const minWeight = Math.min(...entries.map((e) => e.weight), stats?.currentWeight || 0);
  const weightRange = maxWeight - minWeight || 1;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 pt-12">
        <h1 className="text-2xl font-bold">Twoje Postępy</h1>
        <p className="text-green-100 mt-1">Śledź swój sukces</p>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Waga Początkowa</p>
              <p className="text-2xl font-bold text-gray-800">{stats.startWeight} kg</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Utracone kg</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-green-600">{stats.totalLost} kg</p>
                <span className="text-green-500">↓</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Cel</p>
              <p className="text-2xl font-bold text-gray-800">{stats.targetWeight} kg</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-500 text-sm">Waga Aktualna</p>
              <p className="text-2xl font-bold text-green-600">{stats.currentWeight} kg</p>
            </div>
          </div>
        )}

        {/* Weight Trend */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Trend Wagi</h2>
          {entries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Brak pomiarów</p>
          ) : (
            <div className="space-y-2">
              {entries.slice().reverse().map((entry) => {
                const barWidth = ((entry.weight - minWeight) / weightRange) * 100;
                return (
                  <div key={entry.id} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-gray-500">{formatDate(entry.date)}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                        style={{ width: `${Math.max(barWidth, 10)}%` }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-gray-700">
                      {entry.weight} kg
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Average Macros */}
        {stats && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Średnie Makro z 30 dni</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Kalorie</span>
                  <span className="text-gray-800">
                    {stats.avgMacros.calories} / {preferences.targetCalories} kcal
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${Math.min((stats.avgMacros.calories / preferences.targetCalories) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Białko</span>
                  <span className="text-gray-800">
                    {stats.avgMacros.protein}g / {preferences.targetProtein}g
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min((stats.avgMacros.protein / preferences.targetProtein) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Tłuszcze</span>
                  <span className="text-gray-800">
                    {stats.avgMacros.fat}g / {preferences.targetFat}g
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width: `${Math.min((stats.avgMacros.fat / preferences.targetFat) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Węglowodany</span>
                  <span className="text-gray-800">
                    {stats.avgMacros.carbs}g / {preferences.targetCarbs}g
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{
                      width: `${Math.min((stats.avgMacros.carbs / preferences.targetCarbs) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Today's Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Dzisiejsze Podsumowanie</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{todayCalories}</p>
              <p className="text-xs text-gray-500">kcal</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{todayProtein}g</p>
              <p className="text-xs text-gray-500">białko</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{todayFat}g</p>
              <p className="text-xs text-gray-500">tłuszcze</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{todayCarbs}g</p>
              <p className="text-xs text-gray-500">węglowodany</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Measurement Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:shadow-xl transition-shadow"
      >
        +
      </button>

      {/* Add Measurement Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dodaj Pomiar</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Waga (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight || ""}
                  onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                  placeholder="np. 85.5"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Notatki</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 h-24 resize-none"
                  placeholder="Opcjonalne notatki..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:shadow-lg transition-shadow"
                >
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="progress" />
    </div>
  );
}