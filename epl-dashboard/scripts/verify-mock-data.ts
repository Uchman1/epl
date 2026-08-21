import { MOCK_TEAMS } from '../src/data/mock/teams';
import { MOCK_FIXTURES, getCurrentMatchweek, MOCK_TODAY } from '../src/data/mock/fixtures';
import { MOCK_PLAYERS } from '../src/data/mock/players';
import { computeStandings } from '../src/utils/calculations';

console.log('=== Teams ===');
console.log('Team count:', MOCK_TEAMS.length);

console.log('\n=== Fixtures ===');
console.log('Total fixtures:', MOCK_FIXTURES.length, '(expect 380)');
console.log('Mock "today":', MOCK_TODAY.toISOString());
console.log('Current matchweek:', getCurrentMatchweek());

const statusCounts = MOCK_FIXTURES.reduce<Record<string, number>>((acc, f) => {
  acc[f.status] = (acc[f.status] ?? 0) + 1;
  return acc;
}, {});
console.log('Status breakdown:', statusCounts);

const live = MOCK_FIXTURES.filter((f) => f.status === 'live');
console.log('\nLive matches:', live.length);
live.forEach((f) =>
  console.log(
    `  ${f.homeTeam.shortName} ${f.homeScore}-${f.awayScore} ${f.awayTeam.shortName} (min ${f.minute}, ${f.date})`
  )
);

const todayRef = live[0]?.date ?? MOCK_FIXTURES.find((f) => f.status === 'scheduled')?.date;
const todayDay = todayRef ? new Date(todayRef).toDateString() : null;
const todayMatches = MOCK_FIXTURES.filter((f) => todayDay && new Date(f.date).toDateString() === todayDay);
console.log(`\nToday's matches (${todayDay}):`, todayMatches.length);
todayMatches.forEach((f) =>
  console.log(`  [${f.status}] ${f.homeTeam.shortName} vs ${f.awayTeam.shortName} @ ${f.date}`)
);

console.log('\n=== Standings ===');
const standings = computeStandings(MOCK_TEAMS, MOCK_FIXTURES);
console.log('Standings rows:', standings.length, '(expect 20)');
console.log('Sum of "played" should be even (round numbers):', standings.reduce((s, x) => s + x.played, 0));
standings.slice(0, 6).forEach((s) =>
  console.log(
    `  ${String(s.position).padStart(2)}. ${s.team.shortName.padEnd(14)} P${s.played} W${s.wins} D${s.draws} L${s.losses} GD${s.goalDifference} Pts${s.points} Form:${s.form.join('')}`
  )
);
console.log('  ...');
standings.slice(-3).forEach((s) =>
  console.log(
    `  ${String(s.position).padStart(2)}. ${s.team.shortName.padEnd(14)} P${s.played} W${s.wins} D${s.draws} L${s.losses} GD${s.goalDifference} Pts${s.points} Form:${s.form.join('')}`
  )
);

// Sanity: points should be sorted descending, positions 1..20 unique
const pointsDesc = standings.every((s, i) => i === 0 || standings[i - 1].points >= s.points);
const positionsOk = standings.every((s, i) => s.position === i + 1);
console.log('\nPoints sorted descending:', pointsDesc);
console.log('Positions sequential 1..20:', positionsOk);

console.log('\n=== Players ===');
console.log('Total players:', MOCK_PLAYERS.length, '(expect 360 = 18 x 20)');
const topScorers = [...MOCK_PLAYERS].sort((a, b) => b.goals - a.goals).slice(0, 5);
console.log('Top scorers:');
topScorers.forEach((p) => console.log(`  ${p.name} (${p.team.shortName}) - ${p.goals}g ${p.assists}a`));

console.log('\nAll checks executed without throwing.');
