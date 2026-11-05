import gsap from "gsap";

export type LightTimeline = {
  duration: number;
  seek: (seconds: number) => void;
  finish: () => void;
  dispose: () => void;
};

/**
 * A manually sampled, reversible version of LightEntrancePrototype's growth
 * choreography. It owns no ticker, timer, theme state or visibility listener.
 * The RC2 controller is the only clock and can sample in either direction.
 * Original inline styles are restored at the endpoint, so existing hover/focus
 * behavior and the exact RC1 artwork take over again.
 */
export function createLightTimeline(container: HTMLElement, origin?: { x: number; y: number }): LightTimeline {
  const root = container.matches('[aria-label="Ivory Cosmos portfolio"]')
    ? container : container.querySelector<HTMLElement>('[aria-label="Ivory Cosmos portfolio"]');
  if (!root) throw new Error("RC2 Light timeline requires the existing IvoryHome scene.");
  const one = <T extends Element = HTMLElement>(selector: string) => {
    const node = root.querySelector<T>(selector);
    if (!node) throw new Error(`Missing RC2 Light layer: ${selector}`);
    return node;
  };
  const all = <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
  const base = one('[data-light-base]');
  const planet = one('[data-light-planet]');
  const growth = one<SVGSVGElement>('[data-light-branches]');
  const branchArt = one<SVGGElement>('[data-light-branch-art]');
  const branches = all<SVGPathElement>('[data-light-branch]');
  const strings = all<SVGLineElement>('[data-light-string]');
  const leaves = all('[data-leaf-tree]');
  const fruitArt = all('[data-fruit-tree]');
  const charms = all<HTMLAnchorElement>('[data-tree] a');
  const labels = all('[data-light-label]');
  const identity = one('[data-light-identity]');
  const energy = one<SVGSVGElement>('[data-light-energy]');
  const center = one('[data-light-center]').getBoundingClientRect();
  const offset = origin ? { x: origin.x - center.x, y: origin.y - center.y } : { x: 0, y: 0 };
  const nodes = [base, planet, growth, branchArt, identity, energy, ...branches, ...strings, ...leaves, ...fruitArt, ...charms, ...labels];
  const originalStyles = new Map(nodes.map(node => [node, node.getAttribute('style')]));
  let disposed = false;
  let restored = false;
  let timeline!: gsap.core.Timeline;

  const restore = () => {
    for (const [node, value] of originalStyles) {
      if (value === null) node.removeAttribute('style');
      else node.setAttribute('style', value);
    }
    delete root.dataset.lightControlled;
    root.dataset.lightProgress = 'done';
    // Restoring CSS animation names must not replay RC1's automatic mount
    // entrance. Finish only finite CSS animations; hover loops stay untouched.
    for (const animation of root.getAnimations({ subtree: true })) {
      const end = animation.effect?.getComputedTiming().endTime;
      if (typeof end === 'number' && Number.isFinite(end)) {
        try { animation.finish(); } catch { /* Detached or inactive CSS animation. */ }
      }
    }
    restored = true;
  };

  root.dataset.lightControlled = 'true';
  const context = gsap.context(() => {
    timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, id: 'homepage-rc2-light-growth' });
    timeline.set(base, { autoAlpha: 0 }, 0)
      .set(growth, { autoAlpha: 1 }, 0)
      .set(branchArt, { autoAlpha: 1 }, 0)
      .set(planet, { autoAlpha: 1, scale: .34, x: offset.x, y: offset.y, transformOrigin: '50% 61%' }, 0)
      .set(identity, { autoAlpha: 0, y: 12 }, 0)
      .set(branches, { strokeDasharray: 1, strokeDashoffset: 1 }, 0)
      .set(strings, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 }, 0)
      .set(leaves, { autoAlpha: 0, scale: .42 }, 0)
      .set(fruitArt, { autoAlpha: 0, scale: .38 }, 0)
      .set(charms, { autoAlpha: 0, scale: .38, xPercent: -50, x: 0, y: -18 }, 0)
      .set(labels, { autoAlpha: 0, y: 8 }, 0)
      .set(energy, { autoAlpha: 0 }, 0)
      .addLabel('planet', 0)
      .to(planet, { scale: 1, x: 0, y: 0, duration: 1.05, ease: 'expo.out' }, 0)
      .to(identity, { autoAlpha: 1, y: 0, duration: .58 }, .62)
      .addLabel('branches', .62);

    branches.forEach((branch, index) => {
      timeline.to(branch, { strokeDashoffset: 0, duration: index % 4 === 0 ? 1.55 : 1.25, ease: 'power3.inOut' }, .62 + (index % 4) * .12 + (index > 3 ? .08 : 0));
    });
    leaves.forEach((leaf, index) => {
      // RC1 uses individual outer canopy clusters. Wait for their fine twigs
      // (the full-resolution artwork handoff) instead of revealing detached
      // leaves while the main trunk mask is still advancing.
      timeline.to(leaf, { autoAlpha: .28, scale: 1, duration: 1, ease: 'expo.out' }, 2.55 + (index % 5) * .035 + (index > 4 ? .1 : 0));
    });
    timeline.to(labels, { autoAlpha: 1, y: 0, duration: .48, stagger: .1 }, 1.72)
      .to(energy, { autoAlpha: 1, duration: .54 }, 1.94);
    strings.forEach((string, index) => {
      timeline.to(string, { strokeDashoffset: 0, autoAlpha: .58, duration: .54, ease: 'power2.inOut' }, 1.94 + index * .075);
    });
    fruitArt.forEach((fruit, index) => {
      timeline.to(fruit, { autoAlpha: .62, scale: 1, duration: .52 }, 2.12 + index * .08);
    });
    charms.forEach((charm, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const isSkill = charm.hasAttribute('data-tool');
      // Skills are anchored by their hanging stem; project hit areas are
      // centered on the fruit. Preserve both original transform conventions.
      timeline.set(charm, { yPercent: isSkill ? 0 : -50 }, 0);
      timeline.to(charm, {
        keyframes: [
          { autoAlpha: isSkill ? .78 : .72, scale: isSkill ? .9 : .92, y: 0, rotation: direction * 7, duration: .52 },
          { rotation: direction * -3.5, duration: .32, ease: 'power2.inOut' },
          { rotation: direction * 1.4, duration: .26, ease: 'power2.inOut' },
          { rotation: 0, duration: .22, ease: 'power2.out' },
        ],
        transformOrigin: '50% -64px',
      }, 2.12 + index * .08);
    });
    // The final source includes the smallest twigs and paper texture. Blend it
    // back at identical coordinates after the masked branch growth, rather
    // than changing the approved artwork to fit a new rendering system.
    timeline.to(base, { autoAlpha: 1, duration: .42 }, 2.45)
      .to([planet, branchArt], { autoAlpha: 0, duration: .42 }, 2.45)
      .to(strings, { autoAlpha: 0, duration: .25 }, 3.55)
      .set(growth, { autoAlpha: 0 }, 4.08);
  }, root);

  const duration = timeline.duration();
  const seek = (seconds: number) => {
    if (disposed) return;
    const t = Math.max(0, Math.min(duration, seconds));
    if (t >= duration) {
      timeline.totalTime(duration, true).pause();
      if (!restored) restore();
      return;
    }
    root.dataset.lightControlled = 'true';
    root.dataset.lightProgress = `${t.toFixed(3)}`;
    if (restored) {
      // A final-frame restore clears GSAP's inline transforms. Re-render the
      // paused timeline from zero once when reversing from the stable world.
      timeline.totalTime(0, true).pause();
      restored = false;
    }
    timeline.totalTime(t, true).pause();
  };

  // Construct at the stable frame; caller explicitly seeks when the shared
  // transition begins. No separate Light entrance auto-plays on mount.
  seek(duration);
  return {
    duration,
    seek,
    finish: () => seek(duration),
    dispose: () => {
      if (disposed) return;
      disposed = true;
      context.revert();
      restore();
      delete root.dataset.lightProgress;
    },
  };
}
