/**
 * Dashboard 特性 — 组合式函数
 * 封装数据加载、自动刷新、生命周期管理
 */

import { onMounted, onUnmounted, computed } from 'vue'
import { useDashboardStore } from '../stores/dashboardStore'
import { appConfig } from '@/config/app.config'
import { logger } from '@/logging'
import type {
  KPIMetric,
  AccessTrendPoint,
  CategoryShare,
  CityRank,
  RadarModelData,
  CenterOverview,
  RealtimeLog,
} from '../types'

export function useDashboardData() {
  const store = useDashboardStore()
  let refreshTimer: ReturnType<typeof setInterval> | null = null

  const loading = computed(() => store.loading)
  const error = computed(() => store.error)
  const lastUpdated = computed(() => store.lastUpdated)
  const kpis = computed<KPIMetric[]>(() => store.kpis)
  const accessTrend = computed<AccessTrendPoint[]>(() => store.accessTrend)
  const categoryShares = computed<CategoryShare[]>(() => store.categoryShares)
  const cityRanking = computed<CityRank[]>(() => store.cityRanking)
  const radarModel = computed<RadarModelData | null>(() => store.radarModel)
  const centerOverview = computed<CenterOverview | null>(() => store.centerOverview)
  const realtimeLogs = computed<RealtimeLog[]>(() => store.realtimeLogs)

  async function load() {
    logger.debug('useDashboardData', '加载大屏数据')
    await store.fetchData()
  }

  function startAutoRefresh() {
    const interval = appConfig.dashboardRefreshInterval
    if (interval > 0) {
      refreshTimer = setInterval(() => store.fetchData(), interval)
      logger.info('useDashboardData', '自动刷新已启动', { interval })
    }
  }

  function stopAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  onMounted(() => {
    load()
    startAutoRefresh()
  })
  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    loading,
    error,
    lastUpdated,
    kpis,
    accessTrend,
    categoryShares,
    cityRanking,
    radarModel,
    centerOverview,
    realtimeLogs,
    refresh: load,
  }
}
