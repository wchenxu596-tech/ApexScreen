<script setup lang="ts">
/**
 * DashboardView — 16:9 教学数据大屏（浅色毛玻璃主题）
 *
 * 布局：
 * ┌─────────────────────────────────────────────────────────────┐
 * │ HEADER                                                     │
 * ├────────┬────────┬────────┬─────────────────────────────────┤
 * │今日访问量│在线课程数│活跃用户数│系统健康度                       │
 * ├──────────────────────────────────┬─────────────────────────┤
 * │                                  │  访问趋势                 │
 * │       🗺️ 2.5D 中国地图            ├─────────────────────────┤
 * │       (标注城市排名城市)            │  分类占比                 │
 * │                                  │                         │
 * ├──────────┬────────┬──────────────┴─────────────────────────┤
 * │ 实时动态 │ 教学中心 │  城市排名         │  雷达模型            │
 * └──────────┴────────┴──────────────────┴─────────────────────┘
 */
import { useDashboardData } from '@/features/dashboard/composables/useDashboardData'
import { useClock } from '@/features/dashboard/composables/useClock'
import MetricCard from '@/features/dashboard/components/MetricCard.vue'
import RealtimeLog from '@/features/dashboard/components/RealtimeLog.vue'
import CampusMap from '@/features/dashboard/components/CampusMap2_5D.vue'
import ChinaMap from '@/features/dashboard/components/ChinaMap2_5D.vue'
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
  <div class="dv-screen dashboard">
    <!-- ═══ HEADER ═══ -->
    <header class="header">
      <div class="header-glow" />
      <div class="header-glow-line" />

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
            stroke="#2563eb"
          />
        </svg>
        <h1 class="dv-title-glow header-title">巅峰数据大屏</h1>
        <span class="header-sub">ApexScreen</span>
      </div>

      <div class="header-status">
        <span class="status-dot" />
        <span class="status-text">教学系统运行中</span>
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

    <!-- ═══ 主网格 ═══ -->
    <section class="grid-main">
      <!-- 中国地图（主区域） -->
      <div class="panel-map dv-glass dv-glass-band dv-corners dv-glass-blue">
        <div class="panel-h panel-h-map">全国城市访问分布</div>
        <ChinaMap :data="cityRanking" :loading="loading" />
      </div>

      <!-- 右上方：访问趋势 -->
      <div class="panel-top-right dv-glass dv-glass-band dv-corners dv-glass-teal">
        <div class="panel-h">访问趋势</div>
        <div class="panel-b"><AccessTrendChart :data="accessTrend" :loading="loading" /></div>
      </div>

      <!-- 右中：分类占比 -->
      <div class="panel-mid-right dv-glass dv-glass-band dv-corners dv-glass-violet">
        <div class="panel-h">分类占比</div>
        <div class="panel-b"><CategoryShareChart :data="categoryShares" :loading="loading" /></div>
      </div>

      <!-- 底行左：实时动态 -->
      <div class="panel-bot-left dv-glass dv-glass-band dv-corners dv-glass-orange">
        <div class="panel-h">实时动态</div>
        <div class="panel-b"><RealtimeLog :logs="realtimeLogs" /></div>
      </div>

      <!-- 底行中：城市排名 -->
      <div class="panel-bot-mid dv-glass dv-glass-band dv-corners dv-glass-orange">
        <div class="panel-h">城市排名</div>
        <div class="panel-b"><CityRankingChart :data="cityRanking" :loading="loading" /></div>
      </div>

      <!-- 底行右：教学中心（正方形） -->
      <div class="panel-bot-right dv-glass dv-glass-band dv-corners dv-glass-violet">
        <div class="panel-h">教学中心</div>
        <CampusMap :data="centerOverview" :loading="loading" />
      </div>

      <!-- 底行最右：雷达模型（正方形） -->
      <div class="panel-bot-far dv-glass dv-glass-band dv-corners dv-glass-blue">
        <div class="panel-h">雷达模型</div>
        <div class="panel-b"><RadarModelChart :data="radarModel" :loading="loading" /></div>
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
   16:9 浅色大屏 · 固定视口 · 无滚动
   ════════════════════════════════════════════ */

.dashboard {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(1100px 520px at 15% -10%, rgba(37, 99, 235, 0.12), transparent 60%),
    radial-gradient(1000px 520px at 95% 10%, rgba(14, 165, 164, 0.1), transparent 60%),
    linear-gradient(160deg, #f6f9ff 0%, #eaf1fb 45%, #e3edfa 100%);
  color: var(--dv-text);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
}

/* ── HEADER ── */

.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 28px;
  flex-shrink: 0;
  z-index: 1;
}

