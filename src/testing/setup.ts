/**
 * 测试环境配置
 * Vitest 启动前执行
 */

// 为测试设置环境变量
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_APP_TITLE: '巅峰数据大屏',
    VITE_DATA_SOURCE: 'mock',
    VITE_API_BASE_URL: '/api',
    VITE_LOG_LEVEL: 'silent',
    VITE_REALTIME: 'false',
    DEV: true,
    PROD: false,
  },
  writable: true,
})
