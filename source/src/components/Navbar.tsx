import { portfolio } from "@/src/data/portfolio";
import { NavRevealLink } from "./NavRevealLink";

export function Navbar() {
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <NavRevealLink
          className="wordmark"
          href="#top"
          label={portfolio.name}
          labelClassName="wordmark-name"
          accessibleLabel={`${portfolio.name}, home`}
          leadingContent={(
            <span className="wordmark-mark" aria-hidden="true">{portfolio.initials}</span>
          )}
        />
        <nav className="primary-nav" aria-label="Primary navigation">
          <NavRevealLink href="#work" label="Selected work" />
        </nav>
        <NavRevealLink
          className="nav-contact"
          href="#contact"
          label="Contact"
          trailingIcon="↗"
        />
      </div>
    </header>
  );
}
