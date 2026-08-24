import { useCompetitionZones } from '@/hooks/useCompetitionZones';

const BAR: Record<string, string> = {
  'zone-cl': 'bg-pitch',
  'zone-el': 'bg-amber',
  'zone-ecl': 'bg-amber-deep',
  'zone-rel': 'bg-crimson',
};

export function ZoneLegend() {
  const { data: zones } = useCompetitionZones();
  if (!zones) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-steel">
      {zones.map((z) => (
        <span key={z.kind} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${BAR[z.colorToken] ?? 'bg-steel-soft'}`} />
          {z.label}
        </span>
      ))}
    </div>
  );
}
