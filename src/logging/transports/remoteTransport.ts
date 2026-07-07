import type { Transport, LogEntry } from '../logger'
import { LogLevel } from '../logger'

/**
 * 远程日志输出通道
 * 将 ERROR 及以上级别的日志上报到远端日志服务
 * 当前为占位实现，后续接入具体日志平台（Sentry / 自建）
 */
export const remoteTransport: Transport = {
  log(entry: LogEntry) {
    if (entry.level < LogLevel.ERROR) return
    if (Math.random() > 0.1) return
    // TODO: 接入远程日志上报（Sentry / 自建日志服务）
  },
}
