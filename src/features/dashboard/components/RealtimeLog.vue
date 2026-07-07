<script setup lang="ts">
/**
 * RealtimeLog — 实时日志列表
 * 滚动显示最新操作记录
 */

import type { RealtimeLog as RealtimeLogType } from '../types'

defineOptions({ name: 'RealtimeLog' })

defineProps<{
  logs: RealtimeLogType[]
}>()

const statusMap: Record<string, { label: string; color: string }> = {
  success: { label: '成功', color: '#34d399' },
  pending: { label: '处理中', color: '#fbbf24' },
  failed: { label: '失败', color: '#f87171' },
}
</script>

<template>
  <div class="realtime-log">
    <TransitionGroup name="log-list" tag="div" class="log-list">
      <div v-for="log in logs" :key="log.id" class="log-item">
        <span class="log-time">{{ log.time }}</span>
        <span class="log-user">{{ log.user }}</span>
        <span class="log-action">{{ log.action }}</span>
        <span class="log-amount">¥{{ log.amount.toLocaleString() }}</span>
        <span class="log-status" :style="{ color: statusMap[log.status]?.color }">
          {{ statusMap[log.status]?.label }}
        </span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.realtime-log {
  height: 100%;
  overflow: hidden;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.03);
  font-variant-numeric: tabular-nums;
}

.log-time {
  color: rgba(255, 255, 255, 0.35);
  min-width: 60px;
}

.log-user {
  color: rgba(255, 255, 255, 0.7);
  min-width: 50px;
}

.log-action {
  color: rgba(255, 255, 255, 0.9);
}

.log-amount {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.5);
}

.log-status {
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

/* 列表动画 */
.log-list-enter-active {
  transition: all 0.4s ease;
}

.log-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
