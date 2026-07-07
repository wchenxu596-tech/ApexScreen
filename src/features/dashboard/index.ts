/**
 * Dashboard 特性模块 — 入口
 * 统一导出供外部使用
 */

export { useDashboardStore } from './stores/dashboardStore'
export { useDashboardData } from './composables/useDashboardData'
export { dashboardService } from './services/dashboardService'
export type * from './types'
