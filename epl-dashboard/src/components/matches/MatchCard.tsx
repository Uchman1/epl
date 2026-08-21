import type { Fixture } from '@/types/football';
import { TeamBadge } from '@/components/common/TeamBadge';
import { StatusPill } from '@/components/common/StatusPill';
import { formatMatchDate, formatMatchTime } from '@/utils/formatting';
import { MapPin } from 'lucide-react';

export function MatchCardCompact({ fixture }: { fixture: Fixture }) {
  const played = fixture.status === 'full_time' || fixture.status === 'live' || fixture.status === 'half_time';
  return (
    <div className="flex items-center gap-3 rounded-lg border border-chalk-line bg-white px-3 py-2.5 dark:border-ink-line dark:bg-ink-soft">
      <div className="flex w-14 shrink-0 flex-col items-start">
        <span className="font-mono text-[11px] text-steel">{formatMatchDate(fixture.date)}</span>
        <span className="font-mono text-[11px] font-medium text-ink dark:text-chalk">
          {formatMatchTime(fixture.date)}
        </span>
      </div>

      <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <TeamBadge team={fixture.homeTeam} size="sm" />
          <span className="truncate text-sm font-medium text-ink dark:text-chalk">
            {fixture.homeTeam.shortName}
          </span>
        </div>

        <div className="shrink-0 px-2 text-center">
          {played ? (
            <span className="tnum font-mono text-sm font-bold text-ink dark:text-chalk">
              {fixture.homeScore} – {fixture.awayScore}
            </span>
          ) : (
            <span className="font-mono text-xs text-steel-soft">vs</span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className="truncate text-right text-sm font-medium text-ink dark:text-chalk">
            {fixture.awayTeam.shortName}
          </span>
          <TeamBadge team={fixture.awayTeam} size="sm" />
        </div>
      </div>

      <div className="hidden w-24 shrink-0 justify-end sm:flex">
        <StatusPill status={fixture.status} minute={fixture.minute} />
      </div>
    </div>
  );
}

export function MatchCardRich({ fixture }: { fixture: Fixture }) {
  const played = fixture.status === 'full_time' || fixture.status === 'live' || fixture.status === 'half_time';
  return (
    <div className="rounded-xl border border-chalk-line bg-white p-4 dark:border-ink-line dark:bg-ink-soft">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wide text-steel">
          MW{fixture.matchweek} · {formatMatchDate(fixture.date)} · {formatMatchTime(fixture.date)}
        </span>
        <StatusPill status={fixture.status} minute={fixture.minute} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <TeamColumn team={fixture.homeTeam} />
        <div className="shrink-0 text-center">
          {played ? (
            <span className="tnum font-display text-3xl font-bold text-ink dark:text-chalk">
              {fixture.homeScore}–{fixture.awayScore}
            </span>
          ) : (
            <span className="font-display text-xl font-semibold text-steel-soft">VS</span>
          )}
        </div>
        <TeamColumn team={fixture.awayTeam} align="right" />
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-steel">
        <MapPin className="h-3 w-3" />
        {fixture.venue}
      </div>
    </div>
  );
}

function TeamColumn({ team, align = 'left' }: { team: Fixture['homeTeam']; align?: 'left' | 'right' }) {
  return (
    <div className={`flex min-w-0 flex-1 items-center gap-2 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <TeamBadge team={team} size="md" />
      <span className="truncate text-sm font-semibold text-ink dark:text-chalk">{team.shortName}</span>
    </div>
  );
}
