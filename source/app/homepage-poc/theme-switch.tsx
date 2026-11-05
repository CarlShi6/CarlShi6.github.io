"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import styles from "./theme-switch.module.css";

type Theme = "light" | "dark";
const preferenceKey = "carl-portfolio-home-theme";
const clearReveal = () => {
  const root = document.documentElement;
  root.removeAttribute('data-theme-transition');
  root.removeAttribute('data-theme-direction');
  ['x', 'y', 'radius'].forEach(key => root.style.removeProperty(`--theme-reveal-${key}`));
};

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
  const toggle = (requested?: Theme) => {
    const next: Theme = requested ?? (document.documentElement.dataset.portfolioTheme === "dark" ? "light" : "dark");
    document.documentElement.dataset.portfolioTheme = next;
    setTheme(next);
    try { localStorage.setItem(preferenceKey, next); } catch { /* Preference is optional. */ }
  };
  return [theme, toggle] as const;
}

export function ThemeSwitch({ onToggle, theme: controlledTheme, onRequest, variant='labeled', transition='none' }: { transition?: 'none'|'circle'; variant?: 'orbit'|'labeled'; onToggle?: () => void; theme?: Theme; onRequest?: (theme: Theme) => void }) {
  const [storedTheme, toggle] = usePortfolioTheme();
  const theme = controlledTheme ?? storedTheme;
  const active = useRef<{ next: Theme; view?: ViewTransition } | null>(null);
  useEffect(() => {
    if (transition !== 'circle') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => active.current?.view?.skipTransition();
    const visibility = () => { if (document.hidden) stop(); };
    const motion = () => { if (media.matches) stop(); };
    // Captured root contents cannot be hit-tested by the browser. User input
    // takes precedence over a decorative snapshot; moving on settles it.
    const pointer = (event: PointerEvent) => { if (event.movementX || event.movementY) stop(); };
    const click = (event: MouseEvent) => {
      const run = active.current;
      if (!event.isTrusted || event.target !== document.documentElement || !run?.view) return;
      event.preventDefault();
      run.view.skipTransition();
      // Touch / an immediate second click may land on the captured root before
      // any pointer movement. Deliver that one click to the restored native UI.
      const page = location.href;
      void run.view.finished.then(() => {
        if (location.href !== page || active.current) return;
        const target = document.elementFromPoint(event.clientX, event.clientY);
        if (!(target instanceof HTMLElement) || target === document.documentElement) return;
        target.closest<HTMLElement>('button, a, input, select, textarea')?.focus({ preventScroll:true });
        target.dispatchEvent(new MouseEvent('click', {
          bubbles:true, cancelable:true, view:window, clientX:event.clientX, clientY:event.clientY,
          button:event.button, ctrlKey:event.ctrlKey, metaKey:event.metaKey, shiftKey:event.shiftKey, altKey:event.altKey,
        }));
      }, () => undefined);
    };
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', motion);
    // A snapshot cannot follow a live scroll or resize. Settle to the requested
    // theme immediately rather than holding a stale viewport over the reader.
    window.addEventListener('resize', stop);
    window.addEventListener('scroll', stop, { passive:true });
    window.addEventListener('pointermove', pointer, { passive:true });
    window.addEventListener('keydown', stop, true);
    window.addEventListener('click', click, true);
    return () => {
      stop();
      if (active.current) clearReveal();
      active.current = null;
      document.removeEventListener('visibilitychange', visibility);
      media.removeEventListener('change', motion);
      window.removeEventListener('resize', stop);
      window.removeEventListener('scroll', stop);
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('keydown', stop, true);
      window.removeEventListener('click', click, true);
    };
  }, [transition]);
  const select = (next: Theme, button: HTMLButtonElement) => {
    if (next === (active.current?.next ?? theme)) return;
    if (transition === 'circle' && !onRequest) window.dispatchEvent(new Event('portfolio:reading-theme-change'));
    const apply = () => {
      if (onRequest) onRequest(next); else toggle(next);
      onToggle?.();
    };
    active.current?.view?.skipTransition();
    // Only opted-in reading pages use this effect. The homepage owns its Spiral timeline.
    if (transition !== 'circle' || onRequest || !document.startViewTransition ||
        typeof CSS.registerProperty !== 'function' || !CSS.supports('mask-image', 'radial-gradient(black, transparent)') ||
        document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      active.current = null;
      clearReveal();
      apply();
      return;
    }
    const root = document.documentElement;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty('--theme-reveal-x', `${x}px`);
    root.style.setProperty('--theme-reveal-y', `${y}px`);
    // Overscan fully covers the viewport beyond the feathered alpha edge.
    root.style.setProperty('--theme-reveal-radius', `${radius + 32}px`);
    root.setAttribute('data-theme-transition', 'circle');
    root.setAttribute('data-theme-direction', next);
    const run: { next: Theme; view?: ViewTransition } = { next };
    active.current = run;
    const clear = () => {
      if (active.current !== run) return;
      active.current = null;
      clearReveal();
    };
    try {
      run.view = document.startViewTransition(() => {
        // A superseded request must not write its theme after a rapid reversal or unmount.
        if (active.current === run) flushSync(apply);
      });
      void run.view.ready.catch(() => undefined); // Skipped transitions reject ready by design.
      void run.view.finished.then(clear, clear);
    } catch {
      clear();
      apply();
    }
  };
  if (variant === 'labeled') return <div className={styles.segments} data-theme={theme} role="group" aria-label="Color theme">
    {(['dark', 'light'] as const).map(option => <button key={option} type="button" className={styles.segment} aria-label={`${option === 'dark' ? 'Dark' : 'Light'} mode`} aria-pressed={theme === option} onClick={event => select(option, event.currentTarget)}>{option === 'dark' ? 'Dark' : 'Light'}</button>)}
  </div>;
  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  return <button type="button" className={styles.toggle} data-theme={theme} onClick={event => select(theme === 'dark' ? 'light' : 'dark', event.currentTarget)} aria-label={label} aria-pressed={theme === "dark"} title={label}>
    <svg viewBox="0 0 48 26" aria-hidden="true" fill="none"><ellipse cx="24" cy="13" rx="21" ry="8" /><circle className={styles.planet} cx="12" cy="13" r="4" /><circle cx="39" cy="8" r="1" /></svg>
  </button>;
}
