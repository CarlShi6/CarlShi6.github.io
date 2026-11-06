/** November 2026 case-study PDF supplied by Carl. Images are embedded originals,
 * not generated reconstructions. Evaluation figures below are single-photo results. */
export const aiPcPreview = {
  title: 'AI PC Build Advisor',
  summary: 'Turn a PC photo into an editable 3D build, with user-confirmed parts and a sourced shopping plan.',
  detail: 'Photo-based drafts · 3D editing · User confirmation · Sourced shopping plans',
  image: '/media/ai-pc-build-advisor/v3/studio-overview.jpg',
  role: 'Product owner · Solo, directing AI-assisted development',
  deliverable: 'Local beta: 3D Studio, part swaps, and shopping-plan export.',
};

export const aiPcTour = [
  { image: '/media/ai-pc-build-advisor/v3/photo-entry.jpg', title: 'Start with a photo.', description: 'Upload the PC that inspired you. Describe, import and manual starts remain available when photo analysis is not the right starting point.' },
  { image: '/media/ai-pc-build-advisor/v3/exploded-build.jpg', title: 'Explore the build in 3D.', description: 'Open the case and separate the parts to understand their positions. This is an illustrative model with estimated proportions, not a dimensionally exact reconstruction.' },
  { image: '/media/ai-pc-build-advisor/v3/inspect-and-swap.jpg', title: 'Inspect a part. Make the choice.', description: 'Focus on a component, review candidate replacements and their price sources, and choose what belongs in the build. A visual look-alike is not a confirmed model.' },
  { image: '/media/ai-pc-build-advisor/v3/shopping-plan.jpg', title: 'Leave with a plan you can check.', description: 'Review the known subtotal, unresolved parts and compatibility checks. Save the build or export a shopping plan as Markdown or JSON; this is not retailer checkout.' },
];

export const aiPcCase = {
  slug: 'ai-pc-build-advisor',
  navLabel: 'AIPC',
  title: 'AIPC — From photo to editable 3D build',
  category: 'AI product · Image-to-build · Local beta',
  intro: 'Start with a PC photo, explore an editable 3D draft, and choose parts for a shopping plan with visible sources and unknowns.',
  problem: 'A photo captures a look, but cannot prove every component inside the case. The product needs to turn visual inspiration into useful choices without treating guesses as confirmed parts.',
  facts: [
    ['Role', 'Product owner & builder · Solo, directing an AI coding agent'],
    ['Timeline', 'Oct–Nov 2026 · v3 image-to-build rebuild'],
    ['Status', 'Local beta · Not publicly launched'],
    ['Focus', 'Photo interpretation · 3D editing · Decision transparency'],
  ],
  system: [],
  heroImage: aiPcPreview.image,
  heroAlt: 'AIPC local beta showcase sample: labeled components in the editable 3D Build Studio',
  images: aiPcTour.map(item => [item.image, item.title, item.description]),
  outcome: 'The local beta connects photo-based drafts, user-confirmed parts, 3D editing and shopping-plan export. Public beta testing and broader evaluation are next; adoption and recognition accuracy at scale are not yet established.',
};
