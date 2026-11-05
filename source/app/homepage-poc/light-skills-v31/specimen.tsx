import { LeafDefinitions } from '../light-home-v24-formation/artwork';
import { outline } from '../light-skills-v3/leaf';
import { skillSpacecraft } from '../space-system.data';
import styles from './study.module.css';

// Original tree leaf, uniformly enlarged. No separate x/y scales or CSS stretching.
// Branch, blade, pigment, veins and inscriptions all use this 520 × 850 space.
const bladeTransform = 'translate(260 780) scale(16)';
const id = 'skills31';
const capability = skillSpacecraft[1];
const secondary = [
  { word: 'Models', d: 'M144 274 Q202 301 264 285' },
  { word: 'APIs', d: 'M268 231 Q312 239 342 211' },
  { word: 'Data', d: 'M305 449 Q351 449 395 422' },
  { word: 'Feasibility', d: 'M116 456 Q194 491 279 467' },
];
const mainVein = 'M105 368 Q234 425 399 331';

export function BotanicalSpecimen() {
  return <figure className={styles.specimen} aria-label="Original pointed watercolor leaf, with Technical Product lettering following its veins">
    <svg viewBox="0 0 520 850" className={styles.art} aria-hidden="true">
      <LeafDefinitions id={id} />
      <style>{`#${id}-leaf-blue path{stroke-width:.08} #${id}-leaf-blue path+path{stroke-width:.09;opacity:.12}`}</style>
      <defs>
        <clipPath id={`${id}-clip`}><path data-original-outline d={outline} transform={bladeTransform} /></clipPath>
        <filter id={`${id}-pigment`} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".017 .032" numOctaves="3" seed="21" result="paper" />
          <feColorMatrix in="paper" type="matrix" values="0 0 0 0 .33 0 0 0 0 .41 0 0 0 0 .39 0 0 0 .22 0" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <radialGradient id={`${id}-reading-wash`}><stop stopColor="#e4e5d4" stopOpacity=".9" /><stop offset=".7" stopColor="#c8d3c5" stopOpacity=".65" /><stop offset="1" stopColor="#becabd" stopOpacity="0" /></radialGradient>
        <path id={`${id}-title-path`} d={mainVein} />
        {secondary.map((vein, i) => <path key={vein.word} id={`${id}-word-${i}`} d={vein.d} />)}
      </defs>
      {/* Stem remains attached at the exact original leaf origin. */}
      <g fill="none" strokeLinecap="round">
        <path d="M409 835 Q306 824 260 780" stroke="#758180" strokeWidth="5" />
        <path d="M408 833 Q306 820 260 780 M323 819 Q327 799 345 791" stroke="#c7c5ac" strokeWidth="1.5" />
      </g>
      <g className={styles.original}><use href={`#${id}-leaf-blue`} transform={bladeTransform} /></g>
      <g clipPath={`url(#${id}-clip)`}>
        {/* An interior crop adds existing watercolor pigment, never replaces the outline. */}
        <image href="/homepage-poc/light-botanical-preview/leaf.webp" x="-380" y="-220" width="1220" height="1830" preserveAspectRatio="xMidYMid meet" opacity=".26" />
        <path d={outline} transform={bladeTransform} fill="#b9c9b5" opacity=".27" filter={`url(#${id}-pigment)`} />
        <ellipse cx="274" cy="583" rx="157" ry="146" fill={`url(#${id}-reading-wash)`} />
        <g fill="none" strokeLinecap="round">
          <path d="M260 780 Q340 545 298 372 Q273 242 244 60" stroke="#5d7369" strokeWidth="3.4" opacity=".45" />
          <path data-midrib d="M260 780 Q340 545 298 372 Q273 242 244 60" stroke="#e4c585" strokeWidth="1.5" />
          {Array.from({ length: 17 }, (_, i) => {
            const y = 181 + i * 29, x = 257 + Math.sin(i / 7) * 58;
            return <g key={i} opacity={.23 + i % 3 * .06} stroke="#f1e2ba" strokeWidth={.6 + i % 3 * .2}>
              <path d={`M${x} ${y + 44} Q${x - 76} ${y + 40} ${x - 160} ${y - 24} M${x} ${y + 44} Q${x + 72} ${y + 20} ${x + 120} ${y - 45}`} />
            </g>;
          })}
          <path d={mainVein} stroke="#d7b378" strokeWidth="2.5" />
          {secondary.map(vein => <path key={vein.word} d={vein.d} stroke="#dfc38b" strokeWidth="1.2" />)}
        </g>
      </g>
      {/* Native SVG text, no raster words. Same curves supply veins and baselines. */}
      <g className={styles.inscriptions}>
        <text className={styles.skillTitle} dy="-7"><textPath href={`#${id}-title-path`} startOffset="5%">{capability.title}</textPath></text>
        {secondary.map((vein, i) => <text key={vein.word} className={styles.keyword} dy="-5"><textPath href={`#${id}-word-${i}`} startOffset="7%">{vein.word}</textPath></text>)}
      </g>
    </svg>
    <div className={styles.reading}>
      <h2 className={styles.srOnly}>{capability.title}</h2>
      <p className={styles.srOnly}>Models, APIs, Data, Feasibility.</p>
      <p>Connect models, APIs and data to user decisions.</p>
      <a href={capability.href}>Explore capability <span aria-hidden="true">↗</span></a>
    </div>
  </figure>;
}
