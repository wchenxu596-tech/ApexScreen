<script setup lang="ts">
/**
 * DashboardView — 16:9 教学数据大屏
 *
 * 布局（1920 × 1080）：
 * ┌──────────────────────────────────────────────────────────────┐
 * │ 巅峰数据大屏 · Peak Data Dashboard    2026-07-07 二 14:32:18 │
 * ├────────┬────────┬────────┬────────┬─────────────────────────┤
 * │今日访问量│实时订单数│活跃用户数│系统健康度│                       │
 * ├──────────────────┬────────────────┬────────────────────────┤
 * │  访问趋势          │  中心态势总览     │  城市访问排名            │
 * │  访问量 + 订单数    │  · 巅峰中枢 ·    │  横向柱状图             │
 * │  24h 滑动趋势窗口   │  教学数据流转     │                        │
 * ├──────────────────┼────────────────┼────────────────────────┤
 * │  分类占比           │  能力雷达模型     │  实时动态与告警          │
 * │  课程学习/项目实战   │  前端基础/图表配置 │  日志 + 轻量告警        │
 * │  资料下载/实验实训   │  数据建模/分析    │  实时滚动展示           │
 * └──────────────────┴────────────────┴────────────────────────┘
 */
import { useDashboardData } from '@/features/dashboard/composables/useDashboardData'
import { useClock } from '@/features/dashboard/composables/useClock'
import MetricCard from '@/features/dashboard/components/MetricCard.vue'
import RealtimeLog from '@/features/dashboard/components/RealtimeLog.vue'
import CenterOverview from '@/features/dashboard/components/CenterOverview.vue'
import {
  AccessTrendChart,
  CategoryShareChart,
  CityRankingChart,
  RadarModelChart,
} from '@/features/dashboard/components/charts'
import { logger } from '@/logging'

const {
  loading,
  kpis,
  accessTrend,
  categoryShares,
  cityRanking,
  radarModel,
  centerOverview,
  realtimeLogs,
  refresh,
} = useDashboardData()
const { dateStr, timeStr, weekday } = useClock()

function handleRefresh() {
  logger.info('DashboardView', '手动刷新')
  refresh()
}
</script>

<template>
  <div class="dashboard">
    <!-- ═══ HEADER ═══ -->
    <header class="header">
      <div class="header-left">
        <svg
          class="header-icon"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            d="M3 20h18M6 20V8l4-2v14M10 20V4l4-2v18M14 20V6l4-2v16M18 20V2l2-1v19"
            stroke="#60a5fa"
          />
        </svg>
        <h1 class="header-title">巅峰数据大屏</h1>
        <span class="header-sub">Peak Data Dashboard</span>
      </div>
      <div class="header-right">
        <div class="header-datetime">
          <span class="dt-date">{{ dateStr() }}</span>
          <span class="dt-week">{{ weekday() }}</span>
          <span class="dt-time">{{ timeStr() }}</span>
        </div>
        <button class="btn-refresh" :disabled="loading" @click="handleRefresh">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            :class="{ spin: loading }"
          >
            <path d="M21 12a9 9 0 11-3-6.7" stroke-linecap="round" />
          </svg>
          {{ loading ? '刷新中' : '刷新' }}
        </button>
      </div>
    </header>

    <!-- ═══ KPI 指标行 ═══ -->
    <section class="kpi-row">
      <MetricCard v-for="(kpi, i) in kpis" :key="i" v-bind="kpi" />
    </section>

    <!-- ═══ 主图表网格 (3列 × 2行) ═══ -->
    <section class="grid-main">
      <!-- 行 1 -->
      <div class="panel col-span-5">
        <div class="panel-h"><span class="dot" /> 访问趋势</div>
        <div class="panel-b"><AccessTrendChart :data="accessTrend" :loading="loading" /></div>
      </div>
      <div class="panel col-span-2 panel-center">
        <CenterOverview :data="centerOverview" :loading="loading" />
      </div>
      <div class="panel col-span-5">
        <div class="panel-h"><span class="dot" /> 城市排名</div>
        <div class="panel-b"><CityRankingChart :data="cityRanking" :loading="loading" /></div>
      </div>

      <!-- 行 2 -->
      <div class="panel col-span-5">
        <div class="panel-h"><span class="dot" /> 分类占比</div>
        <div class="panel-b"><CategoryShareChart :data="categoryShares" :loading="loading" /></div>
      </div>
      <div class="panel col-span-2">
        <div class="panel-h"><span class="dot" /> 雷达模型</div>
        <div class="panel-b"><RadarModelChart :data="radarModel" :loading="loading" /></div>
      </div>
      <div class="panel col-span-5">
        <div class="panel-h"><span class="dot" /> 实时动态</div>
        <div class="panel-b"><RealtimeLog :logs="realtimeLogs" /></div>
      </div>
    </section>

    <!-- ═══ FOOTER ═══ -->
    <footer class="footer">
      <span>巅峰教育科技 · 教学数据大屏</span>
      <span class="sep">|</span>
      <span>教学数据中心 · 数据模拟展示</span>
      <span class="sep">|</span>
      <span>巅峰中枢 {{ loading ? '同步中…' : '运行正常 ✓' }}</span>
    </footer>
  </div>
