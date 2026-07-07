/**
 * DashboardService 单元测试
 * 验证数据服务能够正确获取 Mock 数据
 */

import { describe, it, expect } from 'vitest'
import { dashboardService } from '../services/dashboardService'

describe('DashboardService', () => {
  it('应该能成功获取大屏数据', async () => {
    const data = await dashboardService.fetchDashboardData()

    expect(data).toBeDefined()
    expect(data.overview).toBeDefined()
    expect(data.overview.totalUsers).toBeGreaterThan(0)
    expect(data.overview.activeUsers).toBeGreaterThan(0)
    expect(data.overview.totalRevenue).toBeGreaterThan(0)

    expect(data.trends).toBeDefined()
    expect(data.trends.users.length).toBeGreaterThan(0)
    expect(data.trends.revenue.length).toBeGreaterThan(0)

    expect(data.regions.length).toBeGreaterThan(0)
    expect(data.categories.length).toBeGreaterThan(0)
    expect(data.realtimeLogs.length).toBeGreaterThan(0)
    expect(data.updatedAt).toBeDefined()
  })

  it('返回的实时日志应包含正确的字段', async () => {
    const data = await dashboardService.fetchDashboardData()
    const log = data.realtimeLogs[0]

    expect(log).toHaveProperty('id')
    expect(log).toHaveProperty('action')
    expect(log).toHaveProperty('user')
    expect(log).toHaveProperty('amount')
    expect(log).toHaveProperty('time')
    expect(log).toHaveProperty('status')
    expect(['success', 'pending', 'failed']).toContain(log.status)
  })

  it('健康检查应返回 true', async () => {
    const healthy = await dashboardService.healthCheck()
    expect(healthy).toBe(true)
  })
})
