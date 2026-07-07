/**
 * DashboardService 单元测试
 * 验证数据服务能够正确获取 Mock 数据（新 16:9 数据模型）
 */

import { describe, it, expect } from 'vitest'
import { dashboardService } from '../services/dashboardService'

describe('DashboardService', () => {
  it('应该能成功获取大屏数据（新 16:9 模型）', async () => {
    const data = await dashboardService.fetchDashboardData()

    expect(data).toBeDefined()

    // KPI 指标
    expect(data.kpis).toBeDefined()
    expect(data.kpis.length).toBeGreaterThan(0)
    expect(data.kpis[0]).toHaveProperty('label')
    expect(data.kpis[0]).toHaveProperty('value')
    expect(data.kpis[0]).toHaveProperty('color')

    // 访问趋势
    expect(data.accessTrend).toBeDefined()
    expect(data.accessTrend.length).toBeGreaterThan(0)
    expect(data.accessTrend[0]).toHaveProperty('time')
    expect(data.accessTrend[0]).toHaveProperty('visits')

    // 分类占比
    expect(data.categoryShares).toBeDefined()
    expect(data.categoryShares.length).toBeGreaterThan(0)

    // 城市排名
    expect(data.cityRanking).toBeDefined()
    expect(data.cityRanking.length).toBeGreaterThan(0)

    // 雷达模型
    expect(data.radarModel).toBeDefined()
    expect(data.radarModel.indicators.length).toBeGreaterThan(0)
    expect(data.radarModel.series.length).toBeGreaterThan(0)

    // 中心态势
    expect(data.centerOverview).toBeDefined()
    expect(data.centerOverview.hubName).toBe('巅峰中枢')
    expect(data.centerOverview.nodes.length).toBeGreaterThan(0)

    // 实时日志
    expect(data.realtimeLogs.length).toBeGreaterThan(0)
    expect(data.updatedAt).toBeDefined()
  })

  it('返回的实时日志应包含正确的字段', async () => {
    const data = await dashboardService.fetchDashboardData()
    const log = data.realtimeLogs[0]

    expect(log).toHaveProperty('id')
    expect(log).toHaveProperty('action')
    expect(log).toHaveProperty('user')
    expect(log).toHaveProperty('detail')
    expect(log).toHaveProperty('time')
    expect(log).toHaveProperty('status')
    expect(['success', 'pending', 'failed']).toContain(log.status)
  })

  it('城市排名应包含正确字段', async () => {
    const data = await dashboardService.fetchDashboardData()
    const city = data.cityRanking[0]

    expect(city).toHaveProperty('city')
    expect(city).toHaveProperty('value')
    expect(city).toHaveProperty('growth')
    expect(city.value).toBeGreaterThan(0)
  })

  it('健康检查应返回 true', async () => {
    const healthy = await dashboardService.healthCheck()
    expect(healthy).toBe(true)
  })
})
