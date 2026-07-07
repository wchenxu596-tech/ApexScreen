/**
 * 环境配置管理
 * 统一读取 VITE_ 环境变量，提供类型安全的访问
 */

export const env = {
  /** 应用标题 */
  appTitle: import.meta.env.VITE_APP_TITLE || '巅峰数据大屏',

  /** 数据源: mock | api | mixed */
  dataSource: (import.meta.env.VITE_DATA_SOURCE as 'mock' | 'api' | 'mixed') || 'mock',

  /** API 基础地址 */
  apiBaseURL: import.meta.env.VITE_API_BASE_URL || '/api',

  /** 日志级别: debug | info | warn | error */
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'debug',

  /** 是否启用实时刷新 */
  realtime: import.meta.env.VITE_REALTIME === 'true',

  /** 是否为生产环境 */
  isProduction: import.meta.env.PROD,

  /** 是否为开发环境 */
  isDevelopment: import.meta.env.DEV,
} as const
