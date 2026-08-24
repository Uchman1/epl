import type { Fixture, Standing, FormResult, SplitRecord, Team } from '@/types/football';

const emptySplit = (): SplitRecord => ({
  played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0,
});

/** Builds the full standings table from raw fixtures. Only completed
 * (full_time) matches count toward the table. */
export function computeStandings(teams: Team[], fixtures: Fixture[]): Standing[] {
  const played = fixtures.filter((f) => f.status === 'full_time');

  type Acc = {
    team: Team;
    played: number; wins: number; draws: number; losses: number;
    goalsFor: number; goalsAgainst: number; points: number;
    home: SplitRecord; away: SplitRecord;
    formChrono: FormResult[];
    pointsChrono: { matchweek: number; points: number }[];
  };

  const table = new Map<string, Acc>();
  for (const team of teams) {
    table.set(team.id, {
      team, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0,
      points: 0, home: emptySplit(), away: emptySplit(), formChrono: [], pointsChrono: [],
    });
  }

  const sorted = [...played].sort((a, b) => a.date.localeCompare(b.date));

  for (const f of sorted) {
    const hs = f.homeScore ?? 0;
    const as = f.awayScore ?? 0;
    const home = table.get(f.homeTeam.id)!;
    const away = table.get(f.awayTeam.id)!;

    home.played++; away.played++;
    home.goalsFor += hs; home.goalsAgainst += as;
    away.goalsFor += as; away.goalsAgainst += hs;
    home.home.played++; home.home.goalsFor += hs; home.home.goalsAgainst += as;
    away.away.played++; away.away.goalsFor += as; away.away.goalsAgainst += hs;

    if (hs > as) {
      home.wins++; home.points += 3; home.home.wins++;
      away.losses++; away.away.losses++;
      home.formChrono.push('W');
      away.formChrono.push('L');
    } else if (hs < as) {
      away.wins++; away.points += 3; away.away.wins++;
      home.losses++; home.home.losses++;
      home.formChrono.push('L');
      away.formChrono.push('W');
    } else {
      home.draws++; home.points += 1; home.home.draws++;
      away.draws++; away.points += 1; away.away.draws++;
      home.formChrono.push('D');
      away.formChrono.push('D');
    }
    home.pointsChrono.push({ matchweek: f.matchweek, points: home.points });
    away.pointsChrono.push({ matchweek: f.matchweek, points: away.points });
  }

  const standings: Standing[] = Array.from(table.values()).map((acc) => ({
    position: 0,
    team: acc.team,
    played: acc.played,
    wins: acc.wins,
    draws: acc.draws,
    losses: acc.losses,
    goalsFor: acc.goalsFor,
    goalsAgainst: acc.goalsAgainst,
    goalDifference: acc.goalsFor - acc.goalsAgainst,
    points: acc.points,
    form: acc.formChrono.slice(-5),
    home: acc.home,
    away: acc.away,
  }));

  sortStandings(standings);
  standings.forEach((s, i) => (s.position = i + 1));

  // Previous position: recompute the table as it stood before each team's
  // most recent completed match, to power movement indicators (▲▼—).
  const priorFixtures = sorted.slice(0, Math.max(0, sorted.length - Math.ceil(teams.length / 2)));
  if (priorFixtures.length > 0) {
    const priorStandings = computeStandingsFromPlayed(teams, priorFixtures);
    const priorPosByTeam = new Map(priorStandings.map((s) => [s.team.id, s.position]));
    standings.forEach((s) => {
      s.previousPosition = priorPosByTeam.get(s.team.id) ?? s.position;
    });
  }

  return standings;
}

// Internal helper used only to derive "previous position" — takes an
// already-filtered list of completed fixtures instead of the full set.
function computeStandingsFromPlayed(teams: Team[], playedSorted: Fixture[]): Standing[] {
  return computeStandings(teams, playedSorted);
}

function sortStandings(standings: Standing[]) {
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.name.localeCompare(b.team.name);
  });
}

export function pointsPerGame(points: number, played: number): number {
  return played === 0 ? 0 : points / played;
}

export function goalDifferencePerGame(gd: number, played: number): number {
  return played === 0 ? 0 : gd / played;
}

export function goalsPerGame(goalsFor: number, played: number): number {
  return played === 0 ? 0 : goalsFor / played;
}

export function concededPerGame(goalsAgainst: number, played: number): number {
  return played === 0 ? 0 : goalsAgainst / played;
}

export function winPercentage(wins: number, played: number): number {
  return played === 0 ? 0 : (wins / played) * 100;
}

export function cleanSheetPercentage(cleanSheets: number, played: number): number {
  return played === 0 ? 0 : (cleanSheets / played) * 100;
}

/** Form points from the standard 3/1/0 scoring, over whatever slice of
 * `form` is passed in (typically the last five results). */
export function formPoints(form: FormResult[]): number {
  return form.reduce((sum, r) => sum + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
}

export function cleanSheetsForTeam(teamId: string, fixtures: Fixture[]): number {
  return fixtures.filter((f) => {
    if (f.status !== 'full_time') return false;
    if (f.homeTeam.id === teamId) return (f.awayScore ?? 0) === 0;
    if (f.awayTeam.id === teamId) return (f.homeScore ?? 0) === 0;
    return false;
  }).length;
}
