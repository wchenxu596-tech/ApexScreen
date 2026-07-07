/**
 * Mock 大屏数据 — 稳定的教学演示数据
 *
 * 特点：
 * - 所有数据写死（非随机），每次返回一致
 * - 适用于课堂演示、截图、CI 测试
 * - 数据符合真实业务逻辑
 */

import type { DashboardData } from '@/features/dashboard/types'

export function mockDashboardData(): DashboardData {
  return {
    kpis: [
      {
        label: '总用户数',
        value: 158724,
        unit: '人',
        color: '#60a5fa',
        trend: 12.5,
        trendLabel: '较昨日',
      },
      {
        label: '活跃用户',
        value: 52386,
        unit: '人',
        color: '#34d399',
        trend: 8.3,
        trendLabel: '较昨日',
      },
      {
        label: '总营收',
        value: 1025,
        unit: '万',
        prefix: '¥',
        color: '#fbbf24',
        trend: 5.7,
        trendLabel: '较昨日',
      },
      { label: '转化率', value: 3.8, unit: '%', color: '#a78bfa' },
      {
        label: '平均响应',
        value: 286,
        unit: 'ms',
        color: '#f472b6',
        trend: -7.2,
        trendLabel: '较昨日',
      },
      { label: '系统可用率', value: 99.97, unit: '%', color: '#38bdf8' },
    ],

    accessTrend: [
      { time: '00:00', visits: 320, uniqueVisitors: 280 },
      { time: '02:00', visits: 180, uniqueVisitors: 150 },
      { time: '04:00', visits: 120, uniqueVisitors: 90 },
      { time: '06:00', visits: 260, uniqueVisitors: 210 },
      { time: '08:00', visits: 1580, uniqueVisitors: 1200 },
      { time: '10:00', visits: 3850, uniqueVisitors: 2900 },
      { time: '12:00', visits: 2100, uniqueVisitors: 1650 },
      { time: '14:00', visits: 4200, uniqueVisitors: 3300 },
      { time: '16:00', visits: 4800, uniqueVisitors: 3600 },
      { time: '18:00', visits: 3200, uniqueVisitors: 2400 },
      { time: '20:00', visits: 5600, uniqueVisitors: 4100 },
      { time: '22:00', visits: 2800, uniqueVisitors: 2100 },
    ],

    categoryShares: [
      { name: '技术研发', value: 35 },
      { name: '市场营销', value: 22 },
      { name: '运营管理', value: 18 },
      { name: '客户服务', value: 15 },
      { name: '产品设计', value: 10 },
    ],

    cityRanking: [
      { city: '北京', value: 23456, growth: 12.3 },
      { city: '上海', value: 21098, growth: 8.9 },
      { city: '广州', value: 18765, growth: 15.6 },
      { city: '深圳', value: 16543, growth: 10.2 },
      { city: '杭州', value: 12321, growth: 18.7 },
      { city: '成都', value: 9876, growth: 22.1 },
      { city: '武汉', value: 7654, growth: 5.4 },
      { city: '南京', value: 6543, growth: 3.2 },
    ],

    radarModel: {
      indicators: [
        { name: '性能', max: 100 },
        { name: '稳定性', max: 100 },
        { name: '安全性', max: 100 },
        { name: '效率', max: 100 },
        { name: '质量', max: 100 },
      ],
      series: [
        {
          name: '当前系统',
          value: [92, 85, 78, 88, 95],
        },
        {
          name: '行业标准',
          value: [70, 75, 80, 70, 75],
        },
      ],
    },

    centerOverview: {
      title: '系统运行态势',
      metrics: [
        { label: '在线项目', value: 128, unit: '个', status: 'success', progress: 85 },
        { label: '今日告警', value: 3, unit: '条', status: 'warning', progress: 10 },
        { label: '服务可用率', value: 99.97, unit: '%', status: 'success', progress: 99.97 },
        { label: '用户满意度', value: 4.8, unit: '分', status: 'success', progress: 96 },
      ],
      summary: '系统运行状态良好，各项指标均在正常范围内。',
    },

    realtimeLogs: [
      {
        id: 'LOG001',
        action: '下单',
        user: '张伟',
        detail: '购买「数据分析高级课程」',
        time: '14:32:18',
        status: 'success',
      },
      {
        id: 'LOG002',
        action: '注册',
        user: '李娜',
        detail: '新用户完成邮箱验证',
        time: '14:32:15',
        status: 'success',
      },
      {
        id: 'LOG003',
        action: '登录',
        user: '王强',
        detail: 'IP 异常登录提醒',
        time: '14:32:12',
        status: 'pending',
      },
      {
        id: 'LOG004',
        action: '退款',
        user: '赵敏',
        detail: '订单 #20240707001 退款处理',
        time: '14:32:08',
        status: 'pending',
      },
      {
        id: 'LOG005',
        action: '咨询',
        user: '刘洋',
        detail: '在线客服会话 #CS8921',
        time: '14:32:05',
        status: 'success',
      },
      {
        id: 'LOG006',
        action: '升级',
        user: '陈晨',
        detail: '企业版套餐续费一年',
        time: '14:32:00',
        status: 'success',
      },
    ],

    updatedAt: new Date().toISOString(),
  }
}
