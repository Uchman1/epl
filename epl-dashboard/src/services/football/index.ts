import type { FootballDataProvider } from './FootballDataProvider';
import { MockFootballProvider } from './MockFootballProvider';

export type { FootballDataProvider } from './FootballDataProvider';
export { FootballDataError } from './FootballDataProvider';

// VITE_DATA_PROVIDER=mock (default) | api
// When a real EPL data vendor is connected, add:
//   import { ApiFootballProvider } from './ApiFootballProvider';
// and return it here for the 'api' case. No page or component needs to
// change — they all depend on the FootballDataProvider interface only.
function createProvider(): FootballDataProvider {
  const kind = import.meta.env?.VITE_DATA_PROVIDER ?? 'mock';
  switch (kind) {
    case 'mock':
    default:
      return new MockFootballProvider();
  }
}

export const footballService: FootballDataProvider = createProvider();
export const isMockData = (import.meta.env?.VITE_DATA_PROVIDER ?? 'mock') === 'mock';
