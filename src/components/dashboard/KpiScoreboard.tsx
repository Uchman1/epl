import type { ReactNode } from 'react';

export interface ScoreboardItem {
  label: string;
  value: ReactNode;
  sub?: string;
}

export function KpiScoreboard({ items }: { items: ScoreboardItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl bg-ink shadow-md">
      <div className="scroll-thin flex divide-x divide-ink-line overflow-x-auto">
        {items.map((item, i) => (
          <div key={i} className="min-w-[140px] flex-1 px-4 py-3.5 sm:min-w-0">
            <p className="truncate font-mono text-[10px] uppercase tracking-[0.15em] text-steel-soft">
              {item.label}
            </p>
            <p className="tnum mt-1 truncate font-mono text-xl font-semibold text-amber sm:text-2xl">
              {item.value}
            </p>
            {item.sub && (
              <p className="mt-0.5 truncate text-[11px] text-steel-soft">{item.sub}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