</template>

<style scoped>
/* ════════════════════════════════════════════
   16:9 暗色大屏 · 固定视口 · 无滚动
   ════════════════════════════════════════════ */

.dashboard {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0b1120;
  color: rgb(255, 255, 255, 85%);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
}

/* ── HEADER ── */

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 28px;
  border-bottom: 1px solid rgb(255, 255, 255, 6%);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  opacity: 0.8;
  flex-shrink: 0;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #fff;
  margin: 0;
}

.header-sub {
  font-size: 10px;
  color: rgb(255, 255, 255, 20%);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-datetime {
  display: flex;
  align-items: center;
  gap: 10px;
  font-variant-numeric: tabular-nums;
}

.dt-date {
  font-size: 13px;
  color: rgb(255, 255, 255, 50%);
}
.dt-week {
  font-size: 11px;
  color: rgb(255, 255, 255, 30%);
  padding: 1px 6px;
  border-radius: 3px;
  background: rgb(255, 255, 255, 4%);
}
.dt-time {
  font-size: 20px;
  font-weight: 600;
  color: #60a5fa;
  letter-spacing: 2px;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border: 1px solid rgb(255, 255, 255, 12%);
  border-radius: 4px;
  background: rgb(255, 255, 255, 4%);
  color: rgb(255, 255, 255, 55%);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-refresh:hover:not(:disabled) {
  background: rgb(255, 255, 255, 8%);
  border-color: rgb(255, 255, 255, 20%);
  color: #fff;
}
.btn-refresh:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── KPI ROW ── */

.kpi-row {
  display: flex;
  gap: 8px;
  padding: 8px 28px;
  flex-shrink: 0;
}
.kpi-row > * {
  flex: 1;
  min-width: 0;
}

/* ── MAIN GRID ── */

.grid-main {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  padding: 0 28px 6px;
  min-height: 0;
}

.col-span-5 {
  grid-column: span 5;
}
.col-span-2 {
  grid-column: span 2;
}

.panel {
  background: rgb(255, 255, 255, 2.5%);
  border: 1px solid rgb(255, 255, 255, 6%);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.panel-h {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 11px;
  font-weight: 600;
  color: rgb(255, 255, 255, 60%);
  letter-spacing: 1px;
  border-bottom: 1px solid rgb(255, 255, 255, 4%);
  flex-shrink: 0;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #60a5fa;
  flex-shrink: 0;
}

.panel-b {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 4px 8px 6px;
  min-height: 0;
}

.panel-b > :deep(*) {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.panel-center {
  border-color: rgb(96, 165, 250, 15%);
  background: rgb(96, 165, 250, 3%);
}
.panel-center .panel-b {
  padding: 0;
}

/* ── FOOTER ── */

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 5px 0;
  font-size: 10px;
  color: rgb(255, 255, 255, 18%);
  flex-shrink: 0;
  border-top: 1px solid rgb(255, 255, 255, 3%);
}
.sep {
  opacity: 0.3;
}
</style>
