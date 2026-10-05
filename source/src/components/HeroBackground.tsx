"use client";

import { lazy, Suspense } from "react";

const InteractiveWingHero = lazy(
  () => import("./home/interactive-wing-hero"),
);

export function HeroBackground() {
  return (
    // Future Three.js work can replace this isolated layer without changing hero content or layout.
    <div className="hero-background" aria-hidden="true" data-hero-background>
      <Suspense fallback={null}>
        <InteractiveWingHero />
      </Suspense>
    </div>
  );
}
