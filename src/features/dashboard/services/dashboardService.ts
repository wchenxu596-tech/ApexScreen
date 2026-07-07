/**
 * Dashboard 特性 — 数据服务
 * 封装数据获取逻辑，上层只关心数据，不关心数据来源
 */

import { useDataAdapter } from '@/data/adapters/useDataAdapter'
import { logger } from '@/logging'
import type { DashboardData } from '../types'

export class DashboardService {
  private adapter = useDataAdapter()

  async fetchDashboardData(): Promise<DashboardData> {
    const startTime = performance.now()

    try {
      const data = await this.adapter.getDashboardData()
      const duration = Math.round(performance.now() - startTime)
      logger.info('DashboardService', '大屏数据加载完成', { duration })
      return data as DashboardData
    } catch (error) {
      logger.error('DashboardService', '大屏数据加载失败', { error })
      throw error
    }
  }

  async healthCheck(): Promise<boolean> {
    return this.adapter.healthCheck()
  }
}

export const dashboardService = new DashboardService()
