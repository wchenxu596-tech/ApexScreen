<script setup lang="ts">
/**
 * CampusMap — 教学数据流转中心
 *
 * 简洁卡片式布局，显示巅峰中枢及四类业务节点数据。
 * 适配小正方形面板。
 */
import type { CenterOverview } from '../types'

defineOptions({ name: 'CampusMap' })

defineProps<{
  data: CenterOverview | null
  loading?: boolean
}>()
</script>

<template>
  <div class="campus-wrap">
    <div v-if="loading" class="co-placeholder">加载中…</div>

    <template v-else-if="data">
      <!-- 中枢标题 -->
      <div class="hub-header">
        <div class="hub-icon">⚡</div>
        <div>
          <div class="hub-name">{{ data.hubName }}</div>
          <div class="hub-sub">{{ data.hubSubtitle }}</div>
        </div>
      </div>

      <!-- 4 个节点卡片 -->
      <div class="node-grid">
        <div
          v-for="(node, i) in data.nodes"
          :key="i"
          class="node-card"
          :class="[`node-${node.status}`, `node-color-${i}`]"
        >
          <div class="node-name">{{ node.name }}</div>
          <div class="node-value">
            <span class="node-num">{{ node.value.toLocaleString() }}</span>
            <span class="node-unit">{{ node.unit }}</span>
          </div>
          <div class="node-desc">{{ node.desc }}</div>
        </div>
      </div>

      <!-- 概要 -->
      <div class="hub-summary">{{ data.summary }}</div>
    </template>

    <div v-else class="co-placeholder">暂无数据</div>
  </div>
</template>

<style scoped>
.campus-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 2px 4px;
  min-height: 0;
}

.co-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--dv-text-muted);
  font-size: 12px;
}

/* ── 中枢标题 ── */
.hub-header {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}
.hub-icon {
  font-size: 16px;
  line-height: 1;
}
.hub-name {
  font-size: 11px;
  font-weight: 700;
  color: var(--dv-cyan);
  letter-spacing: 1px;
  line-height: 1.2;
}
.hub-sub {
  font-size: 8px;
  color: var(--dv-text-muted);
  letter-spacing: 0.5px;
}

/* ── 节点网格 ── */
.node-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
  flex: 1;
  min-height: 0;
}

.node-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  padding: 2px 3px;
  min-height: 0;
}

.node-name {
  font-size: 8px;
  font-weight: 600;
  color: var(--dv-text);
  line-height: 1.3;
}

.node-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
  line-height: 1.2;
}
.node-num {
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.node-unit {
  font-size: 8px;
  color: var(--dv-text-muted);
}

.node-desc {
  font-size: 7px;
  color: var(--dv-text-muted);
  line-height: 1.2;
}

/* 状态着色 */
.node-success .node-num {
  color: #34d399;
}
.node-warning .node-num {
  color: #fbbf24;
}

/* 不同底色 */
.node-color-0 {
  background: rgba(37, 99, 235, 0.06);
}
.node-color-1 {
  background: rgba(14, 165, 164, 0.06);
}
.node-color-2 {
  background: rgba(249, 115, 22, 0.06);
}
.node-color-3 {
  background: rgba(99, 102, 241, 0.06);
}

/* 概要 */
.hub-summary {
  font-size: 7px;
  color: var(--dv-text-muted);
  text-align: center;
  line-height: 1.3;
  flex-shrink: 0;
}
</style>
