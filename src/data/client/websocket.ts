/**
 * WebSocket 客户端
 * 用于大屏实时数据推送（预留实现）
 */

import { logger } from '@/logging'

type MessageHandler = (data: unknown) => void

export class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string = ''
  private handlers = new Map<string, MessageHandler[]>()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private maxRetries = 5
  private retryCount = 0

  connect(url: string) {
    this.url = url
    this.retryCount = 0
    this.doConnect()
  }

  private doConnect() {
    try {
      this.ws = new WebSocket(this.url)
      this.ws.onopen = () => {
        this.retryCount = 0
        logger.info('WebSocket', '连接已建立', { url: this.url })
      }
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.dispatch(data.type, data.payload)
        } catch {
          // 非 JSON 消息忽略
        }
      }
      this.ws.onclose = () => {
        logger.warn('WebSocket', '连接已关闭', { url: this.url })
        this.scheduleReconnect()
      }
      this.ws.onerror = () => {
        logger.error('WebSocket', '连接异常', { url: this.url })
      }
    } catch (error) {
      logger.error('WebSocket', '连接失败', { error })
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, [])
    }
    this.handlers.get(type)!.push(handler)
  }

  off(type: string, handler: MessageHandler) {
    const handlers = this.handlers.get(type)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index >= 0) handlers.splice(index, 1)
    }
  }

  private dispatch(type: string, payload: unknown) {
    const handlers = this.handlers.get(type)
    if (handlers) {
      handlers.forEach((handler) => handler(payload))
    }
  }

  private scheduleReconnect() {
    if (this.retryCount >= this.maxRetries) {
      logger.error('WebSocket', '重连次数已达上限', { maxRetries: this.maxRetries })
      return
    }
    const delay = Math.min(1000 * 2 ** this.retryCount, 30000)
    this.retryCount++
    this.reconnectTimer = setTimeout(() => this.doConnect(), delay)
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close()
    this.ws = null
    this.handlers.clear()
    this.retryCount = 0
  }
}
