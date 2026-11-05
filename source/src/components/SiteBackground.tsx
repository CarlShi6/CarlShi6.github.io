"use client";
import { usePathname } from 'next/navigation';

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
  const pathname=usePathname();
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  // Editorial routes have their own opaque background (and Projects its own
  // network scene). Mounting PixelBlast here downloaded Three.js and ran an
  // invisible second renderer, even while the Light theme hid this container.
  const route = pathname?.replace(/\/$/, '');
  if (['/homepage-poc/projects', '/homepage-poc/projects/case-studies',
    '/homepage-poc/skills', '/homepage-poc/about', '/homepage-poc/education',
    '/homepage-poc/systems'].includes(route ?? '')) return null;

  // This isolated SVG study owns its paper background; do not run PixelBlast behind it.
  if (pathname === '/homepage-poc/unified-scan-v1' || pathname?.startsWith('/homepage-poc/unified-scan-v1/')) return null;

  // The portfolio homepage owns its scene. Do not run an invisible PixelBlast renderer behind it.
  if(pathname==='/'||pathname==='/homepage-poc'||pathname==='/homepage-poc/'||pathname?.startsWith('/homepage-poc/homepage-rc')||pathname?.startsWith('/homepage-poc/light-home-v2')||pathname?.startsWith('/homepage-poc/dark-reference-flow'))return null;

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
