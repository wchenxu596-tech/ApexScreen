import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/app/App.vue'
import { router } from '@/app/router'
import { logger } from '@/logging'
import '@/styles/global.css'

const app = createApp(App)

// 安装核心插件
app.use(createPinia())
app.use(router)

// 应用启动
app.mount('#app')

logger.info('App', '巅峰数据大屏已启动', {
  version: __APP_VERSION__,
  dataSource: import.meta.env.VITE_DATA_SOURCE,
})
