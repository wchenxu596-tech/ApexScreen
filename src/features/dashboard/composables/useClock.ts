/**
 * useClock — 实时时钟组合式函数
 * 16:9 大屏顶部显示当前日期时间
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { logger } from '@/logging'

export function useClock() {
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval> | null = null

  function tick() {
    now.value = new Date()
  }

  onMounted(() => {
    tick()
    timer = setInterval(tick, 1000)
    logger.debug('Clock', '实时时钟已启动')
  })

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  })

  /** 格式化日期: 2026-07-07 */
  const dateStr = () => {
    const d = now.value
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  /** 格式化时间: 14:32:18 */
  const timeStr = () => {
    const d = now.value
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
  }

  /** 星期几 */
  const weekday = () => {
    const wds = ['日', '一', '二', '三', '四', '五', '六']
    return `星期${wds[now.value.getDay()]}`
  }

  return { now, dateStr, timeStr, weekday }
}
