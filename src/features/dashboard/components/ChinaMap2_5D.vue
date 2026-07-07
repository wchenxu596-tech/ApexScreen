<script setup lang="ts">
/**
 * ChinaMap2_5D — 2.5D 中国地图
 *
 * 基于 ECharts Map + SVG 叠加层：
 * · 地图 + 城市散点（ECharts）
 * · 城市引出线到模块边缘，标注城市信息（SVG）
 * · 流动光效动画
 */
import {
  ref, onMounted, onBeforeUnmount, watch, nextTick, shallowRef, computed,
} from 'vue'
import * as echarts from 'echarts/core'
import { MapChart, ScatterChart, EffectScatterChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { CityRank } from '../../types'

echarts.use([
  MapChart, ScatterChart, EffectScatterChart,
  GeoComponent, TooltipComponent, VisualMapComponent,
  CanvasRenderer,
])

defineOptions({ name: 'ChinaMap2_5D' })

const props = defineProps<{
  data: CityRank[]
  loading?: boolean
}>()

const chartRef = ref<HTMLElement | null>(null)
const svgRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)
const mapReady = ref(false)
const mapError = ref(false)
const containerSize = ref({ w: 600, h: 400 })
let resizeObs: ResizeObserver | null = null

/* ─── 城市坐标 ─── */
const cityGeo: Record<string, [number, number]> = {
  北京: [116.4, 39.9], 上海: [121.47, 31.23], 广州: [113.26, 23.13],
  深圳: [114.07, 22.55], 杭州: [120.15, 30.28], 成都: [104.06, 30.67],
  武汉: [114.3, 30.6], 南京: [118.78, 32.06],
}

/* ─── 标签锚点（容器百分比） ─── */
const labelAnchors: Record<string, { x: number; y: number }> = {
  北京: { x: 70, y: 5 },   南京: { x: 88, y: 8 },
  上海: { x: 93, y: 28 },  杭州: { x: 93, y: 45 },
  武汉: { x: 88, y: 65 },  深圳: { x: 92, y: 85 },
  广州: { x: 75, y: 93 },  成都: { x: 7, y: 50 },
}

/* ─── 引出线数据（SVG 坐标系） ─── */
interface LineData {
  city: string
  value: number
  growth: number
  x1: number; y1: number  // 城市位置 px
  x2: number; y2: number  // 锚点位置 px
  cx: number; cy: number  // 贝塞尔控制点
}

const lines = ref<LineData[]>([])

function getCityCoord(name: string, value: number): [number, number, number] {
  return [...(cityGeo[name] || [104, 35]), value]
}

/* ─── 计算引出线 ─── */
function computeLines() {
  const inst = chartInstance.value
  const svg = svgRef.value
  if (!inst || !svg || !props.data.length) { lines.value = []; return }

  const rect = svg.getBoundingClientRect()
  const w = rect.width
  const h = rect.height
  if (w < 10 || h < 10) { lines.value = []; return }
  containerSize.value = { w, h }

  const result: LineData[] = []

  for (const city of props.data) {
    const geo = cityGeo[city.city]
    if (!geo) continue
    const px = inst.convertToPixel('geo', geo)
    if (!px) continue
    const [px2, py2] = px as number[]

    // 锚点像素
    const anchor = labelAnchors[city.city]
    if (!anchor) continue
    const ax = (anchor.x / 100) * w
    const ay = (anchor.y / 100) * h

    // 贝塞尔控制点：从城市向锚点方向偏移 30%
    const cpx = px2 + (ax - px2) * 0.3 + (ay - py2) * 0.1
    const cpy = py2 + (ay - py2) * 0.3

    result.push({
      city: city.city,
      value: city.value,
      growth: city.growth,
      x1: px2, y1: py2,
      x2: ax, y2: ay,
      cx: cpx, cy: cpy,
    })
  }

  lines.value = result
}

