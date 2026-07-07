/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_DATA_SOURCE: 'mock' | 'api' | 'mixed'
  readonly VITE_API_BASE_URL: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_REALTIME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
