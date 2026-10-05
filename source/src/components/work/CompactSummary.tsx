import { WorkIcon, type WorkIconName } from "./WorkIcon";

export type CompactSummaryItem = {
  label: string;
  value: string;
  icon: WorkIconName;
};

export function CompactSummary({
  items,
  label,
}: {
  items: readonly CompactSummaryItem[];
  label: string;
}) {
  return (
    <dl className="compact-summary" aria-label={label}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>
            <WorkIcon name={item.icon} size={17} />
            {item.label}
          </dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
