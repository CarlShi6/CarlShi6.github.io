'use client';

import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';

/** Art-only magnification. Native HTML remains outside this decorative SVG layer. */
export function WaterLens({ id, artId, svg, enabled }: { id: string; artId: string; svg: RefObject<SVGSVGElement | null>; enabled: boolean }) {
  const lens = useRef<SVGGElement>(null), sample = useRef<SVGUseElement>(null);
  const active = useRef(enabled);
  useEffect(() => { active.current = enabled; }, [enabled]);
  useEffect(() => {
    const element = svg.current, group = lens.current, art = sample.current;
    if (!element || !group || !art) return;
    const point = { x: 0, y: 0 };
    let inverse: DOMMatrix | null = null, placed = false;
    const measure = () => {
      const matrix=element.getScreenCTM();
      inverse=matrix&&Math.abs(matrix.a*matrix.d-matrix.b*matrix.c)>1e-8?matrix.inverse():null;
    };
    measure();
    const draw = () => {
      group.setAttribute('transform', `translate(${point.x} ${point.y})`);
      art.setAttribute('transform', `scale(1.16) translate(${-point.x} ${-point.y})`);
    };
    const x = gsap.quickTo(point, 'x', { duration: .12, ease: 'power2.out', onUpdate: draw });
    const y = gsap.quickTo(point, 'y', { duration: .12, ease: 'power2.out', onUpdate: draw });
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      // The homepage specimen can still be travelling from its branch. Its
      // parent transform changes without triggering ResizeObserver.
      measure();
      if (!inverse) return;
      const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(inverse);
      if (!placed || !active.current) { point.x = p.x; point.y = p.y; placed = true; draw(); if(!active.current)return; }
      x(p.x); y(p.y);
    };
    // Listen on the specimen: native buttons sit above the SVG.
    const host = element.parentElement!;
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerenter', measure);
    window.addEventListener('resize', measure); window.addEventListener('scroll', measure, true);
    const observer = new ResizeObserver(measure); observer.observe(element);
    return () => {
      x.tween.kill(); y.tween.kill(); observer.disconnect();
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerenter', measure);
      window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true);
    };
  }, [svg]);
  return <g aria-hidden="true" pointerEvents="none" style={{ display: enabled ? undefined : 'none' }}>
    <defs>
      <filter id={`${id}-refraction`} x="-48" y="-48" width="96" height="96" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="11" result="water"/><feDisplacementMap in="SourceGraphic" in2="water" scale="1.6" xChannelSelector="R" yChannelSelector="G"/></filter>
      <clipPath id={`${id}-lens-clip`}><path d="M-43 5C-47-24-27-44 2-45C31-46 47-25 44 6C42 34 20 45-5 43C-29 41-42 27-43 5Z" /></clipPath>
      <radialGradient id={`${id}-glass`} cx="35%" cy="25%" r="78%"><stop stopColor="#fffdf0" stopOpacity=".12"/><stop offset=".68" stopColor="#dce9d7" stopOpacity=".02"/><stop offset=".94" stopColor="#a2b6b4" stopOpacity=".22"/><stop offset="1" stopColor="#fff8d9" stopOpacity=".55"/></radialGradient>
    </defs>
    <g ref={lens} data-water-lens transform="translate(-200 -200)">
      <g clipPath={`url(#${id}-lens-clip)`}>
        <g filter={`url(#${id}-refraction)`}><use ref={sample} href={`#${artId}`} /></g>
        <circle r="46" fill={`url(#${id}-glass)`}/>
      </g>
      <path d="M-39-12C-33-39-7-49 17-39 M42 9Q37 36 10 41" fill="none" stroke="#fffbed" strokeWidth="2.3" opacity=".82" strokeLinecap="round"/>
      <path d="M-40 12Q-35 32-15 39" fill="none" stroke="#68858a" strokeWidth=".8" opacity=".4"/>
      <ellipse cx="-17" cy="-31" rx="10" ry="3" fill="#fffef6" opacity=".8" transform="rotate(-25 -17 -31)"/>
    </g>
  </g>;
}
