import { GlowCard } from "./GlowCard";

export function CapabilityCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <GlowCard
      className="capability-card"
      role="group"
      aria-label={title}
    >
      <article className="capability-card-content">
        <span>{number}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </article>
    </GlowCard>
  );
}
