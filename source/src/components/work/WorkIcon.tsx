export type WorkIconName =
  | "role"
  | "scope"
  | "technology"
  | "research"
  | "prototype"
  | "outcome"
  | "conversation"
  | "requirements"
  | "recommendation"
  | "compare"
  | "readiness"
  | "constraint"
  | "decision"
  | "result"
  | "shipped"
  | "deferred"
  | "validation";

const paths: Record<WorkIconName, React.ReactNode> = {
  role: <><circle cx="12" cy="7" r="3" /><path d="M5.5 20c.6-4 2.8-6 6.5-6s5.9 2 6.5 6" /></>,
  scope: <><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /><circle cx="12" cy="12" r="2.5" /></>,
  technology: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></>,
  research: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 5 5" /></>,
  prototype: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9" /></>,
  outcome: <><path d="M5 21V4M5 5h11l-2 3 2 3H5" /><path d="m9 16 2 2 4-5" /></>,
  conversation: <><path d="M5 5h14v10H9l-4 4V5Z" /><path d="M9 9h6M9 12h4" /></>,
  requirements: <><path d="M5 7h4M15 7h4M5 12h8M17 12h2M5 17h2M11 17h8" /><circle cx="12" cy="7" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="9" cy="17" r="2" /></>,
  recommendation: <><path d="M5 5h6v6H5zM13 13h6v6h-6z" /><path d="m17 4 .7 1.8L20 6.5l-2.3.7L17 9l-.7-1.8L14 6.5l2.3-.7L17 4ZM7 14v5h4" /></>,
  compare: <><path d="M4 8h14M15 5l3 3-3 3M20 16H6M9 13l-3 3 3 3" /></>,
  readiness: <><path d="M7 4h10v17H7zM9.5 4V2.5h5V4" /><path d="m10 10 1.5 1.5L15 8M10 16h5" /></>,
  constraint: <><path d="M12 3 3.5 19h17L12 3Z" /><path d="M12 9v4M12 16.5v.5" /></>,
  decision: <><path d="M5 5h14v14H5z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
  result: <><path d="M4 12h12M13 8l4 4-4 4" /><path d="M20 5v14" /></>,
  shipped: <><path d="M4 7h16v12H4zM8 7V4h8v3" /><path d="m9 13 2 2 4-4" /></>,
  deferred: <><circle cx="12" cy="12" r="8" /><path d="M12 8v5l3 2" /></>,
  validation: <><path d="M5 5h14v14H5zM8 9h8M8 13h5" /><path d="m14.5 16 1.5 1.5 3-3" /></>,
};

export function WorkIcon({ name, size = 16 }: { name: WorkIconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="work-icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        {paths[name]}
      </g>
    </svg>
  );
}
