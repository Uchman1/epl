import { Panel } from '@/components/common/Panel';
import { BarChart3 } from 'lucide-react';

export function Analytics() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink dark:text-chalk">
        Analytics
      </h1>
      <Panel>
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <BarChart3 className="h-8 w-8 text-steel-soft" strokeWidth={1.5} />
          <div>
            <p className="font-semibold text-ink dark:text-chalk">Analytics arrives in Phase 3</p>
            <p className="mt-1 max-w-md text-sm text-steel">
              League goals trends, home vs away splits, clean sheet and form rankings, and points
              progression charts will live here once charting is built out on top of the standings
              and fixtures data already in place.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
