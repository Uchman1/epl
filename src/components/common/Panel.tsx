import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Panel({
  title,
  action,
  children,
  className,
  padded = true,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={clsx(
        'rounded-xl border border-chalk-line bg-white/70 shadow-sm backdrop-blur-sm',
        'dark:border-ink-line dark:bg-ink-soft/70',
        className
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-chalk-line px-5 py-3 dark:border-ink-line">
          {title && (
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink dark:text-chalk">
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </section>
  );
}
