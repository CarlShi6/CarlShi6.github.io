import { portfolio, type Project } from "./portfolio";

export type WorkEvidenceFocus =
  | "overview"
  | "requirements"
  | "recommendation"
  | "alternatives"
  | "comparison"
  | "replacement"
  | "purchase";

export type WorkEvidence = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  focus?: WorkEvidenceFocus;
};

export type WorkDecision = {
  title: string;
  statement: string;
  body: string;
  summary: {
    constraint: string;
    decision: string;
    result: string;
  };
  evidence: readonly WorkEvidence[];
};

export type WorkSummaryItem = {
  label: string;
  value: string;
};

export type WorkCaseStudyDetail = {
  hero: WorkEvidence;
  thesis: string;
  strategyBody: string;
  strategyEvidence: WorkEvidence;
  systemBody: string;
  systemEvidence: readonly WorkEvidence[];
  scope: string;
  technology: string;
  decisions: readonly WorkDecision[];
  executionBody: string;
  executionSummary: readonly WorkSummaryItem[];
  outcome: string;
  outcomeSignals: readonly string[];
  nextValidation: string;
  validationSignals: readonly string[];
};

export type DogTimelineMoment = {
  phase: string;
  owner: string;
  dog: string;
};

export type DogCapability = {
  title: string;
  body: string;
};

export type DogTechnicalStage = {
  title: string;
  body: string;
  evidence: readonly WorkEvidence[];
};

export type DogCaseStudyDetail = {
  status: string;
  scope: string;
  technology: string;
  openingProblem: string;
  heroConcept: WorkEvidence;
  heroPrototype: WorkEvidence;
  observationBody: string;
  timeline: readonly DogTimelineMoment[];
  observationSummary: readonly WorkSummaryItem[];
  conceptBody: string;
  conceptEvidence: readonly WorkEvidence[];
  capabilities: readonly DogCapability[];
  technicalStatement: string;
  technicalBody: string;
  technicalStages: readonly DogTechnicalStage[];
  technicalSummary: readonly WorkSummaryItem[];
  outcomeBody: string;
  outcomeViews: readonly WorkEvidence[];
  outcomeScenario: WorkEvidence;
  outcomePrototype: WorkEvidence;
  demonstrated: string;
  remainedConcept: string;
  nextValidation: readonly string[];
};

export type WorkProject = Project & {
  workCaseStudy?: WorkCaseStudyDetail;
  dogCaseStudy?: DogCaseStudyDetail;
};

const mediaRoot = "/media/ai-pc-build-advisor";

