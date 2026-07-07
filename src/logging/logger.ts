/**
 * 📋 巅峰日志系统 - 核心日志模块
 *
 * 分级日志、通道可配、支持链路追踪
 * 使用: logger.info('Dashboard', '数据加载完成', {耗时: 320})
 */

export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel]

export const LogLevelLabel: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
}

export interface LogContext {
  [key: string]: unknown
}

export interface LogEntry {
  level: LogLevel
  module: string
  message: string
  timestamp: string
  context?: LogContext
  traceId?: string
}

export interface Transport {
  log(entry: LogEntry): void
}

const LOG_LEVEL_MAP: Record<string, LogLevel> = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
}

class Logger {
  private level: LogLevel = LogLevel.DEBUG
  private transports: Transport[] = []
  private traceId: string = ''

  configure(options: { level?: string; transports?: Transport[] }) {
    if (options.level) {
      this.level = LOG_LEVEL_MAP[options.level.toLowerCase()] ?? LogLevel.DEBUG
    }
    if (options.transports) {
      this.transports = options.transports
    }
  }

  setTraceId(id: string) {
    this.traceId = id
  }

  private log(level: LogLevel, module: string, message: string, context?: LogContext) {
    if (level < this.level) return

    const entry: LogEntry = {
      level,
      module,
      message,
      timestamp: new Date().toISOString(),
      context,
      traceId: this.traceId || undefined,
    }

    for (const transport of this.transports) {
      try {
        transport.log(entry)
      } catch {
        // 传输通道异常不应影响主流程
      }
    }
  }

  debug(module: string, message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, module, message, context)
  }

  info(module: string, message: string, context?: LogContext) {
    this.log(LogLevel.INFO, module, message, context)
  }

  warn(module: string, message: string, context?: LogContext) {
    this.log(LogLevel.WARN, module, message, context)
  }

  error(module: string, message: string, context?: LogContext) {
    this.log(LogLevel.ERROR, module, message, context)
  }
}

export const logger = new Logger()
