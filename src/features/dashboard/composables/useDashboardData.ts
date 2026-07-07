/**
 * Dashboard 特性 — 组合式函数
 * 封装数据加载、自动刷新、生命周期管理
 */

import { onMounted, onUnmounted, computed } from 'vue'
import { useDashboardStore } from '../stores/dashboardStore'
import { appConfig } from '@/config/app.config'
import { logger } from '@/logging'

export function useDashboardData() {
  const store = useDashboardStore()
  let refreshTimer: ReturnType<typeof setInterval> | null = null

  /** 概览指标 */
  const overview = computed(() => store.data?.overview ?? null)
  const trends = computed(() => store.data?.trends ?? null)
  const categories = computed(() => store.data?.categories ?? [])
  const regions = computed(() => store.data?.regions ?? [])
  const realtimeLogs = computed(() => store.data?.realtimeLogs ?? [])

  async function load() {
    logger.debug('useDashboardData', '加载大屏数据')
    await store.fetchData()
  }

  function startAutoRefresh() {
    const interval = appConfig.dashboardRefreshInterval
    if (interval > 0) {
      refreshTimer = setInterval(() => {
        store.fetchData()
      }, interval)
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
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    lastUpdated: computed(() => store.lastUpdated),
    overview,
    trends,
    categories,
    regions,
    realtimeLogs,
    refresh: load,
  }
}
