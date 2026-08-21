/**
 * Circle-method round robin scheduler. For n=20 teams this produces 19
 * rounds of 10 matches (everyone plays once), which we run twice — the
 * second pass with home/away reversed — to build a standard 38-matchweek
 * EPL season.
 */
export function buildRoundRobin(teamIds: string[]): [string, string][][] {
  const arr = teamIds.slice();
  const n = arr.length;
  const numRounds = n - 1;
  const half = n / 2;
  const rounds: [string, string][][] = [];

  for (let r = 0; r < numRounds; r++) {
    const round: [string, string][] = [];
    for (let i = 0; i < half; i++) {
      const t1 = arr[i];
      const t2 = arr[n - 1 - i];
      // Alternate which side is "home" per pairing slot & round parity so
      // home fixtures don't cluster on the same team across early rounds.
      if ((r + i) % 2 === 0) round.push([t1, t2]);
      else round.push([t2, t1]);
    }
    rounds.push(round);
    const fixed = arr[0];
    const rest = arr.slice(1);
    rest.unshift(rest.pop()!);
    arr.splice(0, arr.length, fixed, ...rest);
  }
  return rounds;
}

export function buildFullSeason(teamIds: string[]): [string, string][][] {
  const firstHalf = buildRoundRobin(teamIds);
  const secondHalf = firstHalf.map((round) =>
    round.map(([home, away]) => [away, home] as [string, string])
  );
  return [...firstHalf, ...secondHalf];
}
