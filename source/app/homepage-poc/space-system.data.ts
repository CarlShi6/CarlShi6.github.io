import { aiPcPreview } from './projects/ai-pc-content';
export type SpaceSystemItem = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  detail: string;
  href: string;
  status: string;
  phase: "mvp" | "planned";
  visual: "planet" | "satellite" | "station" | "ship" | "dyson";
  image?: string;
};

export const projectPlanets: readonly SpaceSystemItem[] = [
  {
    id: "ai-pc-build-advisor",
    title: "AI PC Build Advisor",
    eyebrow: "AI product · Image-to-build · Early access",
    summary: aiPcPreview.summary,
    detail: aiPcPreview.detail,
    href: "/homepage-poc/projects/case-studies#ai-pc-build-advisor",
    status: "Early access",
    phase: "mvp",
    visual: "planet",
    image: aiPcPreview.image,
  },
  {
    id: "dog-behavior-camera",
    title: "Dog Behavior Camera",
    eyebrow: "Computer vision · Consumer IoT",
    summary: "A camera-to-actuation prototype tested and calibrated with a real dog.",
    detail: "OpenCV · YOLO · Raspberry Pi · physical prototyping",
    href: "/homepage-poc/projects/case-studies#dog-behavior-camera",
    status: "Planned expansion",
    phase: "planned",
    visual: "planet",
    image: "/media/dog-behavior-camera/case-study/detection-moving-frame.png",
  },
  {
    id: "ai-travel-assistant",
    title: "AI Travel Assistant",
    eyebrow: "AI product · Mobile experience",
    summary: "Trip-aware packing decisions across weight limits and item rules.",
    detail: "Journey mapping · item analysis · mobile usability",
    href: "/homepage-poc/projects/case-studies#ai-travel-assistant",
    status: "Planned expansion",
    phase: "planned",
    visual: "planet",
    image: "/media/luggage-helper/app-home-screen.png",
  },
  {
    id: "build-hope-content-operations",
    title: "Build Hope",
    eyebrow: "Product strategy · Content operations",
    summary: "A repeatable operating model for turning event media into learning.",
    detail: "Workflow · roadmap · measurement · recommendation logic",
    href: "/homepage-poc/projects/case-studies#build-hope-content-operations",
    status: "Planned expansion",
    phase: "planned",
    visual: "planet",
    image: "/media/build-hope-content-operations/hero-operating-model.webp",
  },
] as const;

export const skillSpacecraft: readonly SpaceSystemItem[] = [
  {
    id: "strategy-satellite",
    title: "Product Strategy",
    eyebrow: "Signal finder · Satellite",
    summary: "Frame ambiguous opportunities, constraints, and evidence into a direction teams can act on.",
    detail: "Opportunity framing · prioritization · roadmaps · decision narratives",
    href: "/homepage-poc/projects#skills",
    status: "MVP interaction",
    phase: "mvp",
    visual: "satellite",
  },
  {
    id: "technical-station",
    title: "Technical Product",
    eyebrow: "System integrator · Space station",
    summary: "Connect models, APIs, data, and system constraints to the user decision.",
    detail: "System behavior · APIs · AI/data · feasibility",
    href: "/homepage-poc/projects#skills",
    status: "Planned expansion",
    phase: "planned",
    visual: "station",
  },
  {
    id: "design-ship",
    title: "Experience Design",
    eyebrow: "Explorer · Spacecraft",
    summary: "Turn complex product logic into understandable flows and testable prototypes.",
    detail: "Interaction models · prototyping · research · visual systems",
    href: "/homepage-poc/projects#skills",
    status: "Planned expansion",
    phase: "planned",
    visual: "ship",
  },
  {
    id: "execution-dyson",
    title: "Product Execution",
    eyebrow: "Energy system · Dyson sphere",
    summary: "Coordinate tradeoffs and delivery so plans become working outcomes.",
    detail: "Cross-functional delivery · scope · sequencing · learning loops",
    href: "/homepage-poc/projects#skills",
    status: "Planned expansion",
    phase: "planned",
    visual: "dyson",
  },
] as const;
