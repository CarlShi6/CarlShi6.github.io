"use client";

import { useEffect, useState } from "react";
import styles from "./theme-switch.module.css";

type Theme = "light" | "dark";
const preferenceKey = "carl-portfolio-home-theme";

export function usePortfolioTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const sync = () => setTheme(document.documentElement.dataset.portfolioTheme === "dark" ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes:true, attributeFilter:["data-portfolio-theme"] });
    const onStorage = (event: StorageEvent) => {
      if (event.key === preferenceKey && (event.newValue === "light" || event.newValue === "dark")) {
        document.documentElement.dataset.portfolioTheme = event.newValue;
      }
    };
    window.addEventListener("storage", onStorage);
    return () => { observer.disconnect(); window.removeEventListener("storage", onStorage); };
  }, []);
  const toggle = () => {
    const next: Theme = document.documentElement.dataset.portfolioTheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.portfolioTheme = next;
    setTheme(next);
    try { localStorage.setItem(preferenceKey, next); } catch { /* Preference is optional. */ }
  };
  return [theme, toggle] as const;
}

export function ThemeSwitch({ onToggle }: { onToggle?: () => void }) {
  const [theme, toggle] = usePortfolioTheme();
  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  return <button type="button" className={styles.toggle} onClick={() => { toggle(); onToggle?.(); }} aria-label={label} aria-pressed={theme === "dark"} title={label}>
    <svg viewBox="0 0 48 26" aria-hidden="true" fill="none"><ellipse cx="24" cy="13" rx="21" ry="8" /><circle className={styles.planet} cx="12" cy="13" r="4" /><circle cx="39" cy="8" r="1" /></svg>
  </button>;
}
