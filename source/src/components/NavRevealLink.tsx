import Link from "next/link";
import type { ReactNode } from "react";

type NavRevealLinkProps = {
  href: string;
  label: string;
  accessibleLabel?: string;
  active?: boolean;
  trailingIcon?: ReactNode;
  leadingContent?: ReactNode;
  className?: string;
  labelClassName?: string;
};

export function NavRevealLink({
  href,
  label,
  accessibleLabel = label,
  active = false,
  trailingIcon,
  leadingContent,
  className = "",
  labelClassName = "",
}: NavRevealLinkProps) {
  const linkClassName = `nav-reveal-link${active ? " is-active" : ""}${className ? ` ${className}` : ""}`;
  const labelViewportClassName = `nav-reveal-link__viewport${labelClassName ? ` ${labelClassName}` : ""}`;
  const content = (
    <>
      {leadingContent}
      <span className={labelViewportClassName} aria-hidden="true">
        <span className="nav-reveal-link__track">
          <span className="nav-reveal-link__face">
            <span>{label}</span>
            {trailingIcon ? <span className="nav-reveal-link__icon">{trailingIcon}</span> : null}
          </span>
          <span className="nav-reveal-link__face nav-reveal-link__face--next">
            <span>{label}</span>
            {trailingIcon ? <span className="nav-reveal-link__icon">{trailingIcon}</span> : null}
          </span>
        </span>
      </span>
    </>
  );

  const sharedProps = {
    className: linkClassName,
    "aria-label": accessibleLabel,
    "aria-current": active ? ("location" as const) : undefined,
  };

  return href.startsWith("#") ? (
    <a href={href} {...sharedProps}>{content}</a>
  ) : (
    <Link href={href} {...sharedProps}>{content}</Link>
  );
}
