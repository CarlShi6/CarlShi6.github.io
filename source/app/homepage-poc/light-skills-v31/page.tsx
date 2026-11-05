import Link from 'next/link';
import { CsLogo } from '../cs-logo';
import { BotanicalSpecimen } from './specimen';
import styles from './study.module.css';

export default function Page() {
  return <main className={styles.page}>
    <nav className={styles.nav} aria-label="Primary navigation">
      <Link className={styles.home} href="/"><CsLogo /><span>Home</span></Link>
      <div><Link href="/homepage-poc/projects">Projects</Link><Link href="/homepage-poc/about">About</Link></div>
    </nav>
    <section className={styles.study} aria-labelledby="skills-heading">
      <header className={styles.heading}><h1 id="skills-heading">Skills</h1><p>Carl Shi’s capabilities,<br />traced through a leaf.</p></header>
      <BotanicalSpecimen />
    </section>
    <footer className={styles.footer}>
      <span>Gate A · Static botanical typography</span>
      <Link href="/homepage-poc/light-skills-v3/">Compare with v3 →</Link>
    </footer>
  </main>;
}
