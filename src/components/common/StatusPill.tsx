import type { MatchStatus } from '@/types/football';
import clsx from 'clsx';

const LABELS: Record<MatchStatus, string> = {
  scheduled: 'Scheduled',
  live: 'Live',
  half_time: 'Half Time',
  full_time: 'Full Time',
  postponed: 'Postponed',
};

export function StatusPill({ status, minute }: { status: MatchStatus; minute?: number }) {
  const isLive = status === 'live' || status === 'half_time';
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        isLive
          ? 'bg-crimson/10 text-crimson dark:bg-crimson/20'
          : status === 'full_time'
            ? 'bg-steel-soft/20 text-steel dark:text-steel-soft'
            : status === 'postponed'
              ? 'bg-amber/15 text-amber-deep'
              : 'bg-pitch-tint text-pitch-deep dark:bg-pitch/15 dark:text-pitch'
      )}
    >
      {isLive && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-crimson" />
        </span>
      )}
      {isLive && minute ? `${minute}'` : LABELS[status]}
    </span>
  );
}
