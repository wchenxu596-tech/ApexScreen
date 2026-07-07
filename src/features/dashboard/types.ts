/**
 * Dashboard 特性 — 类型定义
 * 所有与大屏相关的数据类型集中管理
 */

/** 概览指标 */
export interface OverviewMetrics {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  conversionRate: number
  userGrowth: number
  revenueGrowth: number
}

/** 时间序列数据点 */
export interface TimeSeriesPoint {
  time: string
  value: number
}

/** 分类数据 */
export interface CategoryData {
  name: string
  value: number
}

/** 区域数据 */
export interface RegionData {
  name: string
  value: number
}

/** 实时日志 */
export interface RealtimeLog {
  id: string
  action: string
  user: string
  amount: number
  time: string
  status: 'success' | 'pending' | 'failed'
}

/** 大屏主数据模型 */
export interface DashboardData {
  overview: OverviewMetrics
  trends: {
    users: TimeSeriesPoint[]
    revenue: TimeSeriesPoint[]
  }
  categories: CategoryData[]
  regions: RegionData[]
  realtimeLogs: RealtimeLog[]
  updatedAt: string
}

/** Dashboard 组件 Props */
export interface DashboardWidgetProps {
  title: string
  loading?: boolean
  span?: number
  height?: number
}