const aiPcCaseStudy: WorkCaseStudyDetail = {
  hero: {
    id: "build-needs",
    src: `${mediaRoot}/working-build-needs.png`,
    alt: "AI PC Build Advisor workspace showing collected build needs, an estimated total, component status, and the conversational intake panel.",
    caption:
      "Working prototype · Build-needs and recommendation workspace preserving budget, use case, compatibility, and estimated total.",
    width: 1919,
    height: 955,
    focus: "overview",
  },
  thesis:
    "A conversational answer alone is not enough for a high-consideration purchase. Users need a persistent visual workspace where recommendations, constraints, trade-offs, and downstream changes remain visible.",
  strategyBody:
    "The product strategy pairs conversational guidance with a durable decision workspace. Budget, workload, preferences, compatibility, and estimated total stay visible as the recommendation changes, so users can evaluate the build without reconstructing context from a chat transcript.",
  strategyEvidence: {
    id: "strategy-recommendation-review",
    src: `${mediaRoot}/working-recommendation-review.png`,
    alt: "Recommendation workspace showing compatibility review, recommendation rationale, budget state, and the advisor conversation together.",
    caption:
      "Working prototype · Recommendation rationale and compatibility state remain adjacent to the build decision.",
    width: 1919,
    height: 956,
    focus: "recommendation",
  },
  systemBody:
    "Four interface states carry one build context from initial requirements through recommendation, component change, and purchase preparation.",
  systemEvidence: [
    {
      id: "system-requirements",
      src: `${mediaRoot}/working-build-needs.png`,
      alt: "Build-needs panel showing budget, use case, preferences, and conversational intake.",
      caption: "Requirements",
      width: 1919,
      height: 955,
      focus: "requirements",
    },
    {
      id: "system-recommendation",
      src: `${mediaRoot}/working-recommendation-review.png`,
      alt: "Recommendation summary and compatibility review in the persistent build workspace.",
      caption: "Recommendation",
      width: 1919,
      height: 956,
      focus: "recommendation",
    },
    {
      id: "system-alternatives",
      src: `${mediaRoot}/working-alternatives.png`,
      alt: "Part Explorer showing the current CPU and alternative components with prices and workload trade-offs.",
      caption: "Compare and replace",
      width: 1919,
      height: 957,
      focus: "alternatives",
    },
    {
      id: "system-purchase",
      src: `${mediaRoot}/working-purchase-references.png`,
      alt: "Purchase-reference list showing selected components, reference prices, notes, and estimated total.",
      caption: "Purchase readiness",
      width: 1919,
      height: 956,
      focus: "purchase",
    },
  ],
  scope:
    "Conversational intake, recommendation rationale, component comparison, compatibility review, replacement, and purchase preparation",
  technology: "React · TypeScript",
  decisions: [
    {
      title: "Structure the request",
      statement:
        "Begin with the language users already understand, then progressively structure it into build constraints and an explainable recommendation.",
      body:
        "Users start with budget, workloads, preferences, and expected outcomes rather than complete specifications. Conversational intake turns those inputs into visible requirements, then carries them into the recommendation workspace so the proposed build remains traceable without requiring hardware terminology.",
      summary: {
        constraint: "Goals arrive as outcomes and preferences, not a finished parts list.",
        decision: "Keep intake and structured requirements visible beside the recommendation.",
        result: "The build remains traceable to the user’s original intent.",
      },
      evidence: [
        {
          id: "components-workspace",
          src: `${mediaRoot}/working-components-workspace.png`,
          alt: "AI PC Build Advisor components workspace with selected parts and conversational context shown together.",
          caption:
            "Working prototype · Selected components remain connected to the conversational requirements that produced the build.",
          width: 1919,
          height: 955,
          focus: "requirements",
        },
      ],
    },
    {
      title: "Compare and replace at the system level",
      statement:
        "Show the system-level consequence of a component change, not only the difference between two products.",
      body:
        "Recommendation rationale, specifications, compatibility state, alternatives, and estimated total stay close to the selected component. Compare exposes price, workload scores, power draw, and the current baseline; Replace carries the chosen alternative back into the build with compatibility warnings and the resulting total.",
      summary: {
        constraint: "A cheaper or faster part can change compatibility, workload fit, and total cost.",
        decision: "Compare against the current baseline before previewing a replacement.",
        result: "Each swap communicates its whole-build consequence.",
      },
      evidence: [
        {
          id: "comparison",
          src: `${mediaRoot}/working-comparison.png`,
          alt: "Side-by-side CPU comparison showing the current baseline, alternatives, specifications, workload scores, power draw, and total.",
          caption:
            "Working prototype · Side-by-side comparison keeps the current baseline and system-relevant trade-offs visible.",
          width: 1919,
          height: 956,
          focus: "comparison",
        },
        {
          id: "replacement-drawer",
          src: `${mediaRoot}/working-replacement-drawer.png`,
          alt: "Motherboard replacement drawer showing the current selection, compatible alternatives, prices, and selection actions.",
          caption:
            "Working prototype · Replacement options preserve compatibility context, pricing, and the current selection.",
          width: 1919,
          height: 954,
          focus: "replacement",
        },
      ],
    },
    {
      title: "Carry the build into purchase readiness",
      statement:
        "Treat purchase preparation as part of the product experience rather than the point where the recommendation ends.",
      body:
        "Compatibility review and estimated budget change with the selected components before the build becomes a purchase-reference list. Parts, retailer references, notes, prices, and the resulting total remain together so users can prepare a shopping path and check readiness without reconstructing the recommendation elsewhere.",
      summary: {
        constraint: "Advice loses value when users must rebuild the plan before shopping.",
        decision: "Carry the selected build and estimated total into purchase preparation.",
        result: "The final state becomes a usable purchase reference.",
      },
      evidence: [
        {
          id: "purchase-references",
          src: `${mediaRoot}/working-purchase-references.png`,
          alt: "Purchase reference list showing the selected PC components, retailer references, notes, prices, and estimated total.",
          caption:
            "Working prototype · Purchase-reference flow carrying the selected build and estimated total into preparation.",
          width: 1919,
          height: 956,
          focus: "purchase",
        },
      ],
    },
  ],
  executionBody:
    "The React and TypeScript prototype uses one shared build context across intake, recommendation, compatibility review, comparison, replacement, and purchase preparation. This keeps component-level actions tied to the state of the complete build.",
  executionSummary: [
    {
      label: "Structured AI response",
      value: "Turns budget, workloads, preferences, and outcomes into visible build requirements.",
    },
    {
      label: "Shared build context",
      value: "Keeps recommendation, selected parts, compatibility, and estimated total in one workspace.",
    },
    {
      label: "Compatibility and replacement logic",
      value: "Carries comparison and replacement effects back into compatibility and the build total.",
    },
    {
      label: "Purchase-reference output",
      value: "Moves selected parts, references, prices, and total into purchase preparation.",
    },
  ],
  outcome:
    "The core journey is connected end to end—from an ambiguous PC goal to a compatible, purchase-ready build.",
  outcomeSignals: ["Working UI", "Connected flow", "Deployable build"],
  nextValidation:
    "Test whether users understand recommendation rationale, interpret the impact of Compare and Replace, and reach purchase preparation without losing context.",
  validationSignals: ["Rationale comprehension", "Trade-off understanding", "Task completion"],
};

