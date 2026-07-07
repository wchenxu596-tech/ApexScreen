/**
 * 🔄 数据适配器 — 基础抽象类
 *
 * 定义统一的数据接口，MockAdapter 和 ApiAdapter 分别实现
 * 通过环境变量 VITE_DATA_SOURCE 一键切换
 */

import type { DashboardData } from '@/features/dashboard/types'

export interface IDataAdapter {
  /** 获取大盘数据 */
  getDashboardData(params?: Record<string, unknown>): Promise<DashboardData>

  /** 健康检查 */
  healthCheck(): Promise<boolean>
}

export abstract class BaseAdapter implements IDataAdapter {
  abstract getDashboardData(params?: Record<string, unknown>): Promise<DashboardData>
  abstract healthCheck(): Promise<boolean>

  /** 模拟网络延迟（开发环境） */
  protected async simulateDelay(min = 200, max = 600): Promise<void> {
    if (import.meta.env.DEV) {
      const delay = Math.floor(Math.random() * (max - min + 1)) + min
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}
