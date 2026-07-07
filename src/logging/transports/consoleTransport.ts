import type { Transport, LogEntry } from '../logger'
import { LogLevel, LogLevelLabel } from '../logger'

/**
 * 控制台日志输出通道
 * 开发环境使用彩色输出，生产环境自动降级为普通 console
 */
function getColor(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return 'color: #9ca3af'
    case LogLevel.INFO:
      return 'color: #60a5fa'
    case LogLevel.WARN:
      return 'color: #fbbf24'
    case LogLevel.ERROR:
      return 'color: #ef4444; font-weight: bold'
  }
}

export const consoleTransport: Transport = {
  log(entry: LogEntry) {
    const { level, module, message, context, traceId, timestamp } = entry
    const label = LogLevelLabel[level]
    const time = new Date(timestamp).toLocaleTimeString()
    const trace = traceId ? ` [${traceId}]` : ''
    const prefix = `[${time}][${label}][${module}]${trace}`

    if (import.meta.env.DEV) {
      console.log(`%c${prefix}%c ${message}`, getColor(level), '', context ?? '')
    } else {
      const method = level >= LogLevel.ERROR ? 'error' : level >= LogLevel.WARN ? 'warn' : 'log'
      console[method](`${prefix} ${message}`, context ?? '')
    }
  },
}
