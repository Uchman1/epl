import type { Fixture, MatchStatus } from '@/types/football';
import { MOCK_TEAMS, MOCK_TEAM_STRENGTH, getTeamById } from './teams';
import { buildFullSeason } from './schedule';
import { SeededRandom } from '@/utils/seededRandom';

const SEED = 20260821;
const rng = new SeededRandom(SEED);

// Season kicks off Saturday 8 Aug 2026. "Today" in this mock world is
// 21 Aug 2026 — a Friday, which lands as the opening fixture of matchweek 3.
const SEASON_START = new Date('2026-08-08T00:00:00Z');
export const MOCK_TODAY = new Date('2026-08-21T20:15:00Z');

// Day offsets (in days from that matchweek's Saturday) for each of the 10
// fixture slots, spreading matches across the Fri–Mon EPL matchweek window.
const DAY_OFFSETS = [-1, 0, 0, 0, 0, 0, 1, 1, 1, 2];
const KICKOFF_TIMES = [
  '19:30', '12:30', '15:00', '15:00', '15:00',
  '17:30', '14:00', '14:00', '16:30', '20:00',
];

const VENUE_FALLBACK = 'Home Stadium';

function matchweekSaturday(matchweek: number): Date {
  const d = new Date(SEASON_START);
  d.setUTCDate(d.getUTCDate() + (matchweek - 1) * 7);
  return d;
}

function fixtureDate(matchweek: number, slotIndex: number): Date {
  const sat = matchweekSaturday(matchweek);
  const d = new Date(sat);
  d.setUTCDate(d.getUTCDate() + DAY_OFFSETS[slotIndex]);
  const [h, m] = KICKOFF_TIMES[slotIndex].split(':').map(Number);
  d.setUTCHours(h, m, 0, 0);
  return d;
}

function statusForDate(date: Date): { status: MatchStatus; minute?: number } {
  const diffMs = MOCK_TODAY.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 0) return { status: 'scheduled' };
  if (diffHours < 1.75) return { status: 'live', minute: Math.min(90, Math.round(diffHours * 60)) };
  return { status: 'full_time' };
}

function generateScoreline(homeId: string, awayId: string): [number, number] {
  const homeStrength = MOCK_TEAM_STRENGTH[homeId] ?? 75;
  const awayStrength = MOCK_TEAM_STRENGTH[awayId] ?? 75;
  const homeAdvantage = 1.12;
  const lambdaHome = Math.min(3.2, 1.35 * homeAdvantage * (homeStrength / awayStrength));
  const lambdaAway = Math.min(3.0, 1.05 * (awayStrength / homeStrength));
  const home = Math.min(6, rng.poissonish(lambdaHome));
  const away = Math.min(6, rng.poissonish(lambdaAway));
  return [home, away];
}

function buildFixtures(): Fixture[] {
  const teamIds = MOCK_TEAMS.map((t) => t.id);
  const season = buildFullSeason(teamIds);
  const fixtures: Fixture[] = [];

  season.forEach((round, roundIdx) => {
    const matchweek = roundIdx + 1;
    round.forEach(([homeId, awayId], slotIndex) => {
      const homeTeam = getTeamById(homeId)!;
      const awayTeam = getTeamById(awayId)!;
      const date = fixtureDate(matchweek, slotIndex);
      const { status, minute } = statusForDate(date);

      let homeScore: number | undefined;
      let awayScore: number | undefined;
      if (status === 'full_time') {
        [homeScore, awayScore] = generateScoreline(homeId, awayId);
      } else if (status === 'live') {
        // Scale down a full-time-ish scoreline proportionally to elapsed time
        // so live matches look "in progress" rather than final.
        const [fh, fa] = generateScoreline(homeId, awayId);
        const progress = Math.min(1, (minute ?? 0) / 90);
        homeScore = Math.round(fh * progress * 0.8);
        awayScore = Math.round(fa * progress * 0.8);
      }

      fixtures.push({
        id: `mw${matchweek}-${homeId}-${awayId}`,
        date: date.toISOString(),
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        status,
        venue: homeTeam.stadium || VENUE_FALLBACK,
        matchweek,
        minute,
      });
    });
  });

  return fixtures;
}

export const MOCK_FIXTURES: Fixture[] = buildFixtures();

export function getCurrentMatchweek(): number {
  const upcoming = MOCK_FIXTURES.filter((f) => f.status !== 'full_time');
  if (upcoming.length === 0) return MOCK_FIXTURES[MOCK_FIXTURES.length - 1]?.matchweek ?? 1;
  return Math.min(...upcoming.map((f) => f.matchweek));
}
