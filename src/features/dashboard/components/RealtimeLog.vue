<script setup lang="ts">
/**
 * RealtimeLog — 实时日志列表
 * 滚动展示最新操作记录
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
  <div class="log-list">
    <TransitionGroup name="row">
      <div v-for="log in logs" :key="log.id" class="log-item">
        <span class="l-time">{{ log.time }}</span>
        <span class="l-user">{{ log.user }}</span>
        <span class="l-action">{{ log.action }}</span>
        <span class="l-detail">{{ log.detail }}</span>
        <span class="l-status" :style="{ color: statusMap[log.status]?.color }">
          {{ statusMap[log.status]?.label }}
        </span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.log-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: rgb(255, 255, 255, 2%);
  font-variant-numeric: tabular-nums;
}

.l-time {
  color: rgb(255, 255, 255, 30%);
  min-width: 56px;
  flex-shrink: 0;
}
.l-user {
  color: rgb(255, 255, 255, 60%);
  min-width: 36px;
  flex-shrink: 0;
}
.l-action {
  color: rgb(255, 255, 255, 50%);
  min-width: 32px;
  flex-shrink: 0;
}
.l-detail {
  color: rgb(255, 255, 255, 45%);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.l-status {
  font-weight: 500;
  min-width: 34px;
  text-align: right;
  flex-shrink: 0;
}

.row-enter-active {
  transition: all 0.35s ease;
}
.row-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
