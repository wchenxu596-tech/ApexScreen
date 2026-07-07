<script setup lang="ts">
/**
 * ChinaMap2_5D — 2.5D 中国地图
 *
 * 基于 ECharts Map，加载真实 GeoJSON 数据，
 * 标注城市排名中的城市并显示访问量。
 */
import { ref, onMounted, onBeforeUnmount, watch, nextTick, shallowRef } from 'vue'
import * as echarts from 'echarts/core'
import { MapChart, ScatterChart, EffectScatterChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { CityRank } from '../../types'

echarts.use([
  MapChart,
  ScatterChart,
  EffectScatterChart,
  GeoComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
])

defineOptions({ name: 'ChinaMap2_5D' })

const props = defineProps<{
  data: CityRank[]
  loading?: boolean
}>()

const chartRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)
const mapReady = ref(false)
const mapError = ref(false)

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
          return `<strong>${params.name}</strong><br/>
            访问量：${v[2]?.toLocaleString() ?? '-'}<br/>
            同比增长：${city?.growth ?? 0}%`
        }
        return ''
      },
    },
    visualMap: {
      min: 0,
      max: maxVal,
      left: 6,
      bottom: 6,
      text: ['高', '低'] as string[],
      textStyle: { color: '#64748b', fontSize: 9 },
      inRange: { color: ['rgba(37,99,235,0.08)', 'rgba(37,99,235,0.35)', 'rgba(37,99,235,0.55)'] },
      calculable: false,
      itemWidth: 8,
      itemHeight: 50,
    },
    geo: {
      map: 'china',
      roam: false,
      zoom: 1.15,
      center: [104, 35] as [number, number],
      label: { show: false },
      itemStyle: {
        areaColor: 'rgba(37,99,235,0.06)',
        borderColor: 'rgba(37,99,235,0.2)',
        borderWidth: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(37,99,235,0.08)',
        shadowOffsetY: 3,
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(37,99,235,0.15)',
          shadowBlur: 10,
          shadowColor: 'rgba(37,99,235,0.15)',
        },
        label: { show: false },
      },
    },
    series: [
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        symbol: 'circle',
        symbolSize: 10,
        zlevel: 2,
        rippleEffect: { brushType: 'stroke', scale: 2.5, period: 4 },
        label: { show: false },
        emphasis: {
          label: { fontSize: 12, fontWeight: 'bold', color: '#2563eb' },
        },
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.4,
            y: 0.3,
            r: 0.7,
            colorStops: [
              { offset: 0, color: '#60a5fa' },
              { offset: 0.5, color: '#3b82f6' },
              { offset: 1, color: '#1d4ed8' },
            ],
          },
          shadowBlur: 10,
          shadowColor: 'rgba(37,99,235,0.4)',
          borderColor: '#fff',
          borderWidth: 1.5,
        },
        data: cities.map((c) => ({
          name: c.city,
          value: getCityCoord(c.city, c.value),
        })),
      },
    ],
  }
}

function getCityCoord(name: string, value: number): [number, number, number] {
  const coords: Record<string, [number, number]> = {
    北京: [116.4, 39.9],
    上海: [121.47, 31.23],
    广州: [113.26, 23.13],
    深圳: [114.07, 22.55],
    杭州: [120.15, 30.28],
    成都: [104.06, 30.67],
    武汉: [114.3, 30.6],
    南京: [118.78, 32.06],
  }
  return [...(coords[name] || [104, 35]), value]
}

async function loadMap() {
  try {
    const res = await fetch('/geo/china.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const geoJson = await res.json()
    echarts.registerMap('china', geoJson)
    mapReady.value = true
    mapError.value = false
  } catch {
    console.warn('中国地图 GeoJSON 加载失败')
    mapError.value = true
  }
}

function init() {
  if (!chartRef.value || !mapReady.value) return
  chartInstance.value?.dispose()
  const inst = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  inst.setOption(buildOption())
  chartInstance.value = inst
}

function resize() {
  chartInstance.value?.resize()
}

/** 初始化或更新图表 */
function updateChart() {
  if (!mapReady.value || props.loading) return
  if (!chartInstance.value) {
    nextTick(() => init())
  } else {
    chartInstance.value.setOption(buildOption(), { notMerge: true })
    nextTick(() => resize())
  }
}

// 数据变化时更新
watch(() => props.data, updateChart, { deep: true })

// 加载完成时初始化
watch(
  () => props.loading,
  (val) => {
    if (!val && mapReady.value) {
      nextTick(() => {
        if (!chartInstance.value) init()
        else resize()
      })
    }
  },
)

// 地图就绪后初始化
watch(mapReady, (ready) => {
  if (ready && chartRef.value && !props.loading) {
    nextTick(() => init())
  }
})

onMounted(async () => {
  await loadMap()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chartInstance.value?.dispose()
})
</script>

<template>
  <div class="map-wrapper">
    <div v-show="!loading && mapReady" ref="chartRef" class="map-container" />
    <div v-show="loading && !mapReady" class="map-placeholder">
      {{ mapError ? '地图加载失败' : '加载中…' }}
    </div>
  </div>
</template>

<style scoped>
.map-wrapper {
  flex: 1;
  display: flex;
  min-height: 0;
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
</style>
