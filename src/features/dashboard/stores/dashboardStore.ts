/**
 * Dashboard 特性 — Pinia 状态管理
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardService } from '../services/dashboardService'
import { logger } from '@/logging'
import type { DashboardData } from '../types'

export const useDashboardStore = defineStore('dashboard', () => {
  // ─── 状态 ───
  const data = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<string | null>(null)

  // ─── 计算属性 ───
  // （Composition API 风格的 getter，直接用 computed 或箭头函数）

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
    // 状态
    data,
    loading,
    error,
    lastUpdated,
    // 操作
    fetchData,
    clearError,
  }
})
