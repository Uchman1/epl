import { useQueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { useSeasonMeta } from '@/hooks/useSeasonMeta';
import { useTheme } from '@/layouts/ThemeProvider';
import { Panel } from '@/components/common/Panel';
import { isMockData } from '@/services/football';
import { Sun, Moon, Trash2, CheckCircle2 } from 'lucide-react';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { data: season } = useSeasonMeta();
  const queryClient = useQueryClient();
  const [cleared, setCleared] = useState(false);

  function handleClearCache() {
    queryClient.clear();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink dark:text-chalk">
        Settings
      </h1>

      <Panel title="Appearance">
        <div className="flex gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${theme === 'light' ? 'border-pitch bg-pitch-tint text-pitch-deep' : 'border-chalk-line text-steel dark:border-ink-line'}`}
          >
            <Sun className="h-4 w-4" /> Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${theme === 'dark' ? 'border-pitch bg-pitch/15 text-pitch' : 'border-chalk-line text-steel dark:border-ink-line'}`}
          >
            <Moon className="h-4 w-4" /> Dark
          </button>
        </div>
      </Panel>

      <Panel title="Season & Data">
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Row label="Season" value={season?.label ?? '—'} />
          <Row label="Current Matchweek" value={season ? `Matchweek ${season.currentMatchweek} of ${season.totalMatchweeks}` : '—'} />
          <Row
            label="Data Provider"
            value={
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-pitch" />
                {isMockData ? 'Mock (development seed data)' : 'Live API'}
              </span>
            }
          />
          <Row label="Connection Status" value="Connected" />
        </dl>
      </Panel>

      <Panel title="Cache">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearCache}
            className="inline-flex items-center gap-2 rounded-md border border-chalk-line px-3 py-2 text-sm font-medium text-steel hover:text-ink dark:border-ink-line dark:hover:text-chalk"
          >
            <Trash2 className="h-4 w-4" /> Clear cached data
          </button>
          {cleared && <span className="text-sm text-pitch">Cache cleared.</span>}
        </div>
      </Panel>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-chalk-line px-3 py-2 dark:border-ink-line">
      <dt className="text-steel">{label}</dt>
      <dd className="font-medium text-ink dark:text-chalk">{value}</dd>
    </div>
  );
}
