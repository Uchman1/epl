import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStandings } from '@/hooks/useStandings';
import { useFixtures } from '@/hooks/useFixtures';
import { usePlayers } from '@/hooks/usePlayers';
import { useSeasonMeta } from '@/hooks/useSeasonMeta';
import { Panel } from '@/components/common/Panel';
import { Skeleton, ErrorState, EmptyState } from '@/components/common/States';
import { KpiScoreboard, type ScoreboardItem } from '@/components/dashboard/KpiScoreboard';
import { MatchCardCompact } from '@/components/matches/MatchCard';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { ZoneLegend } from '@/components/standings/ZoneLegend';
import { formatDecimal, formatMatchDate, formatMatchTime } from '@/utils/formatting';
import { isMockData } from '@/services/football';

export function Dashboard() {
  const standings = useStandings();
  const fixtures = useFixtures();
  const players = usePlayers();
  const season = useSeasonMeta();

  const isLoading = standings.isLoading || fixtures.isLoading || players.isLoading || season.isLoading;
  const isError = standings.isError || fixtures.isError || players.isError || season.isError;

  const today = useMemo(() => {
    if (!fixtures.data) return [];
    // "Today" relative to the mock clock — matches whose kickoff falls on
    // the same calendar day as the most recent live/scheduled activity.
    const live = fixtures.data.filter((f) => f.status === 'live' || f.status === 'half_time');
    const referenceDate = live[0]?.date ?? fixtures.data.find((f) => f.status === 'scheduled')?.date;
    if (!referenceDate) return [];
    const day = new Date(referenceDate).toDateString();
    return fixtures.data
      .filter((f) => new Date(f.date).toDateString() === day)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [fixtures.data]);

  const upcoming = useMemo(() => {
    if (!fixtures.data) return [];
    return fixtures.data
      .filter((f) => f.status === 'scheduled')
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 8);
  }, [fixtures.data]);

  const recentResults = useMemo(() => {
    if (!fixtures.data) return [];
    return fixtures.data
      .filter((f) => f.status === 'full_time')
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8);
  }, [fixtures.data]);

  const kpis: ScoreboardItem[] = useMemo(() => {
    if (!standings.data || !players.data) return [];
    const matchesPlayed = standings.data.reduce((sum, s) => sum + s.played, 0) / 2;
    const totalGoals = standings.data.reduce((sum, s) => sum + s.goalsFor, 0);
    const avgGoals = matchesPlayed > 0 ? totalGoals / matchesPlayed : 0;
    const leader = standings.data[0];
    const topScorer = [...players.data].sort((a, b) => b.goals - a.goals)[0];
    const nextFixture = upcoming[0];

    return [
      { label: 'Matches Played', value: matchesPlayed },
      { label: 'Goals', value: totalGoals },
      { label: 'Avg Goals / Game', value: formatDecimal(avgGoals, 2) },
      { label: 'Leader', value: leader?.team.shortName ?? '—', sub: leader ? `${leader.points} pts` : undefined },
      {
        label: 'Top Scorer',
        value: topScorer && topScorer.goals > 0 ? topScorer.name : '—',
        sub: topScorer && topScorer.goals > 0 ? `${topScorer.goals} goals · ${topScorer.team.shortName}` : undefined,
      },
      {
        label: 'Next Match',
        value: nextFixture ? `${nextFixture.homeTeam.tla} v ${nextFixture.awayTeam.tla}` : '—',
        sub: nextFixture ? `${formatMatchDate(nextFixture.date)} ${formatMatchTime(nextFixture.date)}` : undefined,
      },
    ];
  }, [standings.data, players.data, upcoming]);

  if (isError) {
    return (
      <ErrorState
        message="Unable to load the dashboard."
        onRetry={() => {
          standings.refetch();
          fixtures.refetch();
          players.refetch();
          season.refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {isMockData && (
        <div className="rounded-lg border border-amber/30 bg-amber/10 px-4 py-2 text-xs font-medium text-amber-deep">
          Showing mock season data — connect a live provider from Settings when ready.
        </div>
      )}

      {isLoading ? <Skeleton className="h-24 w-full" /> : <KpiScoreboard items={kpis} />}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Panel title="Today's Matches" className="xl:col-span-3">
          <MatchList loading={isLoading} items={today} emptyText="No matches scheduled today." />
        </Panel>
        <Panel title="Upcoming Fixtures" className="xl:col-span-2">
          <MatchList loading={isLoading} items={upcoming} emptyText="No upcoming fixtures found." />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Panel
          title="League Table"
          className="xl:col-span-3"
          action={
            <Link to="/table" className="text-xs font-semibold text-pitch hover:underline">
              Full table →
            </Link>
          }
        >
          <div className="flex flex-col gap-3">
            {isLoading || !standings.data ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <>
                <StandingsTable standings={standings.data} compact />
                <ZoneLegend />
              </>
            )}
          </div>
        </Panel>
        <Panel title="Recent Results" className="xl:col-span-2">
          <MatchList loading={isLoading} items={recentResults} emptyText="No results yet this season." />
        </Panel>
      </div>
    </div>
  );
}

function MatchList({
  loading,
  items,
  emptyText,
}: {
  loading: boolean;
  items: import('@/types/football').Fixture[];
  emptyText: string;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }
  if (items.length === 0) return <EmptyState message={emptyText} />;
  return (
    <div className="flex flex-col gap-2">
      {items.map((f) => (
        <MatchCardCompact key={f.id} fixture={f} />
      ))}
    </div>
  );
}
