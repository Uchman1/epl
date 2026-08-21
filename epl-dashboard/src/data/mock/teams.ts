import type { Team } from '@/types/football';

/**
 * Mock EPL club roster for the 2026/27 season.
 * Crest colors are used to render generated badge initials in place of a
 * real logo image, until a data provider supplies one.
 *
 * `strength` is a mock-only internal rating (not part of the Team type)
 * used purely to bias the deterministic scoreline generator toward
 * plausible results — it is never displayed in the UI.
 */
export const MOCK_TEAM_STRENGTH: Record<string, number> = {
  arsenal: 91,
  'aston-villa': 78,
  bournemouth: 72,
  brentford: 74,
  brighton: 77,
  burnley: 68,
  chelsea: 85,
  'crystal-palace': 76,
  everton: 71,
  fulham: 73,
  liverpool: 92,
  'manchester-city': 93,
  'manchester-united': 82,
  newcastle: 84,
  'nottingham-forest': 75,
  'sheffield-united': 66,
  sunderland: 67,
  tottenham: 83,
  'west-ham': 74,
  wolves: 70,
};

export const MOCK_TEAMS: Team[] = [
  { id: 'arsenal', name: 'Arsenal', shortName: 'Arsenal', tla: 'ARS', crestColor: '#EF0107', stadium: 'Emirates Stadium', city: 'London', manager: 'M. Arteta', founded: 1886 },
  { id: 'aston-villa', name: 'Aston Villa', shortName: 'Aston Villa', tla: 'AVL', crestColor: '#670E36', stadium: 'Villa Park', city: 'Birmingham', manager: 'U. Emery', founded: 1874 },
  { id: 'bournemouth', name: 'AFC Bournemouth', shortName: 'Bournemouth', tla: 'BOU', crestColor: '#DA291C', stadium: 'Vitality Stadium', city: 'Bournemouth', manager: 'A. Iraola', founded: 1899 },
  { id: 'brentford', name: 'Brentford', shortName: 'Brentford', tla: 'BRE', crestColor: '#D20000', stadium: 'Gtech Community Stadium', city: 'London', manager: 'K. Frank', founded: 1889 },
  { id: 'brighton', name: 'Brighton & Hove Albion', shortName: 'Brighton', tla: 'BHA', crestColor: '#0057B8', stadium: 'Falmer Stadium', city: 'Brighton', manager: 'F. Hurzeler', founded: 1901 },
  { id: 'burnley', name: 'Burnley', shortName: 'Burnley', tla: 'BUR', crestColor: '#6C1D45', stadium: 'Turf Moor', city: 'Burnley', manager: 'S. Parker', founded: 1882 },
  { id: 'chelsea', name: 'Chelsea', shortName: 'Chelsea', tla: 'CHE', crestColor: '#034694', stadium: 'Stamford Bridge', city: 'London', manager: 'E. Maresca', founded: 1905 },
  { id: 'crystal-palace', name: 'Crystal Palace', shortName: 'Crystal Palace', tla: 'CRY', crestColor: '#1B458F', stadium: 'Selhurst Park', city: 'London', manager: 'O. Glasner', founded: 1905 },
  { id: 'everton', name: 'Everton', shortName: 'Everton', tla: 'EVE', crestColor: '#003399', stadium: 'Hill Dickinson Stadium', city: 'Liverpool', manager: 'D. Moyes', founded: 1878 },
  { id: 'fulham', name: 'Fulham', shortName: 'Fulham', tla: 'FUL', crestColor: '#000000', stadium: 'Craven Cottage', city: 'London', manager: 'M. Silva', founded: 1879 },
  { id: 'liverpool', name: 'Liverpool', shortName: 'Liverpool', tla: 'LIV', crestColor: '#C8102E', stadium: 'Anfield', city: 'Liverpool', manager: 'A. Slot', founded: 1892 },
  { id: 'manchester-city', name: 'Manchester City', shortName: 'Man City', tla: 'MCI', crestColor: '#6CABDD', stadium: 'Etihad Stadium', city: 'Manchester', manager: 'P. Guardiola', founded: 1880 },
  { id: 'manchester-united', name: 'Manchester United', shortName: 'Man United', tla: 'MUN', crestColor: '#DA291C', stadium: 'Old Trafford', city: 'Manchester', manager: 'R. Amorim', founded: 1878 },
  { id: 'newcastle', name: 'Newcastle United', shortName: 'Newcastle', tla: 'NEW', crestColor: '#241F20', stadium: "St James' Park", city: 'Newcastle', manager: 'E. Howe', founded: 1892 },
  { id: 'nottingham-forest', name: 'Nottingham Forest', shortName: "Nott'm Forest", tla: 'NFO', crestColor: '#DD0000', stadium: 'The City Ground', city: 'Nottingham', manager: 'A. Postecoglou', founded: 1865 },
  { id: 'sheffield-united', name: 'Sheffield United', shortName: 'Sheffield Utd', tla: 'SHU', crestColor: '#EE2737', stadium: 'Bramall Lane', city: 'Sheffield', manager: 'C. Wilder', founded: 1889 },
  { id: 'sunderland', name: 'Sunderland', shortName: 'Sunderland', tla: 'SUN', crestColor: '#E21C21', stadium: 'Stadium of Light', city: 'Sunderland', manager: 'R. Le Bris', founded: 1879 },
  { id: 'tottenham', name: 'Tottenham Hotspur', shortName: 'Spurs', tla: 'TOT', crestColor: '#132257', stadium: 'Tottenham Hotspur Stadium', city: 'London', manager: 'T. Frank', founded: 1882 },
  { id: 'west-ham', name: 'West Ham United', shortName: 'West Ham', tla: 'WHU', crestColor: '#7A263A', stadium: 'London Stadium', city: 'London', manager: 'G. Potter', founded: 1895 },
  { id: 'wolves', name: 'Wolverhampton Wanderers', shortName: 'Wolves', tla: 'WOL', crestColor: '#FDB913', stadium: 'Molineux Stadium', city: 'Wolverhampton', manager: 'V. Pereira', founded: 1877 },
];

export function getTeamById(id: string): Team | undefined {
  return MOCK_TEAMS.find((t) => t.id === id);
}
