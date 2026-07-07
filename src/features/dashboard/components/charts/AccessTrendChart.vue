<script setup lang="ts">
/**
 * AccessTrendChart — 访问趋势折线图
 * 双轴：访问量 + 实时订单数 · 24h 滑动趋势窗口
 */
import { computed, ref, watch, onMounted, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { AccessTrendPoint } from '../../types'

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

defineOptions({ name: 'AccessTrendChart' })

const props = defineProps<{
  data: AccessTrendPoint[]
  loading?: boolean
}>()

const chartRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderColor: 'rgba(255,255,255,0.1)',
    textStyle: { color: '#e2e8f0', fontSize: 12 },
  },
  legend: {
    data: ['访问量', '订单数'],
    textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
    top: 0,
    right: 0,
    itemWidth: 16,
    itemHeight: 8,
  },
  grid: { left: 40, right: 16, top: 32, bottom: 20 },
  xAxis: {
    type: 'category',
    data: props.data.map((d) => d.time),
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    axisLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10 },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'dashed' } },
    axisLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10 },
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      data: props.data.map((d) => d.visits),
      lineStyle: { color: '#60a5fa', width: 2 },
      itemStyle: { color: '#60a5fa' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(96, 165, 250, 0.3)' },
          { offset: 1, color: 'rgba(96, 165, 250, 0.02)' },
        ]),
      },
    },
    {
      name: '订单数',
      type: 'line',
      smooth: true,
      symbol: 'diamond',
      symbolSize: 4,
      data: props.data.map((d) => d.orders),
      lineStyle: { color: '#34d399', width: 2 },
      itemStyle: { color: '#34d399' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(52, 211, 153, 0.2)' },
          { offset: 1, color: 'rgba(52, 211, 153, 0.01)' },
        ]),
      },
    },
  ],
}))

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
  <div v-if="!loading" ref="chartRef" class="chart-container" />
  <div v-else class="chart-placeholder">加载中…</div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 0;
}
.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgb(255, 255, 255, 30%);
  font-size: 13px;
}
</style>
