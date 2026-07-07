/**
 * HTTP 请求客户端
 * 基于 axios 封装，统一处理请求/响应拦截、错误处理
 */

import axios, { type AxiosInstance } from 'axios'
import { env } from '@/config/env'
import { logger } from '@/logging'

const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
httpClient.interceptors.request.use(
  (config) => {
    logger.debug('HTTP', `→ ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
    })
    return config
  },
  (error) => {
    logger.error('HTTP', '请求发送失败', { error: error.message })
    return Promise.reject(error)
  },
)

// 响应拦截器
httpClient.interceptors.response.use(
  (response) => {
    logger.debug('HTTP', `← ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    const status = error.response?.status
    const url = error.config?.url
    logger.error('HTTP', `请求失败 ${url}`, { status, message: error.message })
    return Promise.reject(error)
  },
)

export { httpClient }
