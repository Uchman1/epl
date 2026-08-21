import { useState, useMemo } from 'react';
import { useTeams } from '@/hooks/useTeams';
import { useStandings } from '@/hooks/useStandings';
import { Panel } from '@/components/common/Panel';
import { Skeleton, EmptyState } from '@/components/common/States';
import { TeamBadge } from '@/components/common/TeamBadge';
import { FormStrip } from '@/components/common/FormStrip';
import { pointsPerGame } from '@/utils/calculations';
import { formatDecimal } from '@/utils/formatting';
import type { Team } from '@/types/football';

const ROWS: { key: keyof ReturnType<typeof metricsFor>; label: string }[] = [
  { key: 'position', label: 'League Position' },
  { key: 'points', label: 'Points' },
  { key: 'played', label: 'Played' },
  { key: 'wins', label: 'Wins' },
  { key: 'draws', label: 'Draws' },
  { key: 'losses', label: 'Losses' },
  { key: 'goalsFor', label: 'Goals Scored' },
  { key: 'goalsAgainst', label: 'Goals Conceded' },
  { key: 'goalDifference', label: 'Goal Difference' },
  { key: 'ppg', label: 'Points Per Game' },
];

function metricsFor(s: NonNullable<ReturnType<typeof useStandings>['data']>[number]) {
  return {
    position: s.position,
    points: s.points,
    played: s.played,
    wins: s.wins,
    draws: s.draws,
    losses: s.losses,
    goalsFor: s.goalsFor,
    goalsAgainst: s.goalsAgainst,
    goalDifference: s.goalDifference,
    ppg: Number(formatDecimal(pointsPerGame(s.points, s.played), 2)),
  };
}

export function Compare() {
  const teams = useTeams();
  const standings = useStandings();
  const [teamAId, setTeamAId] = useState<string>('');
  const [teamBId, setTeamBId] = useState<string>('');

  const standingA = standings.data?.find((s) => s.team.id === teamAId);
  const standingB = standings.data?.find((s) => s.team.id === teamBId);

  const metricsA = useMemo(() => (standingA ? metricsFor(standingA) : null), [standingA]);
  const metricsB = useMemo(() => (standingB ? metricsFor(standingB) : null), [standingB]);

  const loading = teams.isLoading || standings.isLoading;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink dark:text-chalk">
        Compare Teams
      </h1>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TeamSelect
          label="Team A"
          value={teamAId}
          onChange={setTeamAId}
          teams={teams.data ?? []}
          exclude={teamBId}
        />
        <TeamSelect
          label="Team B"
          value={teamBId}
          onChange={setTeamBId}
          teams={teams.data ?? []}
          exclude={teamAId}
        />
      </div>

      <Panel>
        {loading ? (
          <Skeleton className="h-72 w-full" />
        ) : !standingA || !standingB || !metricsA || !metricsB ? (
          <EmptyState message="Select two teams to compare." detail="Pick Team A and Team B above." />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <TeamHeader team={standingA.team} />
              <TeamHeader team={standingB.team} align="right" />
            </div>

            <div className="divide-y divide-chalk-line dark:divide-ink-line">
              {ROWS.map((row) => {
                const a = metricsA[row.key];
                const b = metricsB[row.key];
                const aWins = row.key === 'position' ? a < b : a > b;
                const bWins = row.key === 'position' ? b < a : b > a;
                return (
                  <div key={row.key} className="grid grid-cols-3 items-center py-2 text-sm">
                    <span className={`tnum font-mono font-semibold ${aWins ? 'text-pitch' : 'text-ink dark:text-chalk'}`}>
                      {a}
                    </span>
                    <span className="text-center text-xs uppercase tracking-wide text-steel">{row.label}</span>
                    <span className={`tnum text-right font-mono font-semibold ${bWins ? 'text-pitch' : 'text-ink dark:text-chalk'}`}>
                      {b}
                    </span>
                  </div>
                );
              })}
              <div className="grid grid-cols-3 items-center py-2 text-sm">
                <FormStrip form={standingA.form} size="sm" />
                <span className="text-center text-xs uppercase tracking-wide text-steel">Form</span>
                <div className="flex justify-end">
                  <FormStrip form={standingB.form} size="sm" />
                </div>
              </div>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

function TeamHeader({ team, align = 'left' }: { team: Team; align?: 'left' | 'right' }) {
  return (
    <div className={`flex items-center gap-2 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <TeamBadge team={team} size="md" />
      <span className="font-display text-lg font-bold uppercase text-ink dark:text-chalk">{team.shortName}</span>
    </div>
  );
}

function TeamSelect({
  label,
  value,
  onChange,
  teams,
  exclude,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  teams: { id: string; name: string }[];
  exclude: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs uppercase tracking-wide text-steel">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-chalk-line bg-white px-3 py-2 dark:border-ink-line dark:bg-ink-soft dark:text-chalk"
      >
        <option value="">Select a team…</option>
        {teams
          .filter((t) => t.id !== exclude)
          .map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
      </select>
    </label>
  );
}
