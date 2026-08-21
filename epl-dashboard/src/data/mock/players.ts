import type { Player, PlayerPosition } from '@/types/football';
import { MOCK_TEAMS } from './teams';
import { getCurrentMatchweek } from './fixtures';
import { SeededRandom } from '@/utils/seededRandom';

const rng = new SeededRandom(4471);

const FIRST_NAMES = [
  'Marcus', 'Kai', 'Luca', 'Idris', 'Theo', 'Bruno', 'Mateus', 'Youssef', 'Declan',
  'Callum', 'Rasmus', 'Emeka', 'Jonas', 'Andrei', 'Pape', 'Finn', 'Noah', 'Elias',
  'Malick', 'Tomás', 'Viktor', 'Cole', 'Amari', 'Bilal', 'Sasha', 'Diego', 'Jamie',
  'Kofi', 'Lars', 'Milo',
];
const LAST_NAMES = [
  'Whitfield', 'Kovac', 'Nwosu', 'Larsson', 'Reyes', 'Adeyemi', 'Bergstrom', 'Okafor',
  'Marchetti', 'Sinclair', 'Ferreira', 'Dubois', 'Halvorsen', 'Osei', 'Camara', 'Pruszkowski',
  'Doyle', 'Vandenberg', 'Silveira', 'Achterberg', 'Mensah', 'Roskam', 'Traoré', 'Lindqvist',
];
const NATIONALITIES = [
  'England', 'France', 'Brazil', 'Nigeria', 'Netherlands', 'Portugal', 'Senegal',
  'Argentina', 'Norway', 'Belgium', 'Ghana', 'Poland', 'Denmark', 'Spain', 'Sweden',
];

function generateName(rng: SeededRandom): string {
  return `${rng.pick(FIRST_NAMES)} ${rng.pick(LAST_NAMES)}`;
}

const SQUAD_TEMPLATE: { position: PlayerPosition; count: number }[] = [
  { position: 'GK', count: 2 },
  { position: 'DEF', count: 6 },
  { position: 'MID', count: 6 },
  { position: 'FWD', count: 4 },
];

function buildPlayers(): Player[] {
  const players: Player[] = [];
  const matchesSoFar = Math.max(0, getCurrentMatchweek() - 1);

  for (const team of MOCK_TEAMS) {
    let idx = 0;
    for (const group of SQUAD_TEMPLATE) {
      for (let i = 0; i < group.count; i++) {
        idx++;
        const isStarter = idx <= 11;
        const appearances = isStarter
          ? matchesSoFar
          : rng.int(0, matchesSoFar);
        const minutes = appearances * rng.int(55, 90);

        let goals = 0;
        let assists = 0;
        let cleanSheets: number | undefined;
        let saves: number | undefined;

        if (group.position === 'FWD') {
          goals = rng.int(0, appearances) + (rng.next() > 0.6 ? rng.int(0, 1) : 0);
          assists = rng.int(0, Math.ceil(appearances / 2));
        } else if (group.position === 'MID') {
          goals = rng.next() > 0.5 ? rng.int(0, Math.ceil(appearances / 2)) : 0;
          assists = rng.int(0, appearances);
        } else if (group.position === 'DEF') {
          goals = rng.next() > 0.85 ? 1 : 0;
          assists = rng.next() > 0.7 ? rng.int(0, 1) : 0;
          cleanSheets = rng.int(0, appearances);
        } else {
          cleanSheets = rng.int(0, appearances);
          saves = appearances * rng.int(1, 5);
        }

        players.push({
          id: `${team.id}-p${idx}`,
          name: generateName(rng),
          team,
          position: group.position,
          nationality: rng.pick(NATIONALITIES),
          appearances,
          minutes,
          goals,
          assists,
          yellowCards: rng.next() > 0.75 ? rng.int(1, 2) : 0,
          redCards: rng.next() > 0.97 ? 1 : 0,
          cleanSheets,
          saves,
        });
      }
    }
  }
  return players;
}

export const MOCK_PLAYERS: Player[] = buildPlayers();
