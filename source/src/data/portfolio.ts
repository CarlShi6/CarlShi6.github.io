export type PortfolioLink = {
  label: string;
  href: string;
};

export type CaseStudyMedia = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type CaseStudyDetail = {
  media?: readonly CaseStudyMedia[];
  productThesis?: string;
  constraints?: readonly string[];
  decisions?: readonly { title: string; statement: string; body: string }[];
  technicalExecution?: string;
  outcome?: string;
  knownLimitations?: string;
  nextStep?: string;
};

export type Project = {
  number: string;
  slug: string;
  navLabel: string;
  title: string;
  category: string;
  summary: string;
  status: string;
  problem: string;
  role: string;
  contribution: string;
  tags: string[];
  image: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  imageLabel: string;
  reversed?: boolean;
  caseStudy?: CaseStudyDetail;
};

export const portfolio = {
  name: "Carl Shi",
  initials: "CS",
  role: "Technical Product · Technical Program · AI Product",
  availability: "Open to AI Product, Technical Product, and Program Management opportunities",
  location: "Los Angeles, California",
  hero: {
    headline: "Building AI products that turn complex systems into clear decisions.",
    supporting:
      "I’m Carl Shi, a computer science-trained product builder focused on AI products, technical systems, and practical user experiences.",
  },
  about: {
    heading:
      "I connect technical possibility with the decisions people actually need to make.",
    paragraphs: [
      "My work sits between product strategy, technical systems, and user experience. I’m most useful when the technology is complex, the product direction is still forming, and the team needs a clear path from capability to value.",
      "I studied Computer Science at NYU and I’m pursuing an MS in Integrated Design, Business and Technology at USC—an education that keeps my approach technically grounded, commercially aware, and attentive to the people using the product.",
      "My experience includes a five-day Build Hope client engagement through USC Iovine and Young Academy, an Assistant Software Engineer Internship at Xfanatical (June–September 2025), and independent product prototyping. At Xfanatical, I contributed frontend and backend functionality to an internal employee-management application using Vue 3, JavaScript, Python, MongoDB, and REST APIs. I implemented profile and leave-management workflows, traced employee-profile display errors to data transformation and empty-field handling, verified API behavior with Postman and mock data, and merged reviewed changes while coordinating dependencies, changing requirements, and PR review cycles. I shared updated delivery estimates and blockers in daily engineering check-ins.",
    ],
  },
  facts: [
    { label: "Foundation", value: "B.S. Computer Science; Minor in Integrated Media Design · NYU, 05/2026" },
    { label: "Product focus", value: "AI products and decision-support systems" },
    { label: "Technical practice", value: "Python, JavaScript, Vue 3, REST APIs, MongoDB and computer vision prototypes" },
    { label: "Graduate study", value: "M.S. Integrated Design, Business and Technology · USC, expected 05/2028" },
  ],
  links: [
    { label: "carlshi617@gmail.com", href: "mailto:carlshi617@gmail.com?subject=Hello%20Carl" },
  ] satisfies PortfolioLink[],
  projects: [
    {
      number: "01",
      slug: "ai-pc-build-advisor",
      navLabel: "PC Advisor",
      title: "AI PC Build Advisor",
      category: "AI product · Decision support",
      summary: "Defined and tested an AI-assisted PC-building prototype through five user interviews, three prototype tests, and 37 merged pull requests.",
      status: "Paused prototype · Summer 2026",
      problem:
        "PC shoppers must balance performance goals, budgets, prices, and compatibility constraints. The prototype turns these inputs into recommendations and a parts list for purchase planning.",
      role: "Technical Product Lead · AI-Assisted Prototype",
      contribution:
        "Interviewed five prospective users, defined MVP priorities, directed AI-generated React/TypeScript implementation, reviewed code, and manually tested core flows. Iterated across 37 merged PRs from June–August 2026 and tested the prototype with three users.",
      tags: ["MVP scoping", "AI-assisted implementation", "Comparison", "Compatibility logic"],
      image: "/media/ai-pc-build-advisor/primary-cart-execution.png",
      imageAlt:
        "AI PC Build Advisor cart execution screen with selected components, purchase list, compatibility checklist, and employee summary.",
      imageFit: "contain",
      imageLabel: "Prototype screen",
      caseStudy: {
        productThesis:
          "A conversational answer alone is not enough for a high-consideration purchase. Users need a persistent visual workspace where recommendations, constraints, trade-offs, and downstream changes remain visible.",
        decisions: [
          {
            title: "Turn ambiguous goals into structured requirements",
            statement:
              "Begin with the language users already understand, then progressively structure it into build constraints.",
            body:
              "Users begin with budget, workloads, preferences, and expected outcomes rather than complete component specifications.",
          },
          {
            title: "Explain why each component belongs in the build",
            statement:
              "Present recommendation rationale beside the product decision instead of hiding it inside a chat transcript.",
            body:
              "The workspace connects recommendation rationale, the selected component, an available alternative, important specifications, compatibility state, and estimated total.",
          },
          {
            title: "Make Compare and Replace core actions",
            statement:
              "Show the system-level consequence of a component change, not only the difference between two products.",
            body:
              "Component changes communicate their impact on price, performance, value, workload fit, compatibility, rationale, and the resulting build total.",
          },
          {
            title: "Close the gap between advice and action",
            statement:
              "Treat purchase preparation as part of the product experience rather than the point where the recommendation ends.",
            body:
              "The recommendation connects to the shopping list, purchase references, compatibility review, estimated total, and purchase-readiness checklist.",
          },
        ],
        technicalExecution:
          "I directed AI-assisted React/TypeScript implementation, reviewed generated code, and manually tested guided intake, comparison of up to three components, compatibility warnings, replacement, and recalculated totals. The repository records 37 merged PRs—16 in June, 17 in July, and 4 in August 2026—not a claim that I handwrote the full codebase.",
        outcome:
          "A functional prototype and a research finding: three testers liked receiving a complete configuration quickly but questioned why certain components were recommended. Explanation clarity and trust remain priorities; no production launch, conversion gain, or validated resolution of that trust gap is claimed.",
        knownLimitations:
          "The project is paused and was not publicly deployed. Retailer integrations were deferred; the chatbot explains components but is not a mature real-time price-value decision engine.",
        nextStep:
          "Use the three-user test finding to improve recommendation explanations, then retest understanding, trust, and component trade-offs. Those follow-up improvements have not been independently validated.",
        media: [
          {
            src: "/media/ai-pc-build-advisor/secondary-compatibility-detail.png",
            alt: "AI PC Build Advisor recommendation detail showing selected components, an in-stock alternative, compatibility status, and estimated total.",
            caption: "Working prototype · Recommendation state showing compatibility, inventory alternatives, and estimated build total.",
            width: 780,
            height: 220,
          },
          {
            src: "/media/ai-pc-build-advisor/primary-cart-execution.png",
            alt: "AI PC Build Advisor cart execution screen with selected components, purchase list, compatibility checklist, and build summary.",
            caption: "Working prototype · Cart execution and purchase-readiness checklist.",
            width: 998,
            height: 769,
          },
        ],
      },
    },
    {
      number: "02",
      slug: "dog-behavior-camera",
      navLabel: "Dog Camera",
      title: "Dog Behavior Camera",
      category: "Computer vision · Consumer IoT",
      summary: "Built a Raspberry Pi dog-monitoring prototype with Python, OpenCV, and YOLO, progressing from image checks to live-dog trials with visualization and calibration.",
      status: "Functional prototype · Summer 2025",
      problem:
        "Frame-to-frame behavior signals can fluctuate, making it difficult to decide when a camera-based system should trigger a physical response. Remote monitoring and the complete companion enclosure remained concepts.",
      role: "Independent computer vision & IoT project",
      contribution:
        "Built a camera-to-actuation prototype with Raspberry Pi, Python, OpenCV, and YOLO. Added visual overlays, tested with a real dog, and calibrated thresholds, weighting, and temporal buffering. No reliable final accuracy or precision metrics were recorded.",
      tags: ["Computer vision", "Raspberry Pi", "Consumer IoT", "Physical prototyping"],
      image: "/media/dog-behavior-camera/primary-portfolio-overview.png",
      imageAlt:
        "Dog Behavior Camera portfolio overview showing the physical companion-device concept and project framing.",
      imageLabel: "Portfolio source material",
      reversed: true,
    },
    {
      number: "03",
      slug: "luggage-helper",
      navLabel: "Luggage",
      title: "Luggage Helper",
      category: "AI product · Mobile experience",
      summary: "An AI-assisted mobile packing workflow for understanding weight limits, item rules, and trip readiness.",
      status: "Tested mobile prototype · Summer 2025",
      problem:
        "Baggage weight limits and item rules change across airlines and destinations. Luggage Helper combines trip context, weight tracking, and AI-assisted item analysis so travelers can make packing decisions earlier.",
      role: "Product design · Prototype development",
      contribution:
        "Mapped the travel journey, defined image and text intake flows, built the trip and item-management logic, and tested the Add Item → Analysis → Add / Discard experience on mobile.",
      tags: ["AI item analysis", "Mobile UX", "User research", "Usability testing"],
      image: "/media/luggage-helper/primary-app-showcase.png",
      imageAlt:
        "Luggage Helper app showcase with trip setup, item analysis, packing checklist, and mobile usability testing.",
      imageLabel: "Real prototype screens",
    },
  ] satisfies Project[],
  capabilities: [
    {
      title: "AI Product Strategy",
      description:
        "Shape ambiguous AI opportunities into a focused problem, value proposition, and responsible product direction.",
    },
    {
      title: "Technical Product Thinking",
      description:
        "Work across models, APIs, data, constraints, and system behavior without losing sight of the user decision.",
    },
    {
      title: "User Experience & Prototyping",
      description:
        "Make complex product logic tangible through clear flows, interaction models, and testable prototypes.",
    },
    {
      title: "Product Execution",
      description:
        "Move from definition to working software by making tradeoffs visible and keeping teams aligned on outcomes.",
    },
    {
      title: "Cross-functional Communication",
      description:
        "Translate between technical, design, and business perspectives so decisions remain legible to everyone involved.",
    },
    {
      title: "Data-informed Decisions",
      description:
        "Use evidence, constraints, and learning goals to prioritize what to build, validate, and refine next.",
    },
  ],
} as const;
