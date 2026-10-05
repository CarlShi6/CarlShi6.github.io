"use client";

import {
  lazy,
  Suspense,
  useSyncExternalStore,
} from "react";

const PixelBlast = lazy(
  () => import("./react-bits/PixelBlast"),
);

const subscribe = () => () => {};

export function SiteBackground() {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <div
      className="site-background"
      data-site-background
      aria-hidden="true"
    >
      {isClient ? (
        <Suspense fallback={null}>
          <PixelBlast
            variant="circle"
            pixelSize={5}
            color="#e89568"
            patternScale={3.25}
            patternDensity={1.35}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.35}
            edgeFade={0.18}
            transparent
          />
        </Suspense>
      ) : null}
    </div>
  );
}
