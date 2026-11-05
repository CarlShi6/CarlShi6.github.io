// Fail closed: a new page is development-only until explicitly listed here.
export const productionRoutes = [
  '/', '/homepage-poc', '/homepage-poc/projects',
  '/homepage-poc/projects/case-studies', '/homepage-poc/skills', '/homepage-poc/about',
  // Existing bookmarks resolve to the approved portfolio, never a prototype.
  '/work', '/homepage-poc/systems', '/homepage-poc/education',
  '/motion-study', '/motion-study-v2', '/motion-study-v4', '/motion-study-v5',
];
export const productionExtension = 'portfolio-release.tsx';
export const generatedMarker = '// Generated portfolio release entry; do not edit.\n';
// Runtime-composed URLs cannot always be found as full literals in a bundle.
// Keep these small, reviewed families; never allow all of public/ by default.
export const dynamicAssetPrefixes = [
  '/media/skill-objects/', // Skills artwork selected by category name.
];
export const dynamicAssets = [
  // Reference renderer joins '/homepage-poc/' to these texture names.
  '/homepage-poc/dark-reference-flow/flow-fine-v2.png',
  '/homepage-poc/dark-reference-flow/planet.png',
  '/homepage-poc/dark-reference-flow/moon.png',
  '/homepage-poc/motion-e4/mineral-fragments.png',
  // Scanner chooses a technology illustration by numeric category.
  ...[1,2,3,4].map(n=>`/homepage-poc/webgl-v4/skill-${n}.webp`),
];
export const requiredAssets = ['/.nojekyll', '/favicon.svg', '/carl-shi-resume.pdf'];
