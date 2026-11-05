'use client';

import { useId, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { CsLogo } from '../cs-logo';
import { skillSpacecraft } from '../space-system.data';
import { LeafArt, outline, veins } from './leaf';
import { createLeafMotion, type LeafMotion, type Phase } from './motion';
import styles from './study.module.css';

declare global { interface Window { __lightSkillsV3?: LeafMotion & { selectSkill: (index: number) => void; contentProgress: (value: number) => void } } }

function WateringCan() {
  return <svg viewBox="0 0 88 68" aria-hidden="true" fill="none"><path d="M21 30 Q19 56 31 58 L56 56 Q64 42 58 28Z" fill="#bac5c1" stroke="#536977" strokeWidth="1.3" /><path d="M60 31 Q80 3 84 18 Q86 32 63 43 M23 36 L9 23 4 26 22 49 M6 20 L2 29 M31 28 Q30 12 48 19 L52 28" stroke="#536977" strokeWidth="2" /><path d="M30 34 Q25 49 34 52" stroke="#f6edd8" strokeWidth="3" /></svg>;
}

export function LightSkillsStudy() {
  const id = useId().replace(/:/g, '');
  const root = useRef<HTMLElement>(null), api = useRef<LeafMotion | null>(null);
  const content = useRef<HTMLDivElement>(null), reveal = useRef<gsap.core.Tween | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [selected, setSelected] = useState<number | null>(null), [hovered, setHovered] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false), [diffusion, setDiffusion] = useState(.7);
  const [progress, setProgress] = useState(0), [contentProgress, setContentProgress] = useState(1);
  const ready = phase === 'exploring' || phase === 'selected';
  const active = hovered ?? selected;
  const item = selected === null ? null : skillSpacecraft[selected];
  const select = (index: number) => { api.current?.finish(); setSelected(index); setHovered(index); setContentProgress(1); api.current?.select(); };
  const scrubContent = (value: number) => { setContentProgress(value); reveal.current?.pause().progress(value); };

  useLayoutEffect(() => {
    const motion = createLeafMotion(root.current!, value => { setPhase(value); if (value === 'exploring' || value === 'selected') setProgress(1); else if (value === 'idle') setProgress(0); }, () => { setSelected(null); setHovered(null); });
    api.current = motion;
    if (process.env.NODE_ENV !== 'production') {
      window.__lightSkillsV3 = { ...motion, selectSkill: select, contentProgress: scrubContent };
    }
    const reducedFrame = matchMedia('(prefers-reduced-motion: reduce)').matches ? requestAnimationFrame(() => motion.finish()) : 0;
    return () => { cancelAnimationFrame(reducedFrame); motion.dispose(); api.current = null; delete window.__lightSkillsV3; };
  }, []);

  useLayoutEffect(() => { api.current?.highlight(active); }, [active]);
  useLayoutEffect(() => { api.current?.focusReady(); if (phase !== 'exploring' && phase !== 'selected') api.current?.hideCursor(); }, [phase]);
  useLayoutEffect(() => {
    if (!content.current) return;
    const context = gsap.context(() => {
      reveal.current = gsap.fromTo(content.current, { opacity: .45, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: api.current?.snapshot().reduced ? 0 : .45, ease: 'power2.out' });
    }, content);
    return () => { context.revert(); reveal.current = null; };
  }, [selected]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const leaf = event.currentTarget, cursor = root.current!.querySelector<HTMLElement>('[data-droplet-cursor]')!;
    if (!ready || event.pointerType !== 'mouse' || api.current?.snapshot().reduced || !matchMedia('(hover:hover) and (pointer:fine)').matches) { api.current?.hideCursor(); return; }
    const box = leaf.getBoundingClientRect();
    const x = (event.clientX - box.x) / box.width * 600, y = (event.clientY - box.y) / box.height * 800;
    const shape = leaf.querySelector<SVGPathElement>('[data-leaf-hit]')!;
    if (!shape.isPointInFill(new DOMPoint((x - 300) / 21, (y - 755) / 16))) { api.current?.hideCursor(); setHovered(null); return; }
    leaf.dataset.cursor = 'true'; cursor.style.visibility = 'visible';
    cursor.style.transform = `translate3d(${event.clientX - 7}px,${event.clientY - 5}px,0)`;
    // Sampling in the shared SVG space; no new tween per pointer event.
    let closest = -1, distance = 82;
    leaf.querySelectorAll<SVGPathElement>('[data-vein-ink]').forEach((path, i) => {
      const length = path.getTotalLength();
      for (let j = 12; j <= 24; j++) { const p = path.getPointAtLength(length * j / 24); const d = Math.hypot(p.x - x, p.y - y); if (d < distance) { closest = i; distance = d; } }
    });
    setHovered(closest < 0 ? null : closest);
  };
  const escape = () => {
    if (selected !== null) { const index = selected; setSelected(null); setHovered(null); api.current?.explore(); root.current?.querySelector<HTMLButtonElement>(`[data-node="${index}"]`)?.focus(); }
    else if (phase !== 'idle') api.current?.back();
  };

  return <main ref={root} className={styles.page} data-phase={phase} data-reduced={reduced} onKeyDown={event => { api.current?.hideCursor(); if (event.key === 'Escape') { event.preventDefault(); escape(); } }}>
    <nav className={styles.nav} aria-label="Main navigation"><Link href="/" className={styles.home}><CsLogo />Home</Link><div><Link href="/homepage-poc/projects">Projects</Link><Link href="/homepage-poc/about">About</Link></div></nav>
    <header className={styles.heading}><div><p>My botanical practice</p><h1>Skills, taking shape.</h1></div><p>Four connected capabilities.<br />One living leaf.</p></header>
    <div className={styles.tools}>
      <button data-water-button hidden={phase !== 'idle'} onClick={event => api.current?.water(event.detail === 0)}><WateringCan /><span>Water to explore</span></button>
      <button hidden={phase === 'idle' || phase === 'returning'} onClick={() => api.current?.back()}>← Back to the leaf</button>
      <p role="status" className={styles.status}>{phase === 'watering' ? 'Water travels through the vein…' : phase === 'expanding' ? 'The leaf unfolds…' : phase === 'returning' ? 'Returning to the leaf…' : phase === 'idle' ? 'A little water. A new perspective.' : 'Follow a vein. Discover a capability.'}</p>
    </div>
    <section className={styles.stage} aria-label="Living skills leaf">
      <svg className={styles.pouring} viewBox="0 0 300 300" aria-hidden="true"><g data-pouring-can><svg x="155" y="30" width="100" height="80"><WateringCan /></svg></g>{Array.from({ length: 7 }, (_, i) => <path data-water-drop key={i} d={`M${110 + i * 9} 110 q-7 12 0 13 q7 0 0 -13`} fill="#7999a2" />)}</svg>
      <div data-specimen className={styles.specimen} onPointerMove={move} onPointerLeave={() => { api.current?.hideCursor(); setHovered(null); }} onClick={event => { if (ready && hovered !== null && !(event.target as Element).closest('button,a,[data-reading]')) select(hovered); }}>
        <LeafArt id={id} active={active} />
        <svg className={styles.hit} viewBox="0 0 600 800" preserveAspectRatio="none" aria-hidden="true"><path data-leaf-hit d={outline} transform="translate(300 755) scale(21 16)" fill="transparent" /></svg>
        <div data-nodes className={styles.nodes} role="group" aria-label="Explore a skill" inert={!ready}>{veins.map((v, i) => <button data-node={i} key={i} style={{ left: `${v.x / 6}%`, top: `${v.y / 8}%` }} aria-label={skillSpacecraft[i].title} aria-pressed={selected === i} aria-controls="leaf-capability" onClick={() => select(i)} onPointerEnter={() => setHovered(i)} onFocus={() => setHovered(i)} onBlur={() => setHovered(null)}><span>{i + 1}</span></button>)}</div>
        {ready && selected !== null && hovered !== null && selected !== hovered && <p className={styles.nodeName}>{skillSpacecraft[hovered].title}</p>}
        <div data-reading className={styles.inscription} inert={!ready} aria-hidden={!ready}>
          <div id="leaf-capability" aria-live="polite" aria-atomic="true">
            {ready && (item ? <><h2>{item.title}</h2><div ref={content} data-content><p className={styles.description}>{item.summary}</p><ul>{item.detail.split(' · ').map(word => <li key={word}>{word}</li>)}</ul><Link href={item.href}>Explore capability <span aria-hidden="true">↗</span></Link></div></> : <><h2>{hovered === null ? 'Follow a vein.' : skillSpacecraft[hovered].title}</h2><p>{hovered === null ? 'Four practices, connected. Choose a numbered vein to see how I work.' : 'Select this vein to explore the practice.'}</p></>)}
          </div>
        </div>
      </div>
    </section>
    <svg data-droplet-cursor className={styles.cursor} viewBox="0 0 20 28" aria-hidden="true"><path d="M10 2 C7 9 2 13 2 18 A8 8 0 0 0 18 18 C18 13 13 8 10 2Z" fill="#c4dce0b3" stroke="#5c7f8e" strokeWidth="1" /><path d="M6 15 Q3 22 9 23" stroke="#fffdf5" strokeWidth="2" fill="none" /></svg>
    <footer className={styles.footer}><span>Design × Business × Technology</span><Link href="/homepage-poc/skills">Current Skills page ↗</Link></footer>
    {process.env.NODE_ENV !== 'production' && <details className={styles.inspector}><summary>Motion Inspector · local study</summary><div>
      <button onClick={() => api.current?.water()}>Replay watering</button><button onClick={() => { api.current?.finish(); setProgress(1); }}>Expanded overview</button>
      <label>Leaf expansion <input aria-label="Leaf expansion progress" type="range" min="0" max="1" step=".01" value={progress} onChange={e => { const v = Number(e.target.value); setProgress(v); api.current?.scrub(v); }} /></label>
      <label>Vein selection <select aria-label="Vein selection" value={selected ?? ''} onChange={e => { if (e.target.value !== '') select(Number(e.target.value)); else { api.current?.finish(); setSelected(null); setHovered(null); } }}><option value="">Overview</option>{skillSpacecraft.map((skill, i) => <option key={skill.id} value={i}>{skill.title}</option>)}</select></label>
      <label>Water diffusion <input aria-label="Water diffusion intensity" type="range" min="0" max="1" step=".05" value={diffusion} onChange={e => { const v = Number(e.target.value); setDiffusion(v); api.current?.diffusion(v); }} /></label>
      <label>Content reveal <input aria-label="Content reveal progress" type="range" min="0" max="1" step=".01" disabled={selected === null} value={contentProgress} onChange={e => scrubContent(Number(e.target.value))} /></label>
      <label><input type="checkbox" checked={reduced} onChange={e => { setReduced(e.target.checked); api.current?.reduced(e.target.checked); }} /> Reduced-motion preview</label>
    </div></details>}
  </main>;
}
