import type {
  Team,
  Fixture,
  Standing,
  Player,
  Match,
  SeasonMeta,
  CompetitionZone,
} from '@/types/football';

/**
 * Contract every football data source must satisfy. Nothing outside the
 * services/football directory should ever reach for a provider-specific
 * client or type — hooks and components depend only on this interface.
 *
 * Swapping `MockFootballProvider` for `ApiFootballProvider` (a real EPL data
 * vendor) should not require changing a single page or component.
 */
export interface FootballDataProvider {
  getSeasonMeta(): Promise<SeasonMeta>;
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  getFixtures(): Promise<Fixture[]>;
  getFixturesByTeam(teamId: string): Promise<Fixture[]>;
  getStandings(): Promise<Standing[]>;
  getPlayers(): Promise<Player[]>;
  getMatch(id: string): Promise<Match | undefined>;
  getCompetitionZones(): Promise<CompetitionZone[]>;
}

/** Thrown by providers so the UI layer can render a consistent error state
 * regardless of which provider is active. */
export class FootballDataError extends Error {
  cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'FootballDataError';
    this.cause = cause;
  }
}
