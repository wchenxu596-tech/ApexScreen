<script setup lang="ts">
/**
 * RadarModelChart — 雷达模型图
 * 多维度能力评估，支持多系列对比
 */
import { computed, ref, watch, onMounted, onBeforeUnmount, shallowRef } from 'vue'
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

const LINE_COLORS = ['#60a5fa', '#fbbf24']

const option = computed(() => {
  if (!props.data) return {}

  return {
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
    },
    legend: {
      data: props.data.series.map((s) => s.name),
      textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
      top: 0,
      right: 0,
      itemWidth: 16,
      itemHeight: 8,
    },
    radar: {
      indicator: props.data.indicators.map((ind) => ({ name: ind.name, max: ind.max })),
      radius: '60%',
      center: ['50%', '55%'],
      splitNumber: 4,
      shape: 'polygon',
      axisName: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    },
    series: [
      {
        type: 'radar',
        data: props.data.series.map((s, i) => ({
          name: s.name,
          value: s.value,
          lineStyle: { color: LINE_COLORS[i], width: 2 },
          areaStyle: { color: LINE_COLORS[i] + '25' },
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
onMounted(() => {
  init()
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chartInstance.value?.dispose()
})
</script>

<template>
  <div v-if="!loading && data" ref="chartRef" class="chart-container" />
  <div v-else class="chart-placeholder">{{ loading ? '加载中…' : '暂无数据' }}</div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 240px;
}
.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 260px;
  color: rgb(255, 255, 255, 30%);
  font-size: 13px;
}
</style>
