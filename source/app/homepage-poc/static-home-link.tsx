import type { ComponentPropsWithoutRef } from 'react';

/** Vinext exports /index.rsc but its root Link prefetch requests /.rsc.
 * A native root navigation works on GitHub Pages without a server rewrite,
 * preserves modifier-click behavior, and tears down the departing scene.
 * Other routes keep their existing client navigation and prefetch behavior.
 */
export function StaticHomeLink(props: Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  // eslint-disable-next-line @next/next/no-html-link-for-pages -- Intentional static-export workaround for the root RSC path mismatch documented above.
  return <a {...props} href="/" />;
}
