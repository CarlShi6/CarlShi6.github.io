"use client";

import Link from "next/link";
import { CursorHint } from "./cursor-hint";
import { CsLogo } from "./cs-logo";
import { IvoryHome } from "./ivory-home";
import { ThemeSwitch, usePortfolioTheme } from "./theme-switch";
import { DarkMotionE6 } from "./dark-motion-e6/prototype";


import styles from "./homepage-poc.module.css";



export function HomepageRC1() {
  const [theme] = usePortfolioTheme();
  return (
    <main className={styles.poc} data-theme={theme} data-integrated="e6">
      {theme === "light" && <CursorHint theme={theme} />}
      <nav className={styles.pocNav} aria-label="Primary navigation">
        <Link className={styles.identity} href="/" aria-label="Carl Shi — Home" data-cursor-hint="Main">
          <span className={styles.identityMark}><CsLogo /></span>
          <span className={styles.homeLabel}>Home</span>
        </Link>
        <div className={styles.themeCenter}><ThemeSwitch /></div>
        <div className={styles.navLinks}>
          <Link href="/homepage-poc/projects#projects">Projects</Link>
          <Link href="/homepage-poc/projects#about">About</Link>
        </div>
      </nav>

      {theme === "dark" && <DarkMotionE6 official />}
      {theme === "light" && <IvoryHome />}
    </main>
  );
}