const dogMediaRoot = "/media/dog-behavior-camera/case-study";

const dogCaseStudy: DogCaseStudyDetail = {
  status: "Technical prototype + concept enclosure · 2025",
  scope: "Observation framing, modular product concept, visual-detection prototype, and servo response",
  technology: "Raspberry Pi · Camera · Python / OpenCV · GPIO 18 · MG995 servo",
  openingProblem:
    "A passive camera can show owners what is happening while they are away, but it does not create a way to respond. This project explored how visual detection and a physical output could form a more responsive remote-care concept.",
  heroConcept: {
    id: "dog-facing-concept",
    src: `${dogMediaRoot}/concept-dog-facing.png`,
    alt: "Rendered dog-facing enclosure with a display and interaction arm in a home environment.",
    caption: "Concept render · Dog-facing enclosure scenario.",
    width: 1020,
    height: 1800,
  },
  heroPrototype: {
    id: "camera-hardware-prototype",
    src: `${dogMediaRoot}/prototype-camera-hardware.png`,
    alt: "Raspberry Pi camera hardware with cooling, storage, HDMI, and power connections.",
    caption: "Technical prototype · Raspberry Pi and camera input.",
    width: 660,
    height: 985,
  },
  observationBody:
    "One recorded day showed a changing rhythm: a shared morning routine, long periods apart while the owner commuted and worked, and different return-home attention states. This observation framed a design opportunity; it is not presented as universal behavioral research.",
  timeline: [
    { phase: "Morning", owner: "Walk and breakfast", dog: "Shared routine" },
    { phase: "Away", owner: "Commute and work", dog: "Home alone, playing, or waiting" },
    { phase: "Return", owner: "Tired or energetic", dog: "Excited approach; attention varies" },
  ],
  observationSummary: [
    { label: "Observation", value: "Interaction changed with routine, attention, and the dog’s current activity." },
    { label: "Product implication", value: "A passive feed reveals activity but does not create a response path." },
    { label: "Resulting direction", value: "Connect remote observation to communication and physical interaction." },
  ],
  conceptBody:
    "The concept organized the opportunity into three connected capabilities. Camera and display support remote presence; food and toy studies explore physical response. The sketches describe a system direction, not a claim that every module was completed inside one functional enclosure.",
  conceptEvidence: [
    {
      id: "camera-display-sketch",
      src: `${dogMediaRoot}/concept-camera-display-sketch.png`,
      alt: "Product sketch combining camera, display, speaker, and microphone.",
      caption: "Concept sketch · Camera, display, and two-way communication.",
      width: 820,
      height: 750,
    },
    {
      id: "food-module-sketch",
      src: `${dogMediaRoot}/concept-food-module-sketch.png`,
      alt: "Product sketch of a food storage and dispensing module.",
      caption: "Concept sketch · Treat or food interaction.",
      width: 700,
      height: 710,
    },
    {
      id: "toy-arm-sketch",
      src: `${dogMediaRoot}/concept-toy-arm-sketch.png`,
      alt: "Product sketch of a replaceable toy arm and pulley mechanism.",
      caption: "Concept sketch · Physical toy response.",
      width: 820,
      height: 700,
    },
    {
      id: "exploded-assembly",
      src: `${dogMediaRoot}/concept-exploded-assembly.png`,
      alt: "Exploded concept assembly showing enclosure, wheels, rotating arm, camera holder, and food plate.",
      caption: "Concept assembly · Modules composed around one enclosure.",
      width: 1600,
      height: 910,
    },
  ],
  capabilities: [
    { title: "Observe", body: "Camera input and a remote view establish awareness of the dog’s current activity." },
    { title: "Communicate", body: "Display, speaker, and microphone sketches extend monitoring toward two-way presence." },
    { title: "Respond", body: "Food and toy modules explore how a detected state could lead to a physical interaction." },
  ],
  technicalStatement:
    "Connect visual detection to a physical response rather than stopping at remote observation.",
  technicalBody:
    "The functional evidence was developed as connected bench prototypes: camera input and visual detection on Raspberry Pi, followed by Python logic that could trigger a servo through GPIO and external power.",
  technicalStages: [
    {
      title: "See",
      body: "A camera feeds the Raspberry Pi so the prototype can capture the dog’s position and movement.",
      evidence: [
        {
          id: "technical-camera-input",
          src: `${dogMediaRoot}/prototype-camera-hardware.png`,
          alt: "Raspberry Pi and camera hardware used for the visual-detection prototype.",
          caption: "Technical prototype · Camera input and Raspberry Pi hardware.",
          width: 660,
          height: 985,
        },
      ],
    },
    {
      title: "Interpret",
      body: "Python and OpenCV produce bounding-box, pose, and motion-state output from the camera feed.",
      evidence: [
        {
          id: "technical-detection-output",
          src: `${dogMediaRoot}/detection-output.png`,
          alt: "Two detection frames showing a dog inside a bounding box with pose lines and detected motion state.",
          caption: "Detection output · Bounding box, pose lines, and motion state.",
          width: 915,
          height: 1560,
        },
      ],
    },
    {
      title: "Respond",
      body: "GPIO 18 sends the control signal while a separate 5V supply powers the MG995 servo response.",
      evidence: [
        {
          id: "technical-servo-bench",
          src: `${dogMediaRoot}/prototype-servo-hardware.png`,
          alt: "Bench prototype with Raspberry Pi, MG995 servo motor, wiring, and external power.",
          caption: "Technical prototype · Servo response on the bench.",
          width: 710,
          height: 550,
        },
        {
          id: "technical-servo-wiring",
          src: `${dogMediaRoot}/prototype-servo-wiring.png`,
          alt: "Connection diagram showing Raspberry Pi GPIO 18, servo motor, shared ground, and external 5V power.",
          caption: "Technical prototype · GPIO 18 and external-power connection.",
          width: 880,
          height: 670,
        },
      ],
    },
  ],
  technicalSummary: [
    { label: "Constraint", value: "Remote viewing alone could not demonstrate a responsive physical interaction." },
    { label: "Decision", value: "Connect detected camera state to a separately powered servo through GPIO 18." },
    { label: "Result", value: "The bench prototype demonstrated the detection-to-servo system path." },
  ],
  outcomeBody:
    "The project reached two distinct outcomes: a functional technical path from camera input to servo response, and a rendered enclosure concept showing how observation, communication, food, and play could share one product language.",
  outcomeViews: [
    {
      id: "concept-front-view",
      src: `${dogMediaRoot}/concept-four-view-front.png`,
      alt: "Front-view render of the dog-facing enclosure.",
      caption: "Concept render · Front",
      width: 740,
      height: 700,
    },
    {
      id: "concept-side-view",
      src: `${dogMediaRoot}/concept-four-view-side.png`,
      alt: "Side-view render showing the enclosure interaction arm and tray.",
      caption: "Concept render · Side",
      width: 730,
      height: 700,
    },
    {
      id: "concept-top-view",
      src: `${dogMediaRoot}/concept-four-view-top.png`,
      alt: "Top-view render showing the enclosure footprint and interaction surfaces.",
      caption: "Concept render · Top",
      width: 740,
      height: 730,
    },
    {
      id: "concept-rear-view",
      src: `${dogMediaRoot}/concept-four-view-back.png`,
      alt: "Rear-view render showing the power-module and arm details.",
      caption: "Concept render · Rear",
      width: 730,
      height: 730,
    },
  ],
  outcomeScenario: {
    id: "outcome-dog-facing-concept",
    src: `${dogMediaRoot}/concept-dog-facing.png`,
    alt: "Rendered dog-facing enclosure scenario in a home environment.",
    caption: "Concept render · Dog-facing product scenario.",
    width: 1020,
    height: 1800,
  },
  outcomePrototype: {
    id: "outcome-servo-prototype",
    src: `${dogMediaRoot}/prototype-servo-hardware.png`,
    alt: "Raspberry Pi and servo bench prototype used to demonstrate a physical response.",
    caption: "Technical prototype · Detection-to-servo response path.",
    width: 710,
    height: 550,
  },
  demonstrated:
    "Camera-based visual detection and a GPIO-controlled servo response were demonstrated as connected technical prototypes.",
  remainedConcept:
    "The finished enclosure, integrated display, food module, and combined dog-facing experience remained a rendered product concept.",
  nextValidation: [
    "Detection reliability across lighting conditions and dog positions",
    "Whether the physical response is understandable and engaging to the dog",
    "Safety and durability of the interaction mechanism",
    "Whether remote owners can understand system state and intervene clearly",
  ],
};

export const workProjects: readonly WorkProject[] = portfolio.projects.map((project, index) =>
  index === 0
    ? { ...project, workCaseStudy: aiPcCaseStudy }
    : index === 1
      ? { ...project, dogCaseStudy }
      : project,
);
