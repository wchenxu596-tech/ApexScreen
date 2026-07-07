/**
 * Dashboard 特性 — 类型定义
 * 16:9 教学大屏完整数据模型
 */

/** 顶部 KPI 指标 */
export interface KPIMetric {
  label: string
  value: number
  unit?: string
  prefix?: string
  trend?: number
  trendLabel?: string
  color: string
}

/** 访问趋势数据点 */
export interface AccessTrendPoint {
  time: string
  visits: number
  uniqueVisitors: number
}

/** 分类占比 */
export interface CategoryShare {
  name: string
  value: number
}

/** 城市排名 */
export interface CityRank {
  city: string
  value: number
  growth: number
}

/** 雷达模型 — 单个维度 */
export interface RadarDimension {
  name: string
  max: number
}

/** 雷达模型 — 完整数据 */
export interface RadarModelData {
  indicators: RadarDimension[]
  series: {
    name: string
    value: number[]
  }[]
}

/** 中心态势 — 核心指标 */
export interface CenterMetric {
  label: string
  value: number
  unit: string
  status?: 'success' | 'warning' | 'danger'
  progress?: number
}

/** 中心态势总览 */
export interface CenterOverview {
  title: string
  metrics: CenterMetric[]
  summary: string
}

/** 实时日志 */
export interface RealtimeLog {
  id: string
  action: string
  user: string
  detail: string
  time: string
  status: 'success' | 'pending' | 'failed'
}

/** 大屏主数据模型 */
export interface DashboardData {
  kpis: KPIMetric[]
  accessTrend: AccessTrendPoint[]
  categoryShares: CategoryShare[]
  cityRanking: CityRank[]
  radarModel: RadarModelData
  centerOverview: CenterOverview
  realtimeLogs: RealtimeLog[]
  updatedAt: string
}

/** 面板组件 Props */
export interface PanelProps {
  title: string
  loading?: boolean
  className?: string
}
