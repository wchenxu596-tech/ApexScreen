<script setup lang="ts">
/**
 * RealtimeLog — 实时动态与告警
 * 展示教学数据中心的最新动态和轻量告警
 * alert 类型条目左侧有红/黄色警示条
 */

import type { RealtimeLog as RealtimeLogType } from '../types'

defineOptions({ name: 'RealtimeLog' })

defineProps<{
  logs: RealtimeLogType[]
}>()

const statusMap: Record<string, { label: string; color: string }> = {
  success: { label: '正常', color: '#34d399' },
  pending: { label: '处理中', color: '#fbbf24' },
  warning: { label: '告警', color: '#f87171' },
  failed: { label: '失败', color: '#f87171' },
}
</script>

<template>
  <div class="log-list">
    <TransitionGroup name="row">
      <div
        v-for="log in logs"
        :key="log.id"
        class="log-item"
        :class="{ 'is-alert': log.type === 'alert' }"
      >
        <span class="l-type">
          <span v-if="log.type === 'alert'" class="alert-dot" title="告警" />
        </span>
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
  gap: 3px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10.5px;
  background: rgb(255 255 255 / 2%);
  font-variant-numeric: tabular-nums;
  border-left: 2px solid transparent;
}

.log-item.is-alert {
  background: rgb(248 113 113 / 4%);
  border-left-color: #f87171;
}

.l-type {
  width: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f87171;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.l-time {
  color: rgb(255 255 255 / 30%);
  min-width: 52px;
  flex-shrink: 0;
}
.l-user {
  color: rgb(255 255 255 / 55%);
  min-width: 30px;
  flex-shrink: 0;
}
.l-action {
  color: rgb(255 255 255 / 50%);
  min-width: 50px;
  flex-shrink: 0;
}
.l-detail {
  color: rgb(255 255 255 / 40%);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.l-status {
  font-weight: 500;
  min-width: 36px;
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
