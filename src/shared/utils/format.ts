/**
 * 通用格式化工具
 */

/** 格式化数字（千分位） */
export function formatNumber(value: number): string {
  return value.toLocaleString('zh-CN')
}

/** 格式化金额 */
export function formatCurrency(value: number, symbol = '¥'): string {
  return `${symbol}${value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** 格式化百分比 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/** 格式化文件大小 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`
}
