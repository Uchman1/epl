import { useStandings } from '@/hooks/useStandings';
import { Panel } from '@/components/common/Panel';
import { Skeleton, ErrorState } from '@/components/common/States';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { ZoneLegend } from '@/components/standings/ZoneLegend';

export function StandingsPage() {
  const { data, isLoading, isError, refetch } = useStandings();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink dark:text-chalk">
        Premier League Table
      </h1>
      <Panel>
        {isError ? (
          <ErrorState message="Unable to load league standings." onRetry={refetch} />
        ) : isLoading || !data ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <div className="flex flex-col gap-4">
            <StandingsTable standings={data} />
            <ZoneLegend />
          </div>
        )}
      </Panel>
    </div>
  );
}
