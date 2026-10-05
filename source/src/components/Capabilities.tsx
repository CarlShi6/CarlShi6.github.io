import { portfolio } from "@/src/data/portfolio";
import { CapabilityCard } from "./CapabilityCard";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function Capabilities() {
  return (
    <section className="section capabilities" id="capabilities" aria-labelledby="capabilities-title">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Working strengths / 03"
            title="A hybrid practice for complex product problems."
            description="The connective work between product intent, technical reality, and the experience people ultimately use."
            headingId="capabilities-title"
          />
        </Reveal>
        <div className="capability-grid">
          {portfolio.capabilities.map((capability, index) => (
            <Reveal
              className="capability-card-reveal"
              key={capability.title}
              staggerIndex={index}
              stagger={65}
            >
              <CapabilityCard
                number={`0${index + 1}`}
                title={capability.title}
                description={capability.description}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
