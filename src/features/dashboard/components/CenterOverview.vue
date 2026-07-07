<script setup lang="ts">
/**
 * CenterOverview — 中心态势总览
 * 展示系统核心运行指标，带进度环
 * 位于大屏正中央，视觉焦点
 */
import type { CenterOverview as CenterOverviewType } from '../types'

defineOptions({ name: 'CenterOverview' })

const props = defineProps<{
  data: CenterOverviewType | null
  loading?: boolean
}>()

const statusColor: Record<string, string> = {
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
}

const statusLabel: Record<string, string> = {
  success: '正常',
  warning: '异常',
  danger: '危险',
}
</script>

<template>
  <div class="center-overview">
    <!-- 标题 -->
    <div class="overview-title">
      <span class="title-dot" />
      <span>{{ data?.title ?? '系统运行态势' }}</span>
    </div>

    <div v-if="loading" class="overview-loading">加载中…</div>

    <template v-else-if="data">
      <!-- 指标网格 -->
      <div class="metric-grid">
        <div v-for="(metric, idx) in data.metrics" :key="idx" class="metric-item">
          <!-- 迷你进度环 -->
          <svg class="ring" viewBox="0 0 36 36" :style="{ width: '52px', height: '52px' }">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              stroke-width="2.5"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              :stroke="statusColor[metric.status ?? 'success']"
              stroke-width="2.5"
              stroke-linecap="round"
              :stroke-dasharray="`${(metric.progress ?? 0) * 0.973} 97.39`"
              transform="rotate(-90 18 18)"
              class="ring-fill"
            />
          </svg>
          <div class="metric-info">
            <span class="metric-label">{{ metric.label }}</span>
            <span class="metric-value">
              {{ metric.value }}<small class="metric-unit">{{ metric.unit }}</small>
            </span>
            <span class="metric-status" :style="{ color: statusColor[metric.status ?? 'success'] }">
              {{ statusLabel[metric.status ?? 'success'] }}
            </span>
          </div>
        </div>
      </div>

      <!-- 概要文字 -->
      <div class="overview-summary">{{ data.summary }}</div>
    </template>
  </div>
</template>

<style scoped>
.center-overview {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
}

.overview-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: rgb(255, 255, 255, 80%);
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.title-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
}

.metric-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: rgb(255, 255, 255, 3%);
  border-radius: 6px;
}

.ring {
  flex-shrink: 0;
}

.ring-fill {
  transition: stroke-dasharray 0.8s ease;
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.metric-label {
  font-size: 10px;
  color: rgb(255, 255, 255, 40%);
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: rgb(255, 255, 255, 90%);
  font-variant-numeric: tabular-nums;
  line-height: 1.3;
}

.metric-unit {
  font-size: 11px;
  font-weight: 400;
  color: rgb(255, 255, 255, 40%);
  margin-left: 2px;
}

.metric-status {
  font-size: 10px;
  letter-spacing: 0.5px;
}

.overview-summary {
  margin-top: auto;
  padding-top: 8px;
  font-size: 11px;
  color: rgb(255, 255, 255, 35%);
  text-align: center;
  border-top: 1px solid rgb(255, 255, 255, 6%);
  line-height: 1.4;
}

.overview-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: rgb(255, 255, 255, 30%);
  font-size: 13px;
}
</style>
