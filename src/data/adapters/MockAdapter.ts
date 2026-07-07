/**
 * 🔄 Mock 数据适配器
 * 开发阶段使用本地模拟数据，无需后端
 */

import { BaseAdapter } from './BaseAdapter'
import { mockDashboardData } from '@/data/mock/dashboard'
import type { DashboardData } from '@/features/dashboard/types'

export class MockAdapter extends BaseAdapter {
  async getDashboardData(): Promise<DashboardData> {
    await this.simulateDelay(300, 800)
    return mockDashboardData()
  }

  async healthCheck(): Promise<boolean> {
    await this.simulateDelay(100, 200)
    return true
  }
}
