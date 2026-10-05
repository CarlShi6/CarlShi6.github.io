"use client";

import type { HTMLAttributes, ReactNode } from "react";
import BorderGlow from "./react-bits/BorderGlow";

type GlowCardTone = "default" | "portrait";

type GlowCardProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
  tone?: GlowCardTone;
};

const CARD_BACKGROUNDS: Record<GlowCardTone, string> = {
  default: "var(--ink)",
  portrait: "#141711",
};

export function GlowCard({
  children,
  className = "",
  tone = "default",
  tabIndex = 0,
  ...htmlProps
}: GlowCardProps) {
  return (
    <BorderGlow
      {...htmlProps}
      className={className}
      tabIndex={tabIndex}
      edgeSensitivity={55}
      glowColor="112 22 58"
      backgroundColor={CARD_BACKGROUNDS[tone]}
      borderRadius={4}
      glowRadius={18}
      glowIntensity={0.38}
      coneSpread={18}
      fillOpacity={0.12}
      colors={["#7ea47a", "#aebd78", "#6d7f72"]}
      animated={false}
      data-glow-card
    >
      {children}
    </BorderGlow>
  );
}
