import type { CompetitionZone } from '@/types/football';

// Editable in one place: a rule change (extra CL slot, playoff position,
// etc.) only requires updating this array — no component or table logic
// hardcodes "top 4" or "bottom 3" anywhere.
export const MOCK_COMPETITION_ZONES: CompetitionZone[] = [
  { kind: 'champions_league', label: 'Champions League', positionRange: [1, 4], colorToken: 'zone-cl' },
  { kind: 'europa_league', label: 'Europa League', positionRange: [5, 5], colorToken: 'zone-el' },
  { kind: 'conference_league', label: 'Conference League', positionRange: [6, 6], colorToken: 'zone-ecl' },
  { kind: 'relegation', label: 'Relegation', positionRange: [18, 20], colorToken: 'zone-rel' },
];

export function zoneForPosition(position: number): CompetitionZone | undefined {
  return MOCK_COMPETITION_ZONES.find(
    (z) => position >= z.positionRange[0] && position <= z.positionRange[1]
  );
}
