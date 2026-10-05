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
      "My experience includes a five-day Build Hope client engagement through USC Iovine and Young Academy, frontend and backend feature work at Xfanatical, and independent product prototyping.",
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
      summary: "An explainable recommendation experience for turning PC goals and constraints into a compatible build.",
      status: "Paused prototype · Summer 2026",
      problem:
        "PC shoppers must balance performance goals, budgets, prices, and compatibility constraints. The prototype turns these inputs into recommendations and a parts list for purchase planning.",
      role: "Technical Product Lead · AI-assisted prototype",
      contribution:
        "Conducted 3–5 interviews and competitor research, defined MVP scope, directed AI-assisted React/TypeScript implementation, reviewed generated code, and tested incompatible builds and replacement flows.",
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
          "I directed AI-assisted implementation of a React and TypeScript prototype, reviewed generated code, and tested guided intake, component comparison, compatibility checks, part replacement, and the updated build total.",
        outcome:
          "A connected working prototype carries the flow from conversational intake through recommendations, comparison, compatibility review, replacement, shopping-list preparation, and purchase references. No user adoption, business impact, or effectiveness metrics are claimed.",
        knownLimitations:
          "The project is paused and was not publicly deployed. Retailer integrations were deferred; the chatbot explains components but is not a mature real-time price-value decision engine.",
        nextStep:
          "The next validation pass will examine whether users can understand why a component was recommended, interpret the system-level impact of Compare and Replace, and move from a recommendation to purchase preparation without losing context. This is a future validation objective, not completed research.",
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
      summary: "An independent Raspberry Pi prototype showing dog detection and basic behavioral-state feedback on screen.",
      status: "Functional prototype · Summer 2025",
      problem:
        "This project explores how dog detection and persistent behavioral-state logic could connect to a physical response. Remote monitoring and the complete companion device remained concepts.",
      role: "Independent computer vision & IoT project",
      contribution:
        "Adapted an existing Python/OpenCV/YOLO framework and labeled dataset, adjusted detection and temporal post-processing, and tested the on-screen feedback with a real dog.",
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
