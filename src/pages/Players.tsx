import { useMemo, useState } from 'react';
import { usePlayers } from '@/hooks/usePlayers';
import { Panel } from '@/components/common/Panel';
import { Skeleton, ErrorState } from '@/components/common/States';
import { TeamBadge } from '@/components/common/TeamBadge';
import clsx from 'clsx';

type RankBy = 'goals' | 'assists' | 'minutes' | 'cleanSheets' | 'cards';

const TABS: { key: RankBy; label: string }[] = [
  { key: 'goals', label: 'Top Scorers' },
  { key: 'assists', label: 'Top Assists' },
  { key: 'minutes', label: 'Most Minutes' },
  { key: 'cleanSheets', label: 'Clean Sheets' },
  { key: 'cards', label: 'Most Cards' },
];

export function Players() {
  const { data, isLoading, isError, refetch } = usePlayers();
  const [rankBy, setRankBy] = useState<RankBy>('goals');

  const ranked = useMemo(() => {
    if (!data) return [];
    const withMetric = data.map((p) => ({
      player: p,
      metric:
        rankBy === 'goals' ? p.goals
        : rankBy === 'assists' ? p.assists
        : rankBy === 'minutes' ? p.minutes
        : rankBy === 'cleanSheets' ? p.cleanSheets ?? 0
        : p.yellowCards + p.redCards * 2,
    }));
    return withMetric.sort((a, b) => b.metric - a.metric).slice(0, 20);
  }, [data, rankBy]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink dark:text-chalk">
        Players
      </h1>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setRankBy(t.key)}
            className={clsx(
              'rounded-full px-3 py-1.5 text-sm font-medium',
              rankBy === t.key
                ? 'bg-pitch text-white'
                : 'border border-chalk-line text-steel hover:text-ink dark:border-ink-line dark:hover:text-chalk'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Panel padded={false}>
        {isError ? (
          <div className="p-5">
            <ErrorState message="Unable to load player statistics." onRetry={refetch} />
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-2 p-5">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-chalk-line text-left text-[11px] uppercase tracking-wide text-steel dark:border-ink-line">
                <th className="px-5 py-2">#</th>
                <th className="px-2 py-2">Player</th>
                <th className="px-2 py-2">Team</th>
                <th className="px-2 py-2 text-center">Pos</th>
                <th className="px-2 py-2 text-center">Apps</th>
                <th className="px-5 py-2 text-right">
                  {TABS.find((t) => t.key === rankBy)?.label}
                </th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((row, i) => (
                <tr key={row.player.id} className="border-b border-chalk-line last:border-0 dark:border-ink-line">
                  <td className="px-5 py-2 font-mono text-steel">{i + 1}</td>
                  <td className="px-2 py-2 font-medium text-ink dark:text-chalk">{row.player.name}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <TeamBadge team={row.player.team} size="sm" />
                      <span className="text-steel">{row.player.team.shortName}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center text-steel">{row.player.position}</td>
                  <td className="tnum px-2 py-2 text-center font-mono text-steel">{row.player.appearances}</td>
                  <td className="tnum px-5 py-2 text-right font-mono font-bold text-ink dark:text-chalk">
                    {row.metric}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
