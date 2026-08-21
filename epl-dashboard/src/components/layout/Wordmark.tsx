export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-pitch font-display text-base font-bold text-white">
        P
      </span>
      {!compact && (
        <span className="font-display text-xl font-bold uppercase tracking-wider text-ink dark:text-chalk">
          Pitchside
        </span>
      )}
    </div>
  );
}
