import { portfolio } from "@/src/data/portfolio";
import { GlowCard } from "./GlowCard";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Profile / 01"
            title="Technical by training. Product-minded by practice."
            headingId="about-title"
          />
        </Reveal>
        <div className="about-grid">
          <Reveal className="about-portrait-reveal">
            <GlowCard
              className="portrait-card"
              tone="portrait"
              role="img"
              aria-label="Portrait placeholder for Carl Shi; a final headshot has not been provided."
            >
              <div className="portrait-placeholder">
                <span className="placeholder-label">Portrait asset / pending</span>
                <span className="placeholder-note">Replace with an approved headshot while preserving this editorial crop.</span>
              </div>
            </GlowCard>
          </Reveal>
          <Reveal delay={90}>
            <div className="about-copy">
              <h3>{portfolio.about.heading}</h3>
              {portfolio.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <dl className="profile-facts">
                {portfolio.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="profile-links" aria-label="Profile links">
                {portfolio.links.map((link) =>
                  link.href ? (
                    <a className="text-link" href={link.href} key={link.label}>{link.label} ↗</a>
                  ) : (
                    <span className="text-link is-placeholder" key={link.label}>{link.label}</span>
                  ),
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
