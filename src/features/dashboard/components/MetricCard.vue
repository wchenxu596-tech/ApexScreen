<script setup lang="ts">
/**
 * MetricCard — 指标概览卡片
 * 显示关键数值及变化趋势
 */

defineOptions({ name: 'MetricCard' })

withDefaults(
  defineProps<{
    label: string
    value: string | number
    prefix?: string
    suffix?: string
    trend?: number
    trendLabel?: string
    color?: string
  }>(),
  {
    prefix: '',
    suffix: '',
    trend: 0,
    trendLabel: '',
    color: '#60a5fa',
  },
)
</script>

<template>
  <div class="metric-card">
    <div class="metric-label">{{ label }}</div>
    <div class="metric-value" :style="{ color }">
      <span v-if="prefix" class="metric-prefix">{{ prefix }}</span>
      {{ typeof value === 'number' ? value.toLocaleString() : value }}
      <span v-if="suffix" class="metric-suffix">{{ suffix }}</span>
    </div>
    <div v-if="trend !== 0" class="metric-trend" :class="{ up: trend > 0, down: trend < 0 }">
      <span class="trend-arrow">{{ trend > 0 ? '↑' : '↓' }}</span>
      <span>{{ Math.abs(trend) }}%</span>
      <span v-if="trendLabel" class="trend-label">{{ trendLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  text-align: center;
  padding: 8px 0;
}

.metric-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.metric-prefix,
.metric-suffix {
  font-size: 16px;
  font-weight: 400;
  opacity: 0.7;
}

.metric-trend {
  font-size: 13px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.metric-trend.up {
  color: #34d399;
}

.metric-trend.down {
  color: #f87171;
}

.trend-arrow {
  font-size: 14px;
}

.trend-label {
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
}
</style>
