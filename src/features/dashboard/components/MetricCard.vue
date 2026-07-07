<script setup lang="ts">
/**
 * MetricCard — 16:9 大屏顶部 KPI 指标卡片（浅色主题）
 */

defineOptions({ name: 'MetricCard' })

withDefaults(
  defineProps<{
    label: string
    value: string | number
    prefix?: string
    unit?: string
    trend?: number
    trendLabel?: string
    color?: string
  }>(),
  {
    prefix: '',
    unit: '',
    trend: 0,
    trendLabel: '',
    color: '#2563eb',
  },
)
</script>

<template>
  <div class="metric-card dv-glass">
    <div class="metric-label">{{ label }}</div>
    <div class="metric-value" :style="{ color }">
      <span v-if="prefix" class="m-prefix">{{ prefix }}</span>
      {{ typeof value === 'number' ? value.toLocaleString() : value }}
      <span v-if="unit" class="m-unit">{{ unit }}</span>
    </div>
    <div v-if="trend !== 0" class="metric-trend" :class="{ up: trend > 0, down: trend < 0 }">
      <span class="t-arrow">{{ trend > 0 ? '▲' : '▼' }}</span>
      <span>{{ Math.abs(trend) }}%</span>
      <span v-if="trendLabel" class="t-label">{{ trendLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  padding: 8px 10px 6px;
  text-align: center;
  border-radius: 10px;
}

.metric-label {
  font-size: 10px;
  color: var(--dv-text-dim);
  letter-spacing: 1.5px;
  margin-bottom: 2px;
}

.metric-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.m-prefix,
.m-unit {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.5;
}

.metric-trend {
  font-size: 10px;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.metric-trend.up {
  color: #0ea5a4;
}
.metric-trend.down {
  color: #f87171;
}

.t-arrow {
  font-size: 8px;
}
.t-label {
  color: var(--dv-text-muted);
  font-size: 9px;
}
</style>
