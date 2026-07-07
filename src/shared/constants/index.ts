/**
 * 全局常量
 */

// ─── 大屏相关 ───
export const DASHBOARD_TITLE = '巅峰数据大屏'
export const DASHBOARD_COLUMNS = 12
export const DASHBOARD_ROW_HEIGHT = 60
export const DASHBOARD_REFRESH_INTERVAL = 5000
export const DASHBOARD_ANIMATION_DURATION = 300

// ─── 状态颜色 ───
export const STATUS_COLORS = {
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#60a5fa',
} as const

// ─── 图表颜色 ───
export const CHART_COLORS = [
  '#60a5fa',
  '#34d399',
  '#fbbf24',
  '#a78bfa',
  '#f87171',
  '#38bdf8',
  '#fb923c',
  '#e879f9',
] as const

// ─── 分页 ───
export const PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
