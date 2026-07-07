/**
 * Mock 数据生成器工具
 * 基于 @faker-js/faker 生成逼真的模拟数据
 */

import { faker } from '@faker-js/faker/locale/zh_CN'

/** 生成一个范围内的随机整数 */
export function randomInt(min: number, max: number): number {
  return faker.number.int({ min, max })
}

/** 生成一个范围内的随机浮点数 */
export function randomFloat(min: number, max: number, decimals = 2): number {
  return faker.number.float({ min, max, fractionDigits: decimals })
}

/** 生成随机时间序列 */
export function generateTimeSeries(
  points: number,
  options?: { start?: Date; interval?: number; trend?: 'up' | 'down' | 'volatile' },
): { time: string; value: number }[] {
  const { start, interval = 3600000, trend = 'volatile' } = options ?? {}
  const now = start ?? new Date()
  const data: { time: string; value: number }[] = []

  let baseValue = randomInt(100, 1000)

  for (let i = 0; i < points; i++) {
    const time = new Date(now.getTime() - (points - 1 - i) * interval)

    switch (trend) {
      case 'up':
        baseValue += randomFloat(0, 20)
        break
      case 'down':
        baseValue -= randomFloat(0, 20)
        break
      case 'volatile':
        baseValue += randomFloat(-50, 50)
        break
    }

    baseValue = Math.max(0, Math.round(baseValue * 100) / 100)
    data.push({
      time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      value: baseValue,
    })
  }

  return data
}

/** 生成百分比数组（总和为 100） */
export function generatePercentages(count: number): number[] {
  const values = Array.from({ length: count }, () => faker.number.int({ min: 1, max: 100 }))
  const total = values.reduce((a, b) => a + b, 0)
  return values.map((v) => Math.round((v / total) * 100))
}
