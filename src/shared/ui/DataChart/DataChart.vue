<script setup lang="ts">
/**
 * DataChart — 通用数据图表组件
 * 基于 ECharts 封装，支持 line / bar / pie 三种基本图表类型
 */

import { computed, ref, watch, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
])

defineOptions({ name: 'DataChart' })

const props = withDefaults(
  defineProps<{
    type: 'line' | 'bar' | 'pie'
    data: Record<string, unknown>[]
    xKey?: string
    yKey?: string
    nameKey?: string
    valueKey?: string
    color?: string
    height?: number
  }>(),
  {
    xKey: 'name',
    yKey: 'value',
    nameKey: 'name',
    valueKey: 'value',
    color: '#60a5fa',
    height: 260,
  },
)

const chartRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const chartOptions = computed(() => {
  const isPie = props.type === 'pie'

  if (isPie) {
    return {
      tooltip: {
        trigger: 'item' as const,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: 'transparent',
      },
      series: [
        {
          type: 'pie',
          data: props.data.map((d) => ({
            name: d[props.nameKey] as string,
            value: d[props.valueKey] as number,
          })),
          center: ['50%', '50%'],
          radius: ['40%', '70%'],
          itemStyle: { borderRadius: 4 },
          label: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
        },
      ],
      color: ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f87171', '#38bdf8'],
    }
  }

  return {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderColor: 'transparent',
      axisPointer: { type: 'shadow' as const },
    },
    grid: { left: 40, right: 16, top: 16, bottom: 24 },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d[props.xKey]),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'dashed' } },
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
    },
    series: [
      {
        type: props.type,
        data: props.data.map((d) => d[props.yKey]),
        itemStyle: {
          color: props.color,
          borderRadius: props.type === 'bar' ? [2, 2, 0, 0] : undefined,
        },
        lineStyle: { color: props.color, width: 2 },
        areaStyle:
          props.type === 'line'
            ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: props.color + '40' },
                  { offset: 1, color: props.color + '05' },
                ]),
              }
            : undefined,
        smooth: props.type === 'line',
        symbol: props.type === 'line' ? 'circle' : 'none',
        symbolSize: 4,
      },
    ],
  }
})

function initChart() {
  if (!chartRef.value) return
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  chartInstance.value = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  chartInstance.value.setOption(chartOptions.value)
}

function resizeChart() {
  chartInstance.value?.resize()
}

watch(
  () => props.data,
  () => {
    if (chartInstance.value) {
      chartInstance.value.setOption(chartOptions.value, { notMerge: true })
    }
  },
  { deep: true },
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance.value?.dispose()
})
</script>

<template>
  <div ref="chartRef" class="data-chart" :style="{ height: `${height}px` }" />
</template>

<style scoped>
.data-chart {
  width: 100%;
}
</style>
