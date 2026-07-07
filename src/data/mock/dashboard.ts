/**
 * Mock 大屏数据 — 教学数据中心版
 *
 * 场景：巅峰教育科技 · 教学数据大屏
 * 所有数据写死，稳定可用于课堂演示和截图
 */

import type { DashboardData } from '@/features/dashboard/types'

export function mockDashboardData(): DashboardData {
  return {
    // ═══ 顶部核心指标 ═══
    kpis: [
      {
        label: '今日访问量',
        value: 28456,
        unit: '次',
        color: '#60a5fa',
        trend: 12.5,
        trendLabel: '较昨日',
      },
      {
        label: '实时订单数',
        value: 1268,
        unit: '单',
        color: '#34d399',
        trend: 8.3,
        trendLabel: '较昨日',
      },
      {
        label: '活跃用户数',
        value: 8763,
        unit: '人',
        color: '#fbbf24',
        trend: 5.7,
        trendLabel: '较昨日',
      },
      { label: '系统健康度', value: 98.6, unit: '%', color: '#a78bfa' },
    ],

    // ═══ 访问趋势（24h 滑动窗口） ═══
    accessTrend: [
      { time: '00:00', visits: 320, orders: 28 },
      { time: '02:00', visits: 180, orders: 15 },
      { time: '04:00', visits: 120, orders: 8 },
      { time: '06:00', visits: 520, orders: 45 },
      { time: '08:00', visits: 2580, orders: 186 },
      { time: '10:00', visits: 4850, orders: 312 },
      { time: '12:00', visits: 3100, orders: 198 },
      { time: '14:00', visits: 5200, orders: 356 },
      { time: '16:00', visits: 5800, orders: 402 },
      { time: '18:00', visits: 4200, orders: 286 },
      { time: '20:00', visits: 3450, orders: 224 },
      { time: '22:00', visits: 2100, orders: 142 },
    ],

    // ═══ 分类占比 ═══
    categoryShares: [
      { name: '课程学习', value: 38 },
      { name: '项目实战', value: 25 },
      { name: '资料下载', value: 18 },
      { name: '实验实训', value: 12 },
      { name: '考试测评', value: 7 },
    ],

    // ═══ 城市排名 ═══
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

    // ═══ 能力雷达模型 ═══
    radarModel: {
      indicators: [
        { name: '前端基础', max: 100 },
        { name: '图表配置', max: 100 },
        { name: '数据建模', max: 100 },
        { name: '数据分析', max: 100 },
        { name: '可视化创意', max: 100 },
      ],
      series: [
        { name: '当前能力', value: [92, 78, 85, 70, 88] },
        { name: '目标能力', value: [85, 90, 88, 85, 92] },
      ],
    },

    // ═══ 中心态势 - 巅峰中枢 ═══
    centerOverview: {
      hubName: '巅峰中枢',
      hubSubtitle: '教学数据流转中心',
      nodes: [
        { name: '课程资源', value: 286, unit: '门', status: 'success', desc: '在线课程总量' },
        { name: '学习用户', value: 18763, unit: '人', status: 'success', desc: '活跃学员数' },
        { name: '实战项目', value: 96, unit: '个', status: 'success', desc: '可参与项目' },
        { name: '考试任务', value: 12, unit: '场', status: 'warning', desc: '进行中考试' },
      ],
      summary: '巅峰中枢运行正常，教学数据流转通畅，各节点协同稳定。',
    },

    // ═══ 实时动态与告警 ═══
    realtimeLogs: [
      {
        id: 'EVT001',
        type: 'log',
        user: '系统',
        action: '课程更新',
        detail: '《数据可视化实战》发布新章节',
        time: '14:32:18',
        status: 'success',
      },
      {
        id: 'EVT002',
        type: 'log',
        user: '张伟',
        action: '完成项目',
        detail: '「电商数据分析」提交评审',
        time: '14:32:15',
        status: 'success',
      },
      {
        id: 'EVT003',
        type: 'alert',
        user: '监控',
        action: '资源告警',
        detail: 'GPU 服务器负载超过 85%',
        time: '14:32:12',
        status: 'warning',
      },
      {
        id: 'EVT004',
        type: 'log',
        user: '李娜',
        action: '资料下载',
        detail: '《Python 数据分析》PDF',
        time: '14:32:08',
        status: 'success',
      },
      {
        id: 'EVT005',
        type: 'alert',
        user: '监控',
        action: '连接告警',
        detail: 'Redis 缓存命中率降至 72%',
        time: '14:32:05',
        status: 'pending',
      },
      {
        id: 'EVT006',
        type: 'log',
        user: '王强',
        action: '考试提交',
        detail: '「数据建模」期末试卷已提交',
        time: '14:32:00',
        status: 'success',
      },
      {
        id: 'EVT007',
        type: 'log',
        user: '赵敏',
        action: '注册课程',
        detail: '报名《机器学习入门》课程',
        time: '14:31:52',
        status: 'success',
      },
    ],

    updatedAt: new Date().toISOString(),
  }
}
