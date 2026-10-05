"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./cursor-hint.module.css";

export function CursorHint({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const hintRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let currentLabel = "";
    const hide = () => {
      cancelAnimationFrame(frame);
      if (hintRef.current) hintRef.current.dataset.visible = "false";
    };
    const move = (event: PointerEvent) => {
      if (!mouse.matches || event.pointerType !== "mouse") { hide(); return; }
      const target = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[data-cursor-hint]") : null;
      if (!target) { hide(); return; }
      const nextLabel = target.dataset.cursorHint ?? "Dive in";
      if (nextLabel !== currentLabel) { currentLabel = nextLabel; setLabel(nextLabel); }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hint = hintRef.current;
        if (!hint) return;
        const gap = 18;
        const x = Math.max(8, Math.min(event.clientX + gap, window.innerWidth - hint.offsetWidth - 8));
        const y = event.clientY + gap + hint.offsetHeight < window.innerHeight - 8
          ? event.clientY + gap : Math.max(8, event.clientY - hint.offsetHeight - gap);
        hint.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        hint.dataset.visible = "true";
      });
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    document.addEventListener("pointerdown", hide, { passive: true });
    window.addEventListener("scroll", hide, { passive: true, capture: true });
    window.addEventListener("blur", hide);
    mouse.addEventListener("change", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", hide);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("blur", hide);
      mouse.removeEventListener("change", hide);
    };
  }, [mounted]);

  return mounted ? createPortal(
    <div ref={hintRef} className={styles.hint} aria-hidden="true" data-visible="false" data-theme={theme}>
      <span>{label}</span>
    </div>, document.body,
  ) : null;
}
