import Image from "next/image";
import { portfolio } from "@/src/data/portfolio";
import { HeroBackground } from "./HeroBackground";
import { Reveal } from "./Reveal";

const portraitSrc = "/media/portrait/carl-hero-retouched.png";

export function Hero() {
  return (
    <section className="hero editorial-hero" aria-labelledby="hero-title">
      <div className="container hero-shell">
        <div className="hero-content">
          <Reveal animateOnMount staggerIndex={0}>
            <p className="availability">{portfolio.availability}</p>
          </Reveal>
          <Reveal animateOnMount staggerIndex={1}>
            <h1 id="hero-title">
              AI products,
              <span> made clear.</span>
            </h1>
          </Reveal>

          <div className="hero-supporting-copy">
            <Reveal animateOnMount staggerIndex={2}>
              <p className="hero-intro">
                I’m Carl Shi, a technical product manager turning AI and complex
                systems into useful, explainable experiences.
              </p>
            </Reveal>
            <Reveal animateOnMount staggerIndex={3}>
              <div className="hero-actions">
                <a className="text-link" href="#contact">
                  Start a conversation <span aria-hidden="true">↗</span>
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal
            className="hero-portrait-composition"
            animateOnMount
            staggerIndex={3}
          >
            <div className="hero-portrait-circle" aria-hidden="true" />
            <Image
              className="hero-cutout-portrait__image"
              src={portraitSrc}
              alt="Portrait of Carl Shi wearing a warm orange blazer"
              width={1287}
              height={1222}
              sizes="(max-width: 760px) 58vw, 290px"
              priority
              unoptimized
            />
          </Reveal>
        </div>

        <Reveal className="hero-visual hero-model-stage" animateOnMount delay={90}>
          <HeroBackground />
        </Reveal>
      </div>
    </section>
  );
}
