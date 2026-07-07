/**
 * 🔄 数据适配器工厂
 * 根据环境配置自动返回对应的适配器实例
 */

import type { IDataAdapter } from './BaseAdapter'
import { MockAdapter } from './MockAdapter'
import { ApiAdapter } from './ApiAdapter'
import { env } from '@/config/env'
import { logger } from '@/logging'

let adapterInstance: IDataAdapter | null = null

export function useDataAdapter(): IDataAdapter {
  if (adapterInstance) return adapterInstance

  switch (env.dataSource) {
    case 'api':
      adapterInstance = new ApiAdapter()
      logger.info('DataAdapter', '使用 API 数据源', { baseURL: env.apiBaseURL })
      break
    case 'mixed':
      // mixed 模式: 可根据需要返回组合适配器
      adapterInstance = new MockAdapter()
      logger.info('DataAdapter', '使用混合数据源 (Mock + API)')
      break
    case 'mock':
    default:
      adapterInstance = new MockAdapter()
      logger.info('DataAdapter', '使用 Mock 数据源')
      break
  }

  return adapterInstance
}

/** 重置适配器（用于测试或动态切换数据源） */
export function resetAdapter() {
  adapterInstance = null
}
