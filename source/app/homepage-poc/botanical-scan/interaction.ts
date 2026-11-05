'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type Phase = 'idle' | 'nearby' | 'scanning' | 'revealed' | 'selected' | 'dismissed';
type State = { phase: Phase; id: string | null };

// Shared by the approved standalone study and the homepage's botanical renderer.
export function useSpecimenScan(reduced: boolean, focusReturn?: (id: string | null, origin: HTMLElement | null) => HTMLElement | null) {
  const [state, setState] = useState<State>({ phase: 'idle', id: null });
  const current = useRef(state);
  const visited = useRef(new Set<string>());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const origin = useRef<HTMLElement | null>(null);
  const focusResolver = useRef(focusReturn);
  useEffect(() => { focusResolver.current = focusReturn; }, [focusReturn]);
  const restoringFocus = useRef(false);
  const clear = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
  const set = useCallback((next: State) => { current.current = next; setState(next); }, []);
  const later = useCallback((fn: () => void, delay: number) => { timers.current.push(setTimeout(fn, delay)); }, []);
  const inspect = useCallback((id: string, element: HTMLElement) => {
    if (restoringFocus.current || current.current.phase === 'selected') return;
    if (current.current.id === id && current.current.phase === 'revealed') { clear(); return; }
    clear(); origin.current = element;
    if (reduced || visited.current.has(id)) { set({ id, phase: 'revealed' }); return; }
    set({ id, phase: 'nearby' });
    later(() => set({ id, phase: 'scanning' }), 60);
    later(() => { visited.current.add(id); set({ id, phase: 'revealed' }); }, 340);
  }, [clear, later, reduced, set]);
  const select = useCallback((id: string, element: HTMLElement) => {
    clear(); origin.current = element; visited.current.add(id); set({ id, phase: 'selected' });
  }, [clear, set]);
  const dismiss = useCallback((restore = false) => {
    clear();
    if (current.current.phase === 'idle') return;
    set({ id: current.current.id, phase: 'dismissed' });
    later(() => set({ id: null, phase: 'idle' }), reduced ? 0 : 180);
    if (restore) {
      restoringFocus.current = true;
      (focusResolver.current?.(current.current.id, origin.current) ?? origin.current)?.focus({ preventScroll: true });
      restoringFocus.current = false;
    }
  }, [clear, later, reduced, set]);
  const leave = useCallback(() => {
    if (['selected', 'dismissed', 'idle'].includes(current.current.phase)) return;
    clear(); later(() => {
      if (document.activeElement === origin.current) return;
      dismiss();
    }, 140);
  }, [clear, later, dismiss]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); dismiss(true); } };
    const outside = (e: PointerEvent) => {
      if (!(e.target instanceof Element) || e.target.closest('[data-scan-boundary]')) return;
      dismiss();
    };
    const hidden = () => { if (document.hidden && current.current.phase !== 'selected') dismiss(); };
    window.addEventListener('keydown', escape); window.addEventListener('pointerdown', outside);
    document.addEventListener('visibilitychange', hidden);
    return () => { clear(); window.removeEventListener('keydown', escape); window.removeEventListener('pointerdown', outside); document.removeEventListener('visibilitychange', hidden); };
  }, [clear, dismiss]);
  return { ...state, inspect, select, leave, dismiss };
}
