import { RefreshCw, Search, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSeasonMeta } from '@/hooks/useSeasonMeta';
import { useTheme } from '@/layouts/ThemeProvider';
import { formatDateTime } from '@/utils/formatting';
import { Skeleton } from '@/components/common/States';
import { Wordmark } from './Wordmark';

export function Header() {
  const { data: season, isLoading } = useSeasonMeta();
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setTimeout(() => setRefreshing(false), 500);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/teams?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-chalk-line bg-white/85 backdrop-blur dark:border-ink-line dark:bg-ink/85">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4 lg:hidden">
          <Wordmark compact />
        </div>

        <div className="hidden min-w-0 flex-col lg:flex">
          {isLoading || !season ? (
            <Skeleton className="h-6 w-64" />
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink dark:text-chalk">
                Premier League {season.label}
                <span className="mx-2 text-steel-soft">·</span>
                <span className="text-pitch dark:text-pitch">Matchweek {season.currentMatchweek}</span>
              </h1>
              <p className="font-mono text-xs text-steel">
                Last updated {formatDateTime(season.lastUpdated)}
              </p>
            </>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-steel-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams…"
              aria-label="Search teams"
              className="w-52 rounded-full border border-chalk-line bg-chalk-soft/50 py-1.5 pl-8 pr-3 text-sm text-ink placeholder:text-steel-soft focus:border-pitch focus:outline-none dark:border-ink-line dark:bg-ink-soft dark:text-chalk"
            />
          </form>

          <button
            onClick={handleRefresh}
            aria-label="Refresh data"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-chalk-line text-steel hover:text-ink dark:border-ink-line dark:hover:text-chalk"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-chalk-line text-steel hover:text-ink dark:border-ink-line dark:hover:text-chalk"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
