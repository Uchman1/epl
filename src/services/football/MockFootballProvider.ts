import type { FootballDataProvider } from './FootballDataProvider';
import type { Team, Fixture, Standing, Player, Match, SeasonMeta, CompetitionZone } from '@/types/football';
import { MOCK_TEAMS, getTeamById } from '@/data/mock/teams';
import { MOCK_FIXTURES, getCurrentMatchweek, MOCK_TODAY } from '@/data/mock/fixtures';
import { MOCK_PLAYERS } from '@/data/mock/players';
import { MOCK_COMPETITION_ZONES } from '@/data/mock/competitionZones';
import { computeStandings } from '@/utils/calculations';

// Simulated network latency so loading states are actually exercised during
// development instead of resolving instantly every time.
const LATENCY_MS = 350;
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

/**
 * In-memory mock implementation of FootballDataProvider. Used until a real
 * EPL data vendor is wired in via ApiFootballProvider — the rest of the
 * app never knows the difference.
 */
export class MockFootballProvider implements FootballDataProvider {
  async getSeasonMeta(): Promise<SeasonMeta> {
    return delay({
      id: '2026-27',
      label: '2026/27',
      currentMatchweek: getCurrentMatchweek(),
      totalMatchweeks: 38,
      lastUpdated: MOCK_TODAY.toISOString(),
    });
  }

  async getTeams(): Promise<Team[]> {
    return delay(MOCK_TEAMS);
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return delay(getTeamById(id));
  }

  async getFixtures(): Promise<Fixture[]> {
    return delay(MOCK_FIXTURES);
  }

  async getFixturesByTeam(teamId: string): Promise<Fixture[]> {
    return delay(
      MOCK_FIXTURES.filter((f) => f.homeTeam.id === teamId || f.awayTeam.id === teamId)
    );
  }

  async getStandings(): Promise<Standing[]> {
    return delay(computeStandings(MOCK_TEAMS, MOCK_FIXTURES));
  }

  async getPlayers(): Promise<Player[]> {
    return delay(MOCK_PLAYERS);
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const fixture = MOCK_FIXTURES.find((f) => f.id === id);
    if (!fixture) return delay(undefined);
    // Phase 1 does not yet generate goal/card event detail — match detail
    // pages arrive in Phase 2. Shape is present so components can render
    // "not yet available" rather than crash.
    return delay({ ...fixture, goals: [], cards: [] });
  }

  async getCompetitionZones(): Promise<CompetitionZone[]> {
    return delay(MOCK_COMPETITION_ZONES);
  }
}
