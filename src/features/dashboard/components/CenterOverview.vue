<script setup lang="ts">
/**
 * CenterOverview — 中心态势总览 · 巅峰中枢
 *
 * 设计：
 *   中央发光圆 = 巅峰中枢
 *   四角业务节点通过虚线连接中枢
 *   节点含指标数值和运行状态
 */
import type { CenterOverview as CenterOverviewType } from '../types'

defineOptions({ name: 'CenterOverview' })

defineProps<{
  data: CenterOverviewType | null
  loading?: boolean
}>()

const statusColors: Record<string, string> = {
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
}
</script>

<template>
  <div class="center-overview">
    <div v-if="loading" class="co-loading">加载中…</div>

    <template v-else-if="data">
      <!-- SVG 中枢网络 -->
      <svg class="hub-svg" viewBox="0 0 200 200">
        <!-- 连接线：中枢 → 周边节点 -->
        <line
          x1="100"
          y1="100"
          x2="20"
          y2="30"
          stroke="rgba(96,165,250,0.12)"
          stroke-width="1.2"
          stroke-dasharray="3 2"
        />
        <line
          x1="100"
          y1="100"
          x2="180"
          y2="30"
          stroke="rgba(96,165,250,0.12)"
          stroke-width="1.2"
          stroke-dasharray="3 2"
        />
        <line
          x1="100"
          y1="100"
          x2="20"
          y2="170"
          stroke="rgba(96,165,250,0.12)"
          stroke-width="1.2"
          stroke-dasharray="3 2"
        />
        <line
          x1="100"
          y1="100"
          x2="180"
          y2="170"
          stroke="rgba(96,165,250,0.12)"
          stroke-width="1.2"
          stroke-dasharray="3 2"
        />

        <!-- 中枢外环光晕 -->
        <circle
          cx="100"
          cy="100"
          r="38"
          fill="none"
          stroke="rgba(96,165,250,0.04)"
          stroke-width="14"
        />
        <circle
          cx="100"
          cy="100"
          r="28"
          fill="none"
          stroke="rgba(96,165,250,0.06)"
          stroke-width="1"
        />
        <circle cx="100" cy="100" r="22" fill="url(#hubGlow)" />

        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(96,165,250,0.25)" />
            <stop offset="70%" stop-color="rgba(96,165,250,0.06)" />
            <stop offset="100%" stop-color="rgba(96,165,250,0.0)" />
          </radialGradient>
        </defs>

        <!-- 巅峰中枢圆 -->
        <circle cx="100" cy="100" r="16" fill="#0f172a" stroke="#60a5fa" stroke-width="2.5" />
        <text
          x="100"
          y="97"
          text-anchor="middle"
          fill="#60a5fa"
          font-size="7.5"
          font-weight="700"
          letter-spacing="1"
        >
          巅峰
        </text>
        <text
          x="100"
          y="108"
          text-anchor="middle"
          fill="#60a5fa"
          font-size="7.5"
          font-weight="700"
          letter-spacing="1"
        >
          中枢
        </text>

        <!-- 周边节点：左上 - 课程资源 -->
        <g v-if="data.nodes[0]">
          <circle cx="20" cy="30" r="4.5" :fill="statusColors[data.nodes[0].status]" />
          <text
            x="20"
            y="20"
            text-anchor="middle"
            fill="rgba(255,255,255,0.65)"
            font-size="6.5"
            font-weight="600"
          >
            {{ data.nodes[0].name }}
          </text>
          <text x="20" y="42" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="6">
            {{ data.nodes[0].value }}{{ data.nodes[0].unit }}
          </text>
        </g>

        <!-- 周边节点：右上 - 学习用户 -->
        <g v-if="data.nodes[1]">
          <circle cx="180" cy="30" r="4.5" :fill="statusColors[data.nodes[1].status]" />
          <text
            x="180"
            y="20"
            text-anchor="middle"
            fill="rgba(255,255,255,0.65)"
            font-size="6.5"
            font-weight="600"
          >
            {{ data.nodes[1].name }}
          </text>
          <text x="180" y="42" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="6">
            {{ (data.nodes[1].value / 10000).toFixed(2) }}万{{ data.nodes[1].unit }}
          </text>
        </g>

        <!-- 周边节点：左下 - 实战项目 -->
        <g v-if="data.nodes[2]">
          <circle cx="20" cy="170" r="4.5" :fill="statusColors[data.nodes[2].status]" />
          <text
            x="20"
            y="160"
            text-anchor="middle"
            fill="rgba(255,255,255,0.65)"
            font-size="6.5"
            font-weight="600"
          >
            {{ data.nodes[2].name }}
          </text>
          <text x="20" y="182" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="6">
            {{ data.nodes[2].value }}{{ data.nodes[2].unit }}
          </text>
        </g>

        <!-- 周边节点：右下 - 考试任务 -->
        <g v-if="data.nodes[3]">
          <circle cx="180" cy="170" r="4.5" :fill="statusColors[data.nodes[3].status]" />
          <text
            x="180"
            y="160"
            text-anchor="middle"
            fill="rgba(255,255,255,0.65)"
            font-size="6.5"
            font-weight="600"
          >
            {{ data.nodes[3].name }}
          </text>
          <text x="180" y="182" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="6">
            {{ data.nodes[3].value }}{{ data.nodes[3].unit }}
          </text>
        </g>
      </svg>

      <div class="hub-subtitle">{{ data.hubSubtitle }}</div>
      <div class="hub-summary">{{ data.summary }}</div>
    </template>
  </div>
</template>

<style scoped>
.center-overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 6px 4px;
  gap: 3px;
}

.hub-svg {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
}

.hub-subtitle {
  font-size: 9px;
  color: rgb(255 255 255 / 0.3);
  letter-spacing: 1.5px;
  text-align: center;
}

.hub-summary {
  font-size: 8.5px;
  color: rgb(255 255 255 / 0.2);
  text-align: center;
  line-height: 1.4;
  padding: 0 6px;
}

.co-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgb(255 255 255 / 0.3);
  font-size: 13px;
}
</style>
