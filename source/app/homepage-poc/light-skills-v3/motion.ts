import gsap from 'gsap';

export type Phase = 'idle' | 'watering' | 'expanding' | 'exploring' | 'selected' | 'returning';
export function createLeafMotion(root: HTMLElement, phase: (value: Phase) => void, overview: () => void) {
  const leaf = root.querySelector<HTMLElement>('[data-specimen]')!;
  const nodes = root.querySelector<HTMLElement>('[data-nodes]')!;
  const reading = root.querySelector<HTMLElement>('[data-reading]')!;
  const cursor = root.querySelector<HTMLElement>('[data-droplet-cursor]')!;
  const can = root.querySelector<SVGElement>('[data-pouring-can]')!;
  const drops = Array.from(root.querySelectorAll<SVGElement>('[data-water-drop]'));
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { growth: 0, water: 0, diffusion: .7 };
  let previewReduced = false, active: number | null = null, disposed = false, keyboardWater = false, restoreFocus = false;
  let timeline: gsap.core.Timeline;
  let currentPhase: Phase = 'idle';
  const setPhase = (value: Phase) => { currentPhase = value; if (!disposed) phase(value); };
  const reduced = () => media.matches || previewReduced;
  const render = () => {
    gsap.set(leaf, { scaleX: .38 + state.growth * .62, scaleY: .45 + state.growth * .55, rotation: -6 * (1 - state.growth), y: -30 * (1 - state.growth) });
    root.querySelector('[data-mid-water]')!.setAttribute('stroke-dashoffset', String(1 - state.water));
    root.querySelector('[data-pigment]')!.setAttribute('opacity', String(.45 + .33 * state.water));
    root.querySelector('[data-fine-veins]')!.setAttribute('opacity', String(.18 + .22 * state.growth));
    root.querySelector('[data-reading-wash]')!.setAttribute('opacity', String(state.growth));
    gsap.set(nodes, { opacity: Math.max(0, (state.growth - .65) / .35) });
    root.dataset.growth = state.growth.toFixed(3);
  };
  const context = gsap.context(() => {
    gsap.set(reading, { opacity: 0 });
    gsap.set('[data-mid-water]', { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set('[data-vein-ink], [data-vein-wash]', { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(can, { opacity: 0, transformOrigin: '45% 50%' });
    gsap.set(drops, { opacity: 0 });
    render();
    timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' }, onUpdate: render,
      onComplete: () => { leaf.style.willChange = ''; setPhase('exploring'); },
      onReverseComplete: () => { leaf.style.willChange = ''; setPhase('idle'); } });
    timeline.addLabel('watering', 0)
      .to(can, { opacity: 1, rotation: -18, duration: .2 }, 0)
      .fromTo(drops, { y: -90, x: 30, opacity: 0 }, { y: 85, x: -30, opacity: .85, stagger: .055, duration: .38, ease: 'power1.in' }, .12)
      .to(drops, { opacity: 0, duration: .1, stagger: .04 }, .48)
      .to(state, { water: 1, duration: .75 }, .35)
      .to(can, { opacity: 0, rotation: 0, duration: .24 }, .6)
      .set(drops, { opacity: 0 }, .86)
      .addLabel('expanding', .68)
      .call(() => { if (!timeline.reversed()) setPhase('expanding'); }, [], 'expanding')
      .to(state, { growth: 1, duration: 1.22 }, 'expanding')
      .to(reading, { opacity: 1, duration: .35 }, 1.55)
      .addLabel('exploring', 1.9);
  }, root);

  // Context-owned callbacks: every later hover/selection tween is reverted on disposal.
  context.add('highlight', (index: number | null) => {
    active = index;
    root.querySelectorAll('[data-vein]').forEach((group, i) => {
      gsap.to(group.querySelector('[data-vein-ink]'), { strokeDashoffset: i === index ? 0 : 1, opacity: i === index ? .95 : .2, duration: reduced() ? 0 : .35, overwrite: true });
      gsap.to(group.querySelector('[data-vein-wash]'), { strokeDashoffset: i === index ? 0 : 1, opacity: i === index ? state.diffusion * .4 : 0, duration: reduced() ? 0 : .4, overwrite: true });
    });
  });
  const hideCursor = () => { cursor.style.visibility = 'hidden'; delete leaf.dataset.cursor; };
  const visibility = () => { hideCursor(); if (document.hidden) { if (timeline.isActive()) root.dataset.resume = 'true'; timeline.pause(); } else if (root.dataset.resume) { delete root.dataset.resume; timeline.resume(); } };
  const finish = () => { gsap.killTweensOf(timeline); timeline.pause().progress(1); render(); setPhase('exploring'); };
  const preference = () => { if (reduced() && timeline.progress() > 0) finish(); };
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('resize', hideCursor);
  window.addEventListener('scroll', hideCursor, true);
  media.addEventListener('change', preference);

  return {
    water(fromKeyboard = false) { keyboardWater = fromKeyboard; gsap.killTweensOf(timeline); overview(); leaf.style.willChange = 'transform'; setPhase('watering'); timeline.restart(); if (reduced()) finish(); },
    focusReady() { if (restoreFocus && currentPhase === 'idle') { restoreFocus = false; root.querySelector<HTMLButtonElement>('[data-water-button]')?.focus({ preventScroll: true }); } else if (keyboardWater && currentPhase === 'exploring') { keyboardWater = false; root.querySelector<HTMLButtonElement>('[data-node="0"]')?.focus({ preventScroll: true }); } },
    back() { overview(); context.highlight(null); setPhase('returning'); timeline.pause(); gsap.set(can, { opacity: 0 }); gsap.set(drops, { opacity: 0 });
      // The reverse uses the same growth parameters, without replaying falling water backward.
      timeline.tweenTo(.68, { duration: reduced() ? 0 : .65, onComplete: () => { timeline.pause(0); render(); restoreFocus = true; setPhase('idle'); } }); },
    highlight(index: number | null) { context.highlight(index); },
    select() { setPhase('selected'); },
    explore() { setPhase('exploring'); },
    finish,
    scrub(value: number) { overview(); timeline.pause(.68 + value * 1.22); render(); setPhase(value >= .999 ? 'exploring' : value <= 0 ? 'idle' : 'expanding'); },
    diffusion(value: number) { state.diffusion = value; context.highlight(active); },
    reduced(value: boolean) { previewReduced = value; preference(); },
    snapshot() { return { phase: currentPhase, ...state, reduced: reduced(), time: timeline.time(), active, playing: timeline.isActive() }; },
    hideCursor,
    dispose() { disposed = true; gsap.killTweensOf(timeline); timeline.kill(); context.revert(); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('resize', hideCursor); window.removeEventListener('scroll', hideCursor, true); media.removeEventListener('change', preference); },
  };
}
export type LeafMotion = ReturnType<typeof createLeafMotion>;
