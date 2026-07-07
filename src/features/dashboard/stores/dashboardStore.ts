/**
 * Dashboard 特性 — Pinia 状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dashboardService } from '../services/dashboardService'
import { logger } from '@/logging'
import type {
  DashboardData,
  KPIMetric,
  AccessTrendPoint,
  CategoryShare,
  CityRank,
  RadarModelData,
  CenterOverview,
  RealtimeLog,
} from '../types'

export const useDashboardStore = defineStore('dashboard', () => {
  // ─── 状态 ───
  const data = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<string | null>(null)

  // ─── 派生数据 ───
  const kpis = computed<KPIMetric[]>(() => data.value?.kpis ?? [])
  const accessTrend = computed<AccessTrendPoint[]>(() => data.value?.accessTrend ?? [])
  const categoryShares = computed<CategoryShare[]>(() => data.value?.categoryShares ?? [])
  const cityRanking = computed<CityRank[]>(() => data.value?.cityRanking ?? [])
  const radarModel = computed<RadarModelData | null>(() => data.value?.radarModel ?? null)
  const centerOverview = computed<CenterOverview | null>(() => data.value?.centerOverview ?? null)
  const realtimeLogs = computed<RealtimeLog[]>(() => data.value?.realtimeLogs ?? [])
  const hasData = computed(() => data.value !== null)

  // ─── 操作 ───
  async function fetchData() {
    loading.value = true
    error.value = null

    try {
      data.value = await dashboardService.fetchDashboardData()
      lastUpdated.value = data.value.updatedAt
      logger.debug('DashboardStore', '状态已更新')
    } catch (e) {
      const message = e instanceof Error ? e.message : '未知错误'
      error.value = message
      logger.error('DashboardStore', '更新失败', { message })
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    data,
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
    hasData,
    fetchData,
    clearError,
  }
})
