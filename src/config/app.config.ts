/**
 * 应用配置
 * 非敏感的业务配置集中管理
 */
import { env } from './env'

export const appConfig = {
  /** 大屏刷新间隔（毫秒） */
  dashboardRefreshInterval: env.realtime ? 5000 : 0,

  /** 大屏网格列数 */
  dashboardColumns: 12,

  /** 大屏网格行高 */
  dashboardRowHeight: 60,

  /** 动画开关 */
  animation: {
    enabled: true,
    duration: 300,
  },

  /** 请求超时（毫秒） */
  requestTimeout: 10000,

  /** 日志采样率（0-1） */
  logSampleRate: env.isProduction ? 0.1 : 1,
} as const
