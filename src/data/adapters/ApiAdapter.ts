/**
 * 🔄 API 数据适配器
 * 连接真实后端 API
 */

import { BaseAdapter } from './BaseAdapter'
import { httpClient } from '@/data/client/http'
import type { DashboardData } from '@/features/dashboard/types'

export class ApiAdapter extends BaseAdapter {
  async getDashboardData(params?: Record<string, unknown>): Promise<DashboardData> {
    const response = await httpClient.get<DashboardData>('/api/dashboard', { params })
    return response.data
  }

  async healthCheck(): Promise<boolean> {
    try {
      await httpClient.get('/api/health')
      return true
    } catch {
      return false
    }
  }
}
