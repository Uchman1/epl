import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

// Wire up a minimal browser-like global environment before importing any
// app code (React/react-dom/router all check for `window` at import time).
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
});
(globalThis as any).HTMLElement = dom.window.HTMLElement;
(globalThis as any).localStorage = dom.window.localStorage;

if (!dom.window.matchMedia) {
  dom.window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

// Silences a benign jsdom/act() environment-detection warning that isn't a
// real bug — just Node not being flagged as a React "act environment".
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const consoleErrors: unknown[][] = [];
const originalError = console.error;
console.error = (...args: unknown[]) => {
  consoleErrors.push(args);
  originalError(...args);
};

async function main() {
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { act } = await import('react');
  const { MemoryRouter, Routes, Route } = await import('react-router-dom');
  const { QueryClient, QueryClientProvider } = await import('@tanstack/react-query');
  const { ThemeProvider } = await import('../src/layouts/ThemeProvider');
  const { AppShell } = await import('../src/layouts/AppShell');
  const { Dashboard } = await import('../src/pages/Dashboard');
  const { Matches } = await import('../src/pages/Matches');
  const { StandingsPage } = await import('../src/pages/Standings');
  const { Teams } = await import('../src/pages/Teams');
  const { TeamDetail } = await import('../src/pages/TeamDetail');
  const { Players } = await import('../src/pages/Players');
  const { Analytics } = await import('../src/pages/Analytics');
  const { Compare } = await import('../src/pages/Compare');
  const { Settings } = await import('../src/pages/Settings');
  const { NotFound } = await import('../src/pages/NotFound');
  const { MOCK_TEAMS } = await import('../src/data/mock/teams');

  const routesToTest = [
    '/',
    '/matches',
    '/table',
    '/teams',
    `/teams/${MOCK_TEAMS[0].id}`,
    '/players',
    '/analytics',
    '/compare',
    '/settings',
    '/does-not-exist',
  ];

  for (const path of routesToTest) {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          React.createElement(
            ThemeProvider,
            null,
            React.createElement(
              MemoryRouter,
              { initialEntries: [path] },
              React.createElement(
                AppShell,
                null,
                React.createElement(
                  Routes,
                  null,
                  React.createElement(Route, { path: '/', element: React.createElement(Dashboard) }),
                  React.createElement(Route, { path: '/matches', element: React.createElement(Matches) }),
                  React.createElement(Route, { path: '/table', element: React.createElement(StandingsPage) }),
                  React.createElement(Route, { path: '/teams', element: React.createElement(Teams) }),
                  React.createElement(Route, { path: '/teams/:teamId', element: React.createElement(TeamDetail) }),
                  React.createElement(Route, { path: '/players', element: React.createElement(Players) }),
                  React.createElement(Route, { path: '/analytics', element: React.createElement(Analytics) }),
                  React.createElement(Route, { path: '/compare', element: React.createElement(Compare) }),
                  React.createElement(Route, { path: '/settings', element: React.createElement(Settings) }),
                  React.createElement(Route, { path: '*', element: React.createElement(NotFound) })
                )
              )
            )
          )
        )
      );
      // Allow React Query's simulated-latency mock fetches to resolve.
      await new Promise((r) => setTimeout(r, 600));
    });

    const hasContent = container.textContent && container.textContent.trim().length > 0;
    console.log(`[route] ${path.padEnd(24)} rendered=${Boolean(hasContent)} chars=${container.textContent?.length ?? 0}`);

    root.unmount();
    container.remove();
  }

  console.log('\n--- Summary ---');
  console.log('Routes tested:', routesToTest.length);
  console.log('console.error calls captured:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e, i) => console.log(`  #${i + 1}:`, ...e));
    process.exitCode = 1;
  } else {
    console.log('No console errors during render. ✅');
  }
}

main().catch((err) => {
  console.error('FATAL during smoke test:', err);
  process.exitCode = 1;
}).finally(() => {
  // React Query's gcTime and other internal timers keep Node's event loop
  // alive indefinitely — force exit once all routes have been checked.
  process.exit(process.exitCode ?? 0);
});
