/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_PROVIDER?: 'mock' | 'api';
  readonly VITE_FOOTBALL_API_URL?: string;
  readonly VITE_FOOTBALL_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
