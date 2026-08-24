import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-md bg-chalk-line/70 dark:bg-ink-line/70',
        className
      )}
    />
  );
}

export function ErrorState({
  message = 'Unable to load this data.',
  detail = 'The football data service is temporarily unavailable.',
  onRetry,
}: {
  message?: string;
  detail?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <AlertTriangle className="h-7 w-7 text-crimson" strokeWidth={1.75} />
      <div>
        <p className="font-semibold text-ink dark:text-chalk">{message}</p>
        <p className="mt-1 text-sm text-steel">{detail}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-chalk hover:bg-ink/90 dark:bg-chalk dark:text-ink dark:hover:bg-chalk/90"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  message = 'Nothing to show yet.',
  detail,
}: {
  message?: string;
  detail?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <Inbox className="h-6 w-6 text-steel-soft" strokeWidth={1.75} />
      <p className="font-medium text-ink dark:text-chalk">{message}</p>
      {detail && <p className="text-sm text-steel">{detail}</p>}
    </div>
  );
}
