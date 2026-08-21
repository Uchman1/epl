// ---------------------------------------------------------------------------
// Core domain types for the EPL tracking dashboard.
// These types are intentionally provider-agnostic: whatever football data
// API is eventually wired in (via FootballDataProvider), it must map its
// responses onto these shapes. Nothing in components/pages should ever
// import a provider-specific type.
// ---------------------------------------------------------------------------

export type MatchStatus =
  | 'scheduled'
  | 'live'
  | 'half_time'
  | 'full_time'
  | 'postponed';

export type ResultOutcome = 'home_win' | 'draw' | 'away_win';

/** A single team's outcome in one match, independent of home/away side —
 * this is what "form" (W W D L W) is built from. */
export type FormResult = 'W' | 'D' | 'L';

export type CompetitionZoneKind =
  | 'champions_league'
  | 'europa_league'
  | 'conference_league'
  | 'relegation'
  | 'none';

/** Configurable metadata describing which table positions fall into which
 * continental/relegation zone. Kept as data (not hardcoded conditionals) so
 * a rule change (e.g. an extra CL slot) only requires editing this config. */
export interface CompetitionZone {
  kind: CompetitionZoneKind;
  label: string;
  /** Inclusive position range, e.g. [1, 4] for Champions League. */
  positionRange: [number, number];
  /** Tailwind-friendly color token key, resolved by the UI layer. */
  colorToken: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  /** Three/four letter tag used in compact UI (badges, mobile tables). */
  tla: string;
  /** Hex color used to render a generated crest/badge when no logo image exists. */
  crestColor: string;
  logo?: string;
  stadium: string;
  city: string;
  manager?: string;
  founded?: number;
}

export interface Fixture {
  id: string;
  /** ISO 8601 datetime. */
  date: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  venue: string;
  matchweek: number;
  /** Minute counter for live matches only. */
  minute?: number;
}

export interface Standing {
  position: number;
  previousPosition?: number;
  team: Team;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  /** Last 5 results, oldest to newest, from this team's own perspective. */
  form: FormResult[];
  home: SplitRecord;
  away: SplitRecord;
}

export interface SplitRecord {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: string;
  name: string;
  team: Team;
  position: PlayerPosition;
  nationality: string;
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  /** Goalkeeper-only stats; omitted for outfield players rather than faked. */
  cleanSheets?: number;
  saves?: number;
}

export interface Goal {
  id: string;
  fixtureId: string;
  scorerId: string;
  scorerName: string;
  assistId?: string;
  assistName?: string;
  teamId: string;
  minute: number;
  isOwnGoal?: boolean;
  isPenalty?: boolean;
}

export interface MatchCard {
  id: string;
  fixtureId: string;
  playerId: string;
  playerName: string;
  teamId: string;
  minute: number;
  type: 'yellow' | 'red';
}

export interface MatchStats {
  fixtureId: string;
  possession?: [number, number];
  shots?: [number, number];
  shotsOnTarget?: [number, number];
  corners?: [number, number];
  fouls?: [number, number];
}

export interface Match extends Fixture {
  goals: Goal[];
  cards: MatchCard[];
  stats?: MatchStats;
}

export interface SeasonMeta {
  id: string;
  label: string;
  currentMatchweek: number;
  totalMatchweeks: number;
  lastUpdated: string;
}
