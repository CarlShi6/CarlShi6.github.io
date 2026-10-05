import { portfolio } from "@/src/data/portfolio";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact-shell">
        <Reveal className="contact-topline" staggerIndex={0} duration={700}>
          <span>Contact</span>
          <span>{portfolio.location}</span>
        </Reveal>
        <div className="contact-body">
          <Reveal staggerIndex={1} duration={700}>
            <h2 id="contact-title">Let’s make the complex feel clear.</h2>
          </Reveal>
          <div className="contact-actions">
            <Reveal className="contact-copy-reveal" staggerIndex={2} duration={700}>
              <p>I’m interested in AI product, technical product, and product-building roles where clarity matters.</p>
            </Reveal>
            <Reveal staggerIndex={3} duration={700}>
              <a className="contact-email" href="mailto:carlshi617@gmail.com?subject=Hello%20Carl">
                carlshi617@gmail.com <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
            <Reveal staggerIndex={4} duration={700}>
              <ul className="contact-link-list" aria-label="Résumé link">
                <li><a href="/carl-shi-resume.pdf">Download résumé <span aria-hidden="true">↗</span></a></li>
              </ul>
            </Reveal>
          </div>
        </div>
        <Reveal as="footer" className="contact-footer" staggerIndex={5} duration={700}>
          <span>© 2026 Carl Shi</span>
          <a href="#top">Return to top ↑</a>
        </Reveal>
      </div>
    </section>
  );
}