.header-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 0%, rgba(37, 99, 235, 0.06), transparent 70%);
}
.header-glow-line {
  position: absolute;
  inset: auto 0 0 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.3), transparent);
  pointer-events: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}
.header-icon {
  opacity: 0.7;
  flex-shrink: 0;
  color: #2563eb;
}
.header-title {
  font-size: 19px;
  font-weight: 700;
  margin: 0;
}
.header-sub {
  font-size: 9px;
  color: var(--dv-text-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: var(--dv-text-dim);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  animation: pulse-dot 1.5s ease-in-out infinite;
  box-shadow: 0 0 6px rgba(52, 211, 153, 0.6);
}
@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
.status-text {
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  z-index: 1;
}
.header-datetime {
  display: flex;
  align-items: center;
  gap: 10px;
  font-variant-numeric: tabular-nums;
}
.dt-date {
  font-size: 12px;
  color: var(--dv-text-dim);
}
.dt-week {
  font-size: 10px;
  color: var(--dv-text-muted);
  padding: 1px 6px;
  border-radius: 3px;
  background: rgba(37, 99, 235, 0.06);
}
.dt-time {
  font-size: 18px;
  font-weight: 600;
  color: var(--dv-cyan);
  letter-spacing: 2px;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--dv-text-dim);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-refresh:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(37, 99, 235, 0.35);
  color: var(--dv-cyan);
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
  padding: 2px 28px 4px;
  flex-shrink: 0;
}
.kpi-row > * {
  flex: 1;
  min-width: 0;
}

/* ════════════════════════════════════════════════════════════
   主网格
   ┌────────────────────────────────┬─────────────────┐
   │  中国地图 (8fr × 2行)           │  访问趋势 (4fr)   │
   │                                ├─────────────────┤
   │                                │  分类占比 (4fr)   │
   ├────────┬───────┬───────────────┴─────────────────┤
   │实时动态 │教学中心│  城市排名    │  雷达模型          │
   │ (3fr)  │ (2fr) │   (4fr)      │  (3fr)           │
   └────────┴───────┴───────────────┴──────────────────┘
   ════════════════════════════════════════════════════════════ */

.grid-main {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr 1fr 0.85fr;
  gap: 6px;
  padding: 0 24px 3px;
  min-height: 0;
}

/* 中国地图：左 7 列 × 前 2 行 */
.panel-map {
  grid-column: 1 / 8;
  grid-row: 1 / 3;
}

/* 右上方：访问趋势 */
.panel-top-right {
  grid-column: 8 / 13;
  grid-row: 1 / 2;
}

/* 右中：分类占比 */
.panel-mid-right {
  grid-column: 8 / 13;
  grid-row: 2 / 3;
}

/* 底行：实时动态 */
.panel-bot-left {
  grid-column: 1 / 5;
  grid-row: 3 / 4;
}

/* 底行：城市排名 */
.panel-bot-mid {
  grid-column: 5 / 9;
  grid-row: 3 / 4;
}

/* 底行：教学中心（正方形） */
.panel-bot-right {
  grid-column: 9 / 11;
  grid-row: 3 / 4;
}

/* 底行：雷达模型（正方形） */
.panel-bot-far {
  grid-column: 11 / 13;
  grid-row: 3 / 4;
}

.panel-map,
.panel-top-right,
.panel-mid-right,
.panel-bot-left,
.panel-bot-mid,
.panel-bot-right,
.panel-bot-far {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 3px;
}

.panel-h {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  font-size: 10px;
  font-weight: 600;
  color: var(--dv-text-dim);
  letter-spacing: 1.5px;
  flex-shrink: 0;
}

/* 中国地图标题更紧凑 */
.panel-h-map {
  padding: 2px 10px;
  font-size: 9px;
  letter-spacing: 1px;
}

.panel-b {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1px 4px 2px;
  min-height: 0;
}

.panel-b > :deep(*) {
  flex: 1;
  min-height: 0;
  width: 100%;
}

/* ── FOOTER ── */
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 3px 0;
  font-size: 9px;
  color: var(--dv-text-muted);
  flex-shrink: 0;
  border-top: 1px solid rgba(37, 99, 235, 0.08);
}
.sep {
  opacity: 0.3;
}
</style>
