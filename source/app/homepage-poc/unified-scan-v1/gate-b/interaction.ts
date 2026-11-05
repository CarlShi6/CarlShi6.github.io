'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

type Phase = 'idle' | 'nearby' | 'scanning' | 'revealed' | 'selected' | 'dismissed';
type State = { id: string | null; phase: Phase };

/** Gate B experiment only. Do not replace the homepage controller before approval. */
export function useGateBScan(reduced: boolean, root: RefObject<HTMLElement | null>) {
  const [state, render] = useState<State>({ id: null, phase: 'idle' });
  const current = useRef(state), origin = useRef<HTMLElement | null>(null);
  const visited = useRef(new Set<string>()), restoring = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
  const set = useCallback((next: State) => { current.current = next; render(next); }, []);
  const later = useCallback((fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); }, []);

  const inspect = useCallback((id: string, target: HTMLElement) => {
    if (restoring.current) return;
    // A pinned selection stays until a new object is chosen, outside click or Escape.
    if (current.current.phase === 'selected') return;
    clear(); origin.current = target;
    if (current.current.id === id && ['nearby', 'scanning'].includes(current.current.phase)) {
      // Moving from a vein hit path to its button must not strand a cancelled scan.
      set({ id, phase: 'revealed' }); visited.current.add(id); return;
    }
    if (reduced || visited.current.has(id)) { set({ id, phase: 'revealed' }); return; }
    set({ id, phase: 'nearby' });
    later(() => set({ id, phase: 'scanning' }), 60);
    later(() => { visited.current.add(id); set({ id, phase: 'revealed' }); }, 340);
  }, [clear, later, reduced, set]);

  const select = useCallback((id: string, target: HTMLElement) => {
    clear(); origin.current = target; visited.current.add(id);
    set({ id, phase: 'selected' }); // Direct switch: no dismissal/closing step required.
  }, [clear, set]);

  const dismiss = useCallback((restore = false) => {
    clear(); if (current.current.phase === 'idle') return;
    set({ id: current.current.id, phase: 'dismissed' });
    later(() => set({ id: null, phase: 'idle' }), reduced ? 0 : 180);
    if (restore) {
      restoring.current = true; origin.current?.focus({ preventScroll: true });
      restoring.current = false;
    }
  }, [clear, later, reduced, set]);

  const leave = useCallback(() => {
    if (['selected', 'dismissed', 'idle'].includes(current.current.phase)) return;
    clear(); later(() => {
      if (origin.current === document.activeElement && origin.current?.matches(':focus-visible')) return;
      dismiss();
    }, 140);
  }, [clear, later, dismiss]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || current.current.phase === 'idle') return;
      event.preventDefault(); dismiss(true);
    };
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const boundary = event.target.closest('[data-scan-boundary]');
      if (boundary && root.current?.contains(boundary)) return;
      dismiss();
    };
    const hidden = () => { if (document.hidden) dismiss(); };
    window.addEventListener('keydown', escape); window.addEventListener('pointerdown', outside);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      clear(); window.removeEventListener('keydown', escape); window.removeEventListener('pointerdown', outside);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [clear, dismiss, root]);
  return { ...state, inspect, select, leave, dismiss };
}
