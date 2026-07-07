import { defineStore } from 'pinia'
import { ref } from 'vue'
import { env } from '@/config/env'
import { logger } from '@/logging'

export const useAppStore = defineStore('app', () => {
  const initialized = ref(false)
  const theme = ref<'light' | 'dark'>('dark')
  const dataSource = ref(env.dataSource)

  function init() {
    initialized.value = true
    applyTheme(theme.value)
    logger.debug('AppStore', '应用状态已初始化', {
      theme: theme.value,
      dataSource: dataSource.value,
    })
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(theme.value)
  }

  function applyTheme(t: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', t)
  }

  return {
    initialized,
    theme,
    dataSource,
    init,
    toggleTheme,
  }
})
