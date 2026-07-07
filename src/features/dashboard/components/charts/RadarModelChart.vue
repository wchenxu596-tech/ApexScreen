<script setup lang="ts">
/**
 * RadarModelChart — 雷达模型图（浅色主题）
 * 多维度能力评估，支持多系列对比
 */
import { computed, ref, watch, onMounted, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, RadarComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { RadarModelData } from '../../types'

echarts.use([RadarChart, TooltipComponent, LegendComponent, RadarComponent, CanvasRenderer])

defineOptions({ name: 'RadarModelChart' })

const props = defineProps<{
  data: RadarModelData | null
  loading?: boolean
}>()

const chartRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const LINE_COLORS = ['#2563eb', '#f97316']

const option = computed(() => {
  if (!props.data) return {}

  return {
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(37,99,235,0.1)',
      textStyle: { color: '#1e293b', fontSize: 12 },
    },
    legend: {
      data: props.data.series.map((s) => s.name),
      textStyle: { color: '#64748b', fontSize: 11 },
      top: 0,
      right: 0,
      itemWidth: 16,
      itemHeight: 8,
    },
    radar: {
      indicator: props.data.indicators.map((ind) => ({ name: ind.name, max: ind.max })),
      radius: '70%',
      center: ['50%', '55%'],
      splitNumber: 4,
      shape: 'polygon',
      axisName: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(100,116,139,0.12)' } },
      splitArea: { areaStyle: { color: ['rgba(37,99,235,0.02)', 'rgba(37,99,235,0.04)'] } },
      axisLine: { lineStyle: { color: 'rgba(100,116,139,0.15)' } },
    },
    series: [
      {
        type: 'radar',
        data: props.data.series.map((s, i) => ({
          name: s.name,
          value: s.value,
          lineStyle: { color: LINE_COLORS[i], width: 2 },
          areaStyle: { color: LINE_COLORS[i] + '20' },
          itemStyle: { color: LINE_COLORS[i] },
        })),
      },
    ],
  }
})

function init() {
  if (!chartRef.value) return
  chartInstance.value?.dispose()
  const inst = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  inst.setOption(option.value)
  chartInstance.value = inst
}

function resize() {
  chartInstance.value?.resize()
}

watch(option, () => chartInstance.value?.setOption(option.value, { notMerge: true }), {
  deep: true,
})
watch(
  () => props.loading,
  (val) => {
    if (!val && props.data) nextTick(() => resize())
  },
)
watch(
  () => props.data,
  (val) => {
    if (val && !props.loading) nextTick(() => resize())
  },
)
onMounted(async () => {
  await nextTick()
  init()
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chartInstance.value?.dispose()
})
</script>

<template>
  <div v-show="!loading && data" ref="chartRef" class="chart-container" />
  <div v-show="loading || !data" class="chart-placeholder">
    {{ loading ? '加载中…' : '暂无数据' }}
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  flex: 1;
  min-height: 0;
}
.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--dv-text-muted);
  font-size: 13px;
}
</style>
