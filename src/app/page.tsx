// trigger deploy2
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user.profile) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center animate-fadeIn">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full green-gradient flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-keto-dark mb-2">LowCarb Journey</h1>
        <p className="text-keto-medium">Ładowanie...</p>
      </div>
    </div>
  );
}
