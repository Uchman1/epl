import type { Team } from '@/types/football';
import clsx from 'clsx';

const SIZE_MAP = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-14 w-14 text-base',
};

export function TeamBadge({
  team,
  size = 'md',
  className,
}: {
  team: Team;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-md font-display font-bold tracking-wide text-white shadow-sm ring-1 ring-black/10',
        SIZE_MAP[size],
        className
      )}
      style={{ backgroundColor: team.crestColor }}
      title={team.name}
      aria-hidden="true"
    >
      {team.tla}
    </span>
  );
}
