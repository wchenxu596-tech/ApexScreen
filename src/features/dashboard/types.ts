/**
 * Dashboard 特性 — 类型定义
 * 教学数据中心 16:9 大屏数据模型
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
  orders: number
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

/** 中枢节点 — 中心态势的周边业务 */
export interface HubNode {
  name: string
  value: number
  unit: string
  status: 'success' | 'warning' | 'danger'
  desc: string
}

/** 中心态势总览 */
export interface CenterOverview {
  hubName: string
  hubSubtitle: string
  nodes: HubNode[]
  summary: string
}

/** 实时动态 */
export interface RealtimeLog {
  id: string
  type: 'log' | 'alert'
  user: string
  action: string
  detail: string
  time: string
  status: 'success' | 'pending' | 'warning' | 'failed'
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