/* ─── ECharts 图表选项 ─── */
function buildOption() {
  const cities = [...props.data].sort((a, b) => b.value - a.value)
  const maxVal = Math.max(...cities.map((c) => c.value), 1)

  return {
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(37,99,235,0.1)',
      textStyle: { color: '#1e293b', fontSize: 12 },
      formatter: (params: { name?: string; value?: unknown[]; seriesType?: string }) => {
        if (params.seriesType === 'effectScatter' && params.value) {
          const v = params.value as number[]
          const city = cities.find((c) => c.city === params.name)
          return `<strong>${params.name}</strong><br/>访问量：${v[2]?.toLocaleString() ?? '-'}<br/>同比增长：${city?.growth ?? 0}%`
        }
        return ''
      },
    },
    visualMap: {
      min: 0, max: maxVal,
      left: 6, bottom: 6,
      text: ['高', '低'] as string[],
      textStyle: { color: '#64748b', fontSize: 9 },
      inRange: { color: ['rgba(37,99,235,0.08)', 'rgba(37,99,235,0.35)', 'rgba(37,99,235,0.55)'] },
      calculable: false, itemWidth: 8, itemHeight: 50,
    },
    geo: {
      map: 'china', roam: false, zoom: 1.12, center: [104, 35] as [number, number],
      label: { show: false },
      itemStyle: {
        areaColor: 'rgba(37,99,235,0.06)',
        borderColor: 'rgba(37,99,235,0.2)',
        borderWidth: 1, shadowBlur: 6,
        shadowColor: 'rgba(37,99,235,0.08)', shadowOffsetY: 3,
      },
      emphasis: {
        itemStyle: { areaColor: 'rgba(37,99,235,0.15)', shadowBlur: 10, shadowColor: 'rgba(37,99,235,0.15)' },
        label: { show: false },
      },
    },
    series: [{
      type: 'effectScatter',
      coordinateSystem: 'geo',
      symbol: 'circle', symbolSize: 10, zlevel: 2,
      rippleEffect: { brushType: 'stroke', scale: 2.5, period: 4 },
      label: { show: false },
      itemStyle: {
        color: { type: 'radial', x: 0.4, y: 0.3, r: 0.7, colorStops: [{ offset: 0, color: '#60a5fa' }, { offset: 0.5, color: '#3b82f6' }, { offset: 1, color: '#1d4ed8' }] },
        shadowBlur: 10, shadowColor: 'rgba(37,99,235,0.4)', borderColor: '#fff', borderWidth: 1.5,
      },
      data: cities.map((c) => ({ name: c.city, value: getCityCoord(c.city, c.value) })),
    }],
  }
}

/* ─── 生命周期 ─── */

