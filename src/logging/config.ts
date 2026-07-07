import { logger } from './logger'
import { consoleTransport } from './transports/consoleTransport'
import { remoteTransport } from './transports/remoteTransport'
import { env } from '@/config/env'

/**
 * 日志系统初始化
 * 根据环境配置选择合适的传输通道和日志级别
 */
export function setupLogging() {
  const transports = [consoleTransport]

  // 生产环境额外启用远程日志
  if (env.isProduction) {
    transports.push(remoteTransport)
  }

  logger.configure({
    level: env.logLevel,
    transports,
  })

  logger.info('Logging', '日志系统初始化完成', {
    level: env.logLevel,
    transports: transports.map((t) => t.constructor.name),
  })
}
