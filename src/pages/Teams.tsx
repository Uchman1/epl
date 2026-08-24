import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTeams } from '@/hooks/useTeams';
import { Panel } from '@/components/common/Panel';
import { Skeleton, ErrorState, EmptyState } from '@/components/common/States';
import { TeamBadge } from '@/components/common/TeamBadge';
import { Search } from 'lucide-react';

export function Teams() {
  const { data, isLoading, isError, refetch } = useTeams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter(
      (t) => t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q) || t.tla.toLowerCase().includes(q)
    );
  }, [data, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink dark:text-chalk">
          Teams
        </h1>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-steel-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams…"
            className="w-56 rounded-full border border-chalk-line bg-white py-1.5 pl-8 pr-3 text-sm focus:border-pitch focus:outline-none dark:border-ink-line dark:bg-ink-soft dark:text-chalk"
          />
        </div>
      </div>

      <Panel padded={false}>
        {isError ? (
          <div className="p-5">
            <ErrorState message="Unable to load teams." onRetry={refetch} />
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState message="No teams match your search." />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((team) => (
              <button
                key={team.id}
                onClick={() => navigate(`/teams/${team.id}`)}
                className="flex items-center gap-3 rounded-lg border border-chalk-line bg-white px-3 py-3 text-left hover:border-pitch dark:border-ink-line dark:bg-ink-soft"
              >
                <TeamBadge team={team} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink dark:text-chalk">{team.shortName}</p>
                  <p className="truncate text-xs text-steel">{team.stadium}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
