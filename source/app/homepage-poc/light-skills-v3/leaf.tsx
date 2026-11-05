import { LeafDefinitions } from '../light-home-v24-formation/artwork';

// The SAME leaf outline, pigment and texture used by the current Light preview.
// All coordinates below are in this one 600 × 800 botanical specimen space.
export const outline = 'M0 0 C-16 -5 -17 -23 -4 -36 C-2 -40 -2 -43 -1 -45 C6 -32 20 -22 12 -12 C8 -6 2 -5 0 0Z';
export const veins = [
  { x: 208, y: 240, path: 'M315 700 Q375 520 340 355 Q280 285 208 240' },
  { x: 378, y: 250, path: 'M315 700 Q375 520 340 355 Q360 298 378 250' },
  { x: 104, y: 390, path: 'M315 700 Q375 520 325 430 Q218 405 104 390' },
  { x: 510, y: 435, path: 'M315 700 Q375 520 346 425 Q440 448 510 435' },
];

export function LeafArt({ id, active }: { id: string; active: number | null }) {
  return <svg className="leaf-art" viewBox="0 0 600 800" preserveAspectRatio="none" aria-hidden="true">
    <LeafDefinitions id={id} />
    <style>{`#${id}-leaf-blue path{stroke-width:.09} #${id}-leaf-blue path+path{stroke-width:.16;opacity:.22}`}</style>
    <defs>
      <clipPath id={`${id}-silhouette`}><path d={outline} transform="translate(300 755) scale(21 16)" /></clipPath>
      <radialGradient id={`${id}-wash`}><stop stopColor="#f8f2df" stopOpacity=".97" /><stop offset=".7" stopColor="#f6f0df" stopOpacity=".89" /><stop offset="1" stopColor="#f6f0df" stopOpacity="0" /></radialGradient>
      <filter id={`${id}-diffusion`} x="-30%" y="-30%" width="160%" height="160%"><feTurbulence baseFrequency=".035" numOctaves="2" seed="13" result="pigment" /><feDisplacementMap in="SourceGraphic" in2="pigment" scale="5" /></filter>
    </defs>
    <g data-surface><use href={`#${id}-leaf-blue`} transform="translate(300 755) scale(21 16)" /></g>
    <g clipPath={`url(#${id}-silhouette)`}>
      <image data-pigment href="/homepage-poc/light-botanical-preview/leaf.webp" x="-115" y="-90" width="820" height="1050" preserveAspectRatio="xMidYMid slice" opacity=".78" />
      <g data-fine-veins fill="none" stroke="#f4e5bc" strokeWidth="1.2" opacity=".48">
        {Array.from({ length: 14 }, (_, i) => { const y = 250 + i * 29; return <path key={i} d={`M${338 + Math.sin(i * .2) * 12} ${y + 60} Q${230 - i * 2} ${y + 28} ${156 - i * 3} ${y} M350 ${y + 55} Q430 ${y + 34} ${455 - i * 5} ${y - 10}`} />; })}
      </g>
      <path data-mid-water d="M280 45 C300 190 368 300 353 435 Q378 550 300 755" fill="none" stroke="#f4d699" strokeWidth="5" pathLength="1" />
      {veins.map((vein, i) => <g key={i} data-vein={i} data-active={active === i}>
        <path data-vein-wash d={vein.path} fill="none" stroke="#e9c880" strokeWidth="13" opacity=".22" filter={`url(#${id}-diffusion)`} pathLength="1" />
        <path data-vein-ink d={vein.path} fill="none" stroke="#efcf8d" strokeWidth="2.2" pathLength="1" />
      </g>)}
      <ellipse data-reading-wash cx="301" cy="495" rx="198" ry="211" fill={`url(#${id}-wash)`} />
    </g>
  </svg>;
}
