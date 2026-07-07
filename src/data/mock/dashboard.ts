/**
 * Mock 大屏数据
 * 生成示例大屏数据，涵盖各类图表和指标
 */

import { faker } from '@faker-js/faker/locale/zh_CN'
import { randomInt, randomFloat, generateTimeSeries } from './generators'
import type { DashboardData } from '@/features/dashboard/types'

export function mockDashboardData(): DashboardData {
  return {
    // 顶部概览指标
    overview: {
      totalUsers: randomInt(120000, 180000),
      activeUsers: randomInt(45000, 65000),
      totalRevenue: randomFloat(880, 1200, 2),
      conversionRate: randomFloat(2.5, 5.8, 1),
      userGrowth: randomFloat(-5, 15, 1),
      revenueGrowth: randomFloat(3, 12, 1),
    },

    // 趋势数据
    trends: {
      users: generateTimeSeries(24, { trend: 'up' }),
      revenue: generateTimeSeries(24, { trend: 'volatile' }),
    },

    // 分类数据
    categories: [
      { name: '技术研发', value: randomInt(25, 35) },
      { name: '市场营销', value: randomInt(15, 25) },
      { name: '运营管理', value: randomInt(10, 20) },
      { name: '客户服务', value: randomInt(8, 15) },
      { name: '产品设计', value: randomInt(5, 12) },
    ],

    // 地理分布
    regions: [
      { name: '华北', value: randomInt(8000, 15000) },
      { name: '华东', value: randomInt(12000, 20000) },
      { name: '华南', value: randomInt(10000, 18000) },
      { name: '西南', value: randomInt(4000, 8000) },
      { name: '西北', value: randomInt(2000, 5000) },
    ],

    // 实时数据列表
    realtimeLogs: Array.from({ length: 8 }, () => ({
      id: faker.string.uuid().slice(0, 8),
      action: faker.helpers.arrayElement(['登录', '下单', '注册', '退款', '咨询']),
      user: faker.person.fullName(),
      amount: randomFloat(10, 9999, 2),
      time: new Date().toLocaleTimeString('zh-CN'),
      status: faker.helpers.arrayElement(['success', 'pending', 'failed'] as const),
    })),

    // 更新元信息
    updatedAt: new Date().toISOString(),
  }
}
