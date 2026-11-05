'use client';

import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import styles from './editorial-motion.module.css';

/** Selected Phase 4B word timelines, with reading-page lifecycle guards.
 * Theme is sampled only when starting; theme mutations settle, never replay.
 * The host retains its semantic heading, typography, margins and navigation.
 */
export function EditorialMotion({ text, active = true }: { text: string; active?: boolean }) {
  const root = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const page = document.documentElement;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const words = [...element.querySelectorAll<HTMLElement>('[data-word]')];
    let started = false, disposed = false;
    let timeline: gsap.core.Timeline | undefined;
    let visible: IntersectionObserver | undefined;
    const context = gsap.context(() => {}, element);
    const settle = () => {
      timeline?.kill();
      words.forEach(word => {
        word.textContent = word.dataset.word!;
        word.style.setProperty('--ink', '120%');
      });
      element.dataset.motionState = 'complete';
      element.dataset.motionProgress = '1';
    };
    const start = () => {
      if (started || disposed) return;
      started = true;
      visible?.disconnect();
      if (!active || media.matches || document.hidden || page.hasAttribute('data-theme-transition')) {
        settle();
        return;
      }
      const dark = page.dataset.portfolioTheme === 'dark';
      element.dataset.effect = dark ? 'decode' : 'ink';
      element.dataset.motionState = 'running';
      element.dataset.motionRuns = String(Number(element.dataset.motionRuns ?? 0) + 1);
      context.add(() => {
        gsap.registerPlugin(ScrambleTextPlugin);
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' },
          onUpdate: () => { element.dataset.motionProgress = String(tl.progress()); },
          onComplete: settle });
        timeline = tl;
        const total = words.reduce((sum, word) => sum + word.dataset.word!.length, 0);
        let offset = 0;
        words.forEach(word => {
          const value = word.dataset.word!, share = value.length / total;
          if (dark) {
            tl.set(word, { textContent: '' }, 0);
            tl.to(word, { duration: .25 + share * .22,
              scrambleText: { text: value, chars: '01/—', speed: .35, revealDelay: 0, tweenLength: false }
            }, offset * .28);
          } else {
            const travel = .72 - .16;
            tl.fromTo(word, { '--ink': '-20%' }, { '--ink': '120%',
              duration: .16 + share * travel, ease: 'sine.inOut' }, offset * travel);
          }
          offset += share;
        });
        if (dark) tl.duration(.56);
        tl.play();
      });
    };
    if (active) {
      // One entrance per activation, not a scroll-linked or repeating reveal.
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < innerHeight) start();
      else {
        visible = new IntersectionObserver(entries => {
          if (entries.some(entry => entry.isIntersecting)) start();
        }, { threshold: .15 });
        visible.observe(element);
      }
    } else settle();
    const themeChange = () => { if (started) settle(); };
    const themeObserver = new MutationObserver(themeChange);
    themeObserver.observe(page, { attributes: true, attributeFilter: ['data-portfolio-theme', 'data-theme-transition'] });
    const preference = () => { if (media.matches) settle(); };
    const visibility = () => { if (document.hidden) settle(); };
    // Synchronous event before Phase 4A captures its old-theme snapshot.
    window.addEventListener('portfolio:reading-theme-change', themeChange);
    window.addEventListener('resize', settle);
    window.addEventListener('pagehide', settle);
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', preference);
    return () => {
      disposed = true;
      visible?.disconnect();
      themeObserver.disconnect();
      context.revert();
      settle();
      window.removeEventListener('portfolio:reading-theme-change', themeChange);
      window.removeEventListener('resize', settle);
      window.removeEventListener('pagehide', settle);
      document.removeEventListener('visibilitychange', visibility);
      media.removeEventListener('change', preference);
    };
  }, [text, active]);
  return <span ref={root} className={styles.root} data-editorial-motion>
    <span className={styles.semantic} data-semantic>{text}</span>
    <span aria-hidden="true">{text.split(/(\s+)/).map((word, index) => /^\s+$/.test(word) ? word :
      <span className={styles.word} key={index}>
        <span className={styles.reserve}>{word}</span>
        <span className={styles.output} data-word={word} style={{ '--edge': `${96 + (index % 4) * 5}deg` } as CSSProperties}>{word}</span>
      </span>
    )}</span>
  </span>;
}
