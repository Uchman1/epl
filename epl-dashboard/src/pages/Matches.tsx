import { useMemo, useState } from 'react';
import { useFixtures } from '@/hooks/useFixtures';
import { Panel } from '@/components/common/Panel';
import { Skeleton, ErrorState, EmptyState } from '@/components/common/States';
import { MatchCardRich } from '@/components/matches/MatchCard';
import clsx from 'clsx';

type FilterTab = 'all' | 'results' | 'today' | 'upcoming';

export function Matches() {
  const { data, isLoading, isError, refetch } = useFixtures();
  const [tab, setTab] = useState<FilterTab>('today');
  const [matchweek, setMatchweek] = useState<number | 'all'>('all');

  const maxMatchweek = useMemo(
    () => (data ? Math.max(...data.map((f) => f.matchweek)) : 38),
    [data]
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data;
    if (matchweek !== 'all') list = list.filter((f) => f.matchweek === matchweek);

    if (tab === 'results') {
      list = list.filter((f) => f.status === 'full_time');
    } else if (tab === 'today') {
      const live = data.filter((f) => f.status === 'live' || f.status === 'half_time');
      const ref = live[0]?.date ?? data.find((f) => f.status === 'scheduled')?.date;
      if (ref) {
        const day = new Date(ref).toDateString();
        list = list.filter((f) => new Date(f.date).toDateString() === day);
      } else {
        list = [];
      }
    } else if (tab === 'upcoming') {
      list = list.filter((f) => f.status === 'scheduled');
    }

    return [...list].sort((a, b) => a.date.localeCompare(b.date));
  }, [data, tab, matchweek]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink dark:text-chalk">
          Matches
        </h1>
        <select
          value={matchweek}
          onChange={(e) => setMatchweek(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="rounded-md border border-chalk-line bg-white px-3 py-1.5 text-sm dark:border-ink-line dark:bg-ink-soft dark:text-chalk"
          aria-label="Filter by matchweek"
        >
          <option value="all">All matchweeks</option>
          {Array.from({ length: maxMatchweek }, (_, i) => i + 1).map((mw) => (
            <option key={mw} value={mw}>
              Matchweek {mw}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 border-b border-chalk-line dark:border-ink-line">
        {(['today', 'upcoming', 'results', 'all'] as FilterTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'border-b-2 px-3 py-2 text-sm font-medium capitalize',
              tab === t
                ? 'border-pitch text-pitch'
                : 'border-transparent text-steel hover:text-ink dark:hover:text-chalk'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <Panel padded={false}>
        {isError ? (
          <div className="p-5">
            <ErrorState message="Unable to load fixtures." onRetry={refetch} />
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState message="No matches found for this filter." />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((f) => (
              <MatchCardRich key={f.id} fixture={f} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
