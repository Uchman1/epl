import { useParams, Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useTeam } from '@/hooks/useTeams';
import { useTeamFixtures } from '@/hooks/useFixtures';
import { useStandings } from '@/hooks/useStandings';
import { Panel } from '@/components/common/Panel';
import { Skeleton, ErrorState, EmptyState } from '@/components/common/States';
import { TeamBadge } from '@/components/common/TeamBadge';
import { FormStrip } from '@/components/common/FormStrip';
import { MatchCardCompact } from '@/components/matches/MatchCard';
import { pointsPerGame } from '@/utils/calculations';
import { formatDecimal } from '@/utils/formatting';
import { ChevronLeft } from 'lucide-react';

export function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const team = useTeam(teamId);
  const fixtures = useTeamFixtures(teamId);
  const standings = useStandings();

  if (team.isError || fixtures.isError || standings.isError) {
    return <ErrorState message="Unable to load this team." />;
  }

  if (team.isLoading || fixtures.isLoading || standings.isLoading || !team.data) {
    return <Skeleton className="h-96 w-full" />;
  }

  const standing = standings.data?.find((s) => s.team.id === teamId);
  const recent = (fixtures.data ?? [])
    .filter((f) => f.status === 'full_time')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);
  const upcoming = (fixtures.data ?? [])
    .filter((f) => f.status === 'scheduled')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-5">
      <Link to="/teams" className="flex w-fit items-center gap-1 text-sm text-steel hover:text-ink dark:hover:text-chalk">
        <ChevronLeft className="h-4 w-4" /> All teams
      </Link>

      <Panel>
        <div className="flex flex-wrap items-center gap-4">
          <TeamBadge team={team.data} size="lg" />
          <div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink dark:text-chalk">
              {team.data.name}
            </h1>
            <p className="text-sm text-steel">
              {team.data.stadium} · {team.data.city}
              {team.data.manager ? ` · ${team.data.manager}` : ''}
            </p>
          </div>
          {standing && (
            <div className="ml-auto flex items-center gap-6 font-mono">
              <Stat label="Position" value={`#${standing.position}`} />
              <Stat label="Points" value={String(standing.points)} />
              <Stat label="PPG" value={formatDecimal(pointsPerGame(standing.points, standing.played), 2)} />
            </div>
          )}
        </div>
      </Panel>

      {standing && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label="Played" value={standing.played} />
          <SummaryCard label="Wins" value={standing.wins} />
          <SummaryCard label="Draws" value={standing.draws} />
          <SummaryCard label="Losses" value={standing.losses} />
          <SummaryCard label="Goals For" value={standing.goalsFor} />
          <SummaryCard label="Goals Against" value={standing.goalsAgainst} />
          <SummaryCard label="Goal Diff." value={standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference} />
          <SummaryCard label="Form" value={<FormStrip form={standing.form} size="sm" />} />
        </div>
      )}

      {standing && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Panel title="Home Record">
            <SplitStats split={standing.home} />
          </Panel>
          <Panel title="Away Record">
            <SplitStats split={standing.away} />
          </Panel>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel title="Recent Results">
          {recent.length === 0 ? (
            <EmptyState message="No completed matches yet." />
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map((f) => (
                <MatchCardCompact key={f.id} fixture={f} />
              ))}
            </div>
          )}
        </Panel>
        <Panel title="Upcoming Fixtures">
          {upcoming.length === 0 ? (
            <EmptyState message="No upcoming fixtures scheduled." />
          ) : (
            <div className="flex flex-col gap-2">
              {upcoming.map((f) => (
                <MatchCardCompact key={f.id} fixture={f} />
              ))}
            </div>
          )}
        </Panel>
      </div>

      <p className="text-xs text-steel-soft">
        Position progression charts and detailed attack/defence analytics arrive in a later phase.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <p className="text-[10px] uppercase tracking-wide text-steel">{label}</p>
      <p className="tnum text-lg font-bold text-ink dark:text-chalk">{value}</p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-chalk-line bg-white px-3 py-2.5 dark:border-ink-line dark:bg-ink-soft">
      <p className="text-[10px] uppercase tracking-wide text-steel">{label}</p>
      <div className="tnum mt-0.5 font-mono text-base font-semibold text-ink dark:text-chalk">{value}</div>
    </div>
  );
}

function SplitStats({ split }: { split: { played: number; wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number } }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-center sm:grid-cols-6">
      {(['played', 'wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst'] as const).map((k) => (
        <div key={k}>
          <p className="tnum font-mono text-lg font-semibold text-ink dark:text-chalk">{split[k]}</p>
          <p className="text-[10px] uppercase tracking-wide text-steel">{k === 'goalsFor' ? 'GF' : k === 'goalsAgainst' ? 'GA' : k.slice(0, 1).toUpperCase() + k.slice(1, 4)}</p>
        </div>
      ))}
    </div>
  );
}
