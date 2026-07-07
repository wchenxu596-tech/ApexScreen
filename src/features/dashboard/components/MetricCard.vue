<script setup lang="ts">
/**
 * MetricCard — 16:9 大屏顶部 KPI 指标卡片
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
    color: '#60a5fa',
  },
)
</script>

<template>
  <div class="metric-card">
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
  background: rgb(255, 255, 255, 2.5%);
  border: 1px solid rgb(255, 255, 255, 6%);
  border-radius: 6px;
  padding: 7px 10px;
  text-align: center;
}

.metric-label {
  font-size: 10px;
  color: rgb(255, 255, 255, 40%);
  letter-spacing: 1px;
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
  opacity: 0.55;
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
  color: #34d399;
}
.metric-trend.down {
  color: #f87171;
}

.t-arrow {
  font-size: 8px;
}
.t-label {
  color: rgb(255, 255, 255, 20%);
  font-size: 9px;
}
</style>
