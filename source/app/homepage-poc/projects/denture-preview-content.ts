export const dentureMedia = {
  video: '/media/denture-preview/denture-preview.mp4',
  poster: '/media/denture-preview/denture-preview-poster.jpg',
  captions: '/media/denture-preview/denture-preview.en.vtt',
} as const;

export const denturePreviewCase = {
  slug: 'denture-preview',
  navLabel: 'Denture Preview',
  title: 'Denture Preview',
  category: 'Product design and prototyping · Browser-based 3D prototype',
  intro: 'Editing a surface finish, one decision at a time.',
  problem: 'A dentist has reviewed a returned denture design. The base shape looks right, but the outer gum surface could use a little texture. I designed and built a preview where the dentist can try that finish, judge it against the draft they already like, and decide whether to keep it.',
  facts: [
    ['Role', 'Product design · Prototyping'],
    ['Focus', 'Compare, adopt, re-edit, and withdraw a surface adjustment'],
    ['Evidence', 'Local prototype checks · Original synthetic-model walkthrough'],
  ],
  system: [],
  outcome: 'A browser-based editing prototype. Clinical suitability and printed texture remain open questions.',
  heroImage: dentureMedia.poster,
  heroAlt: 'Denture Preview walkthrough using an original synthetic 3D denture model',
  images: [],
} as const;

export const denturePreviewSummary = 'A reversible 3D editing workflow: adjust a surface finish, compare it with the current draft, then adopt, refine, or withdraw the change.';
