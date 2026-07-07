<script setup lang="ts">
/**
 * DashboardView — 数据大屏主视图
 * 组合各特性模块组件，构成完整大屏
 */
import { useDashboardData } from '@/features/dashboard/composables/useDashboardData'
import { DashboardPanel, OverviewBar, RealtimeLog } from '@/features/dashboard/components'
import { DataChart } from '@/shared/ui/DataChart'
import '@/features/dashboard/components'

const { loading, overview, trends, categories, regions, realtimeLogs, refresh, lastUpdated } =
  useDashboardData()
</script>

<template>
  <div class="dashboard-view">
    <!-- 顶部标题栏 -->
    <header class="dashboard-header">
      <h1 class="dashboard-title">巅峰数据大屏</h1>
      <div class="dashboard-toolbar">
        <span class="update-time"
          >最后更新: {{ lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '--' }}</span
        >
        <button class="btn-refresh" :disabled="loading" @click="refresh">
          {{ loading ? '刷新中...' : '⟳ 刷新' }}
        </button>
      </div>
    </header>

    <!-- 概览指标 -->
    <section class="dashboard-section">
      <OverviewBar :metrics="overview" :loading="loading" />
    </section>

    <!-- 图表网格 -->
    <section class="dashboard-grid">
      <!-- 用户趋势 -->
      <DashboardPanel title="用户趋势" :loading="loading" :span="6" :height="320">
        <DataChart
          v-if="trends"
          type="line"
          :data="trends.users"
          x-key="time"
          y-key="value"
          color="#60a5fa"
        />
      </DashboardPanel>

      <!-- 营收趋势 -->
      <DashboardPanel title="营收趋势" :loading="loading" :span="6" :height="320">
        <DataChart
          v-if="trends"
          type="bar"
          :data="trends.revenue"
          x-key="time"
          y-key="value"
          color="#34d399"
        />
      </DashboardPanel>

      <!-- 分类分布 -->
      <DashboardPanel title="分类分布" :loading="loading" :span="4" :height="300">
        <DataChart
          v-if="categories.length"
          type="pie"
          :data="categories"
          name-key="name"
          value-key="value"
        />
      </DashboardPanel>

      <!-- 区域分布 -->
      <DashboardPanel title="区域分布" :loading="loading" :span="4" :height="300">
        <DataChart
          v-if="regions.length"
          type="bar"
          :data="regions"
          x-key="name"
          y-key="value"
          color="#fbbf24"
        />
      </DashboardPanel>

      <!-- 实时日志 -->
      <DashboardPanel title="实时动态" :loading="loading" :span="4" :height="300">
        <RealtimeLog :logs="realtimeLogs" />
      </DashboardPanel>
    </section>
  </div>
</template>

<style scoped>
.dashboard-view {
  padding: 24px 32px;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 4px;
  margin: 0;
}

.dashboard-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.update-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.btn-refresh {
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dashboard-section {
  flex-shrink: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  flex: 1;
}
</style>
