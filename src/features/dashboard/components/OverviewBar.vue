<script setup lang="ts">
/**
 * OverviewBar — 顶部概览指标栏
 * 组合多个 MetricCard 横排展示
 */

import MetricCard from './MetricCard.vue'
import type { OverviewMetrics } from '../types'

defineOptions({ name: 'OverviewBar' })

const props = defineProps<{
  metrics: OverviewMetrics | null
  loading: boolean
}>()
</script>

<template>
  <div v-if="metrics" class="overview-bar">
    <MetricCard
      label="总用户数"
      :value="metrics.totalUsers"
      color="#60a5fa"
      :trend="metrics.userGrowth"
      trend-label="环比"
    />
    <MetricCard
      label="活跃用户"
      :value="metrics.activeUsers"
      color="#34d399"
      :trend="metrics.userGrowth"
      trend-label="环比"
    />
    <MetricCard
      label="总营收"
      :value="metrics.totalRevenue"
      prefix="¥"
      color="#fbbf24"
      :trend="metrics.revenueGrowth"
      trend-label="环比"
    />
    <MetricCard label="转化率" :value="metrics.conversionRate" suffix="%" color="#a78bfa" />
  </div>
  <div v-else-if="loading" class="overview-bar overview-loading">
    <div v-for="i in 4" :key="i" class="skeleton-card">
      <div class="skeleton-line skeleton-label" />
      <div class="skeleton-line skeleton-value" />
    </div>
  </div>
</template>

<style scoped>
.overview-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.overview-loading {
  .skeleton-card {
    padding: 16px;
    text-align: center;
  }

  .skeleton-line {
    background: rgba(255, 255, 255, 0.06);
    border-radius: 4px;
    margin: 8px auto;
  }

  .skeleton-label {
    width: 60%;
    height: 12px;
  }

  .skeleton-value {
    width: 80%;
    height: 28px;
  }
}
</style>
