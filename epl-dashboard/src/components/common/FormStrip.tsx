import type { FormResult } from '@/types/football';
import clsx from 'clsx';

const STYLES: Record<FormResult, string> = {
  W: 'bg-pitch text-white',
  D: 'bg-steel-soft text-ink',
  L: 'bg-crimson text-white',
};

export function FormStrip({
  form,
  size = 'md',
  className,
}: {
  form: FormResult[];
  size?: 'sm' | 'md';
  className?: string;
}) {
  if (form.length === 0) {
    return <span className="font-mono text-xs text-steel">—</span>;
  }
  return (
    <div className={clsx('flex gap-1', className)}>
      {form.map((r, i) => (
        <span
          key={i}
          className={clsx(
            'flex items-center justify-center rounded-[3px] font-mono font-semibold',
            size === 'sm' ? 'h-4 w-4 text-[9px]' : 'h-5 w-5 text-[10px]',
            STYLES[r]
          )}
          title={r === 'W' ? 'Win' : r === 'D' ? 'Draw' : 'Loss'}
        >
          {r}
        </span>
      ))}
    </div>
  );
}