async function loadMap() {
  try {
    const res = await fetch('/geo/china.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const geoJson = await res.json()
    echarts.registerMap('china', geoJson)
    mapReady.value = true
    mapError.value = false
  } catch { mapError.value = true }
}

function init() {
  if (!chartRef.value || !mapReady.value) return
  chartInstance.value?.dispose()
  const inst = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  inst.setOption(buildOption())
  chartInstance.value = inst
  // 首次计算引出线
  nextTick(() => computeLines())
}

function resize() {
  chartInstance.value?.resize()
  nextTick(() => computeLines())
}

function updateChart() {
  if (!mapReady.value || props.loading) return
  if (!chartInstance.value) {
    nextTick(() => init())
  } else {
    chartInstance.value.setOption(buildOption(), { notMerge: true })
    nextTick(() => computeLines())
  }
}

watch(() => props.data, updateChart, { deep: true })
watch(() => props.loading, (val) => {
  if (!val && mapReady.value) nextTick(() => {
    if (!chartInstance.value) init()
    else resize()
  })
})
watch(mapReady, (ready) => { if (ready && chartRef.value && !props.loading) nextTick(() => init()) })

onMounted(async () => {
  await loadMap()
  window.addEventListener('resize', resize)
  // 监听 SVG 尺寸变化以计算引出线
  if (svgRef.value) {
    resizeObs = new ResizeObserver(() => {
      if (chartInstance.value) nextTick(() => computeLines())
    })
    resizeObs.observe(svgRef.value)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  resizeObs?.disconnect()
  chartInstance.value?.dispose()
})

/* ─── 象限颜色 ─── */
const cityColors: Record<string, string> = {
  北京: '#2563eb', 上海: '#0ea5a4', 广州: '#f97316',
  深圳: '#6366f1', 杭州: '#0891b2', 成都: '#7c3aed',
  武汉: '#b45309', 南京: '#2563eb',
}
</script>

<template>
  <div class="map-wrapper">
    <div v-show="!loading && mapReady" ref="chartRef" class="map-container" />
    <div v-show="loading && !mapReady" class="map-placeholder">
      {{ mapError ? '地图加载失败' : '加载中…' }}
    </div>

    <!-- SVG 引出线叠加层（始终渲染，v-show 控制可见性） -->
    <svg
      ref="svgRef"
      class="line-overlay"
      :class="{ 'line-active': lines.length > 0 }"
      :viewBox="`0 0 ${containerSize.w || 100} ${containerSize.h || 100}`"
    >
      <defs>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g v-for="(line, i) in lines" :key="line.city">
        <!-- 连接线（半透明底路径） -->
        <path
          :d="`M${line.x1},${line.y1} Q${line.cx},${line.cy} ${line.x2},${line.y2}`"
          fill="none"
          :stroke="cityColors[line.city] || '#2563eb'"
          :opacity="0.15"
          stroke-width="1.5"
        />
        <!-- 流动光效（虚线动画） -->
        <path
          :d="`M${line.x1},${line.y1} Q${line.cx},${line.cy} ${line.x2},${line.y2}`"
          fill="none"
          :stroke="cityColors[line.city] || '#2563eb'"
          stroke-width="1.5"
          stroke-dasharray="4 8"
          class="flow-line"
          :style="{ animationDelay: `${i * 0.15}s` }"
          filter="url(#lineGlow)"
        />
        <!-- 端点发光圆 -->
        <circle
          :cx="line.x2" :cy="line.y2" r="3"
          :fill="cityColors[line.city] || '#2563eb'"
          filter="url(#lineGlow)"
        />

        <!-- 信息标签 -->
        <g :transform="`translate(${line.x2}, ${line.y2 - 4})`">
          <!-- 标签背景 -->
          <rect
            :x="line.x2 > containerSize.w / 2 ? -85 : 8"
            :y="-14" width="80" height="28" rx="4"
            fill="rgba(255,255,255,0.88)"
            stroke="rgba(37,99,235,0.15)"
            stroke-width="0.5"
          />
          <text
            :x="line.x2 > containerSize.w / 2 ? -78 : 14" y="-2"
            fill="#1e293b" font-size="8" font-weight="600"
          >{{ line.city }}</text>
          <text
            :x="line.x2 > containerSize.w / 2 ? -78 : 14" y="8"
            :fill="cityColors[line.city] || '#2563eb'"
            font-size="7" font-weight="700"
          >{{ line.value.toLocaleString() }} <tspan fill="#94a3b8" font-weight="400">({{ line.growth > 0 ? '+' : '' }}{{ line.growth }}%)</tspan></text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.map-wrapper {
  flex: 1;
  display: flex;
  min-height: 0;
  position: relative;
}
.map-container {
  width: 100%;
  flex: 1;
  min-height: 0;
}
.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: var(--dv-text-muted);
  font-size: 13px;
}

/* SVG 引出线叠加层 */
.line-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

/* 流动光效动画 */
.flow-line {
  animation: flow-march 1.2s linear infinite;
}

@keyframes flow-march {
  to {
    stroke-dashoffset: -24;
  }
}
</style>
