"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = { primary: string; secondary: string; accent: string; surface: string; muted: string };

const DEFAULT_THEME: Theme = {
  primary: "#fafafa",
  secondary: "#e4e4e7",
  accent: "#18181b",
  surface: "#f4f4f5",
  muted: "#a1a1aa",
};

type ThemeContextValue = {
  theme: Theme;
  applyTheme: (t: Theme) => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "my-site-theme";

function applyCSSVariables(t: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", t.primary);
  root.style.setProperty("--color-secondary", t.secondary);
  root.style.setProperty("--color-accent", t.accent);
  root.style.setProperty("--color-surface", t.surface);
  root.style.setProperty("--color-muted", t.muted);
  root.style.setProperty("--color-bg", t.primary);
}

function loadTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Theme;
  } catch { /* ignore */ }
  return DEFAULT_THEME;
}

function saveTheme(t: Theme) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch { /* ignore */ } }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const saved = loadTheme();
    setTheme(saved);
    applyCSSVariables(saved);
  }, []);

  const applyTheme = (t: Theme) => { setTheme(t); applyCSSVariables(t); saveTheme(t); };
  const resetTheme = () => { setTheme(DEFAULT_THEME); applyCSSVariables(DEFAULT_THEME); try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } };

  return (
    <ThemeContext.Provider value={{ theme, applyTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
