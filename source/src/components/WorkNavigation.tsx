import Link from "next/link";

export function WorkNavigation() {
  return (
    <header className="site-header work-site-header">
      <div className="container work-nav-shell">
        <Link className="back-home" href="/">
          <span aria-hidden="true">←</span>
          <span>Back Home</span>
        </Link>
        <p className="work-nav-label">Selected work / Carl Shi</p>
      </div>
    </header>
  );
}
