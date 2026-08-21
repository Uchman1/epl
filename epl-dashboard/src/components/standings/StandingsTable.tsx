import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Standing } from '@/types/football';
import { TeamBadge } from '@/components/common/TeamBadge';
import { FormStrip } from '@/components/common/FormStrip';
import { zoneForPosition } from '@/data/mock/competitionZones';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import clsx from 'clsx';

type SortKey = 'position' | 'points' | 'goalDifference' | 'goalsFor' | 'played';

const ZONE_BAR: Record<string, string> = {
  'zone-cl': 'bg-pitch',
  'zone-el': 'bg-amber',
  'zone-ecl': 'bg-amber-deep',
  'zone-rel': 'bg-crimson',
};

export function StandingsTable({
  standings,
  compact = false,
  highlightTeamId,
}: {
  standings: Standing[];
  compact?: boolean;
  highlightTeamId?: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>('position');
  const navigate = useNavigate();

  const sorted = useMemo(() => {
    if (sortKey === 'position') return standings;
    return [...standings].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));
  }, [standings, sortKey]);

  const rows = compact ? sorted.slice(0, 8) : sorted;

  function toggleSort(key: SortKey) {
    setSortKey((prev) => (prev === key ? 'position' : key));
  }

  return (
    <div className="scroll-thin -mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-steel">
            <th className="w-8 py-2 pr-1"></th>
            <th className="py-2 pr-2">#</th>
            <th className="py-2 pr-2">Team</th>
            <Th label="P" active={sortKey === 'played'} onClick={() => toggleSort('played')} />
            <th className="hidden py-2 pr-2 text-center sm:table-cell">W</th>
            <th className="hidden py-2 pr-2 text-center sm:table-cell">D</th>
            <th className="hidden py-2 pr-2 text-center sm:table-cell">L</th>
            <th className="hidden py-2 pr-2 text-center md:table-cell">GF</th>
            <th className="hidden py-2 pr-2 text-center md:table-cell">GA</th>
            <Th label="GD" active={sortKey === 'goalDifference'} onClick={() => toggleSort('goalDifference')} />
            <Th label="Pts" active={sortKey === 'points'} onClick={() => toggleSort('points')} />
            {!compact && <th className="py-2 pl-2 text-left">Form</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const zone = zoneForPosition(s.position);
            const movement = (s.previousPosition ?? s.position) - s.position;
            return (
              <tr
                key={s.team.id}
                onClick={() => navigate(`/teams/${s.team.id}`)}
                className={clsx(
                  'cursor-pointer border-t border-chalk-line text-ink transition-colors hover:bg-chalk-soft/60 dark:border-ink-line dark:text-chalk dark:hover:bg-ink-line/40',
                  highlightTeamId === s.team.id && 'bg-pitch-tint/60 dark:bg-pitch/10'
                )}
              >
                <td className="pr-1">
                  <span className={clsx('block h-6 w-1 rounded-full', zone ? ZONE_BAR[zone.colorToken] : 'bg-transparent')} />
                </td>
                <td className="py-2 pr-2 font-mono tabular-nums text-steel">
                  <div className="flex items-center gap-1">
                    {s.position}
                    <MovementIcon delta={movement} />
                  </div>
                </td>
                <td className="py-2 pr-2 font-medium">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={s.team} size="sm" />
                    <span className="truncate">{s.team.shortName}</span>
                  </div>
                </td>
                <td className="tnum py-2 pr-2 text-center font-mono">{s.played}</td>
                <td className="tnum hidden py-2 pr-2 text-center font-mono sm:table-cell">{s.wins}</td>
                <td className="tnum hidden py-2 pr-2 text-center font-mono sm:table-cell">{s.draws}</td>
                <td className="tnum hidden py-2 pr-2 text-center font-mono sm:table-cell">{s.losses}</td>
                <td className="tnum hidden py-2 pr-2 text-center font-mono md:table-cell">{s.goalsFor}</td>
                <td className="tnum hidden py-2 pr-2 text-center font-mono md:table-cell">{s.goalsAgainst}</td>
                <td className="tnum py-2 pr-2 text-center font-mono">
                  {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
                </td>
                <td className="tnum py-2 pr-2 text-center font-mono font-bold">{s.points}</td>
                {!compact && (
                  <td className="py-2 pl-2">
                    <FormStrip form={s.form} size="sm" />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <th
      onClick={onClick}
      className={clsx(
        'cursor-pointer select-none py-2 pr-2 text-center hover:text-ink dark:hover:text-chalk',
        active && 'text-pitch'
      )}
    >
      {label}
    </th>
  );
}

function MovementIcon({ delta }: { delta: number }) {
  if (delta > 0) return <ArrowUp className="h-3 w-3 text-pitch" />;
  if (delta < 0) return <ArrowDown className="h-3 w-3 text-crimson" />;
  return <Minus className="h-3 w-3 text-steel-soft" />;
}
