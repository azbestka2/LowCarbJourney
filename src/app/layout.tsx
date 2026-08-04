import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LowCarb Journey - Asystent Żywieniowy",
  description: "Aplikacja pomagająca w diecie niskowęglowodanowej",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <div className="mobile-container">
          {children}
        </div>
      </body>
    </html>
  );
}
